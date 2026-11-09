"""BGE-M3 dense embedding 與快取（研究規格 7.2）。

Embedding 只跟文字有關、跟 reveal 無關，所以 31,603 個 item 只需編碼一次，
5 個 reveal seed 共用同一份向量。

快取檔與 metadata 一起存。讀快取時比對 metadata，只要模型、revision、
`normalize_embeddings`、`max_length`、維度或 item_id 順序有任何一項不同就重算
——沿用舊快取會讓「換了模型但分數沒變」這種錯誤完全不報錯。

`sentence_transformers` 放在函式內 import：沒有裝 `embed` extra 時這個模組仍
可匯入，`features`／`models` 的主線才不會被選做項目綁住。
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from typing import Protocol

import numpy as np
import pandas as pd

from splitsense import config as cfg
from splitsense.features import VISIBLE_FEATURE_NAMES, visible_features

# 決定快取能不能沿用的欄位。`created_at`、`device`、`batch_size` 只是紀錄，
# 不影響向量的值，所以不列入比對。
SIGNATURE_KEYS = (
    "model_name",
    "model_revision",
    "normalize_embeddings",
    "max_length",
    "dimension",
    "item_ids",
)


class Encoder(Protocol):
    """把一批文字編成 (n, dim) 向量。測試用假的實作注入，不必載 2.3 GB 模型。"""

    def __call__(self, texts: list[str]) -> np.ndarray: ...


@dataclass
class EmbeddingStore:
    """一份向量加上它的 metadata，可依 item_id 取列。"""

    matrix: np.ndarray
    item_ids: list[str]
    metadata: dict
    _index: dict[str, int] = field(init=False, repr=False)

    def __post_init__(self) -> None:
        if self.matrix.shape[0] != len(self.item_ids):
            raise ValueError(
                f"向量列數 {self.matrix.shape[0]} 與 item_id 數 {len(self.item_ids)} 不一致"
            )
        self._index = {item_id: i for i, item_id in enumerate(self.item_ids)}

    @property
    def dimension(self) -> int:
        return int(self.matrix.shape[1])

    def lookup(self, item_ids) -> np.ndarray:
        """依給定順序取列。缺任何一個 id 就報錯，不靜默補零。"""
        try:
            rows = [self._index[str(i)] for i in item_ids]
        except KeyError as exc:  # pragma: no cover - 只在快取與 split 不同步時發生
            raise KeyError(f"快取裡沒有 item_id {exc.args[0]}，請重建 embedding") from exc
        return self.matrix[rows]


def resolve_device() -> str:
    """Apple Silicon 用 mps，沒有就退回 cpu。"""
    try:
        import torch
    except ImportError:  # pragma: no cover - 沒裝 embed extra
        return "cpu"
    if torch.backends.mps.is_available():
        return "mps"
    if torch.cuda.is_available():  # pragma: no cover - 本機沒有 CUDA
        return "cuda"
    return "cpu"


def resolve_revision(model_name: str = cfg.EMBED_MODEL_NAME) -> str | None:
    """查 HF 上的 commit sha，寫進 metadata 讓快取綁得住模型版本。

    離線或查不到時回傳 None——寧可記成「未知」，也不要編一個假的 hash。
    """
    try:
        from huggingface_hub import model_info

        return str(model_info(model_name, revision=cfg.EMBED_MODEL_REVISION).sha)
    except Exception:  # noqa: BLE001 - 離線、429、repo 改名都只影響紀錄，不影響向量
        return None


def build_encoder(
    model_name: str = cfg.EMBED_MODEL_NAME,
    revision: str | None = cfg.EMBED_MODEL_REVISION,
    device: str | None = None,
    batch_size: int = cfg.EMBED_BATCH_SIZE,
    max_length: int = cfg.EMBED_MAX_LENGTH,
    normalize: bool = cfg.EMBED_NORMALIZE,
) -> Encoder:
    """真正的 bge-m3 編碼器。只在本機跑，不送往任何外部 API（研究規格 9.3）。"""
    from sentence_transformers import SentenceTransformer

    model = SentenceTransformer(model_name, revision=revision, device=device or resolve_device())
    model.max_seq_length = max_length

    def encode(texts: list[str]) -> np.ndarray:
        vectors = model.encode(
            texts,
            batch_size=batch_size,
            normalize_embeddings=normalize,
            convert_to_numpy=True,
            show_progress_bar=True,
        )
        return np.asarray(vectors, dtype=np.float32)

    return encode


def _cache_paths(model_name: str, cache_dir: Path | None = None) -> tuple[Path, Path]:
    directory = cache_dir or cfg.EMBEDDINGS_DIR
    slug = model_name.replace("/", "__")
    return directory / f"{slug}.npy", directory / f"{slug}.meta.json"


def _signature(metadata: dict) -> tuple:
    return tuple(json.dumps(metadata.get(k), sort_keys=True) for k in SIGNATURE_KEYS)


def load_or_build(
    item_ids,
    texts,
    *,
    encoder: Encoder | None = None,
    cache_dir: Path | None = None,
    model_name: str = cfg.EMBED_MODEL_NAME,
    revision: str | None = None,
    max_length: int = cfg.EMBED_MAX_LENGTH,
    normalize: bool = cfg.EMBED_NORMALIZE,
    dimension: int = cfg.EMBED_DIM,
    force: bool = False,
) -> tuple[EmbeddingStore, float]:
    """取得 embedding：快取可用就讀，否則編碼後寫回。

    回傳 `(store, seconds)`；`seconds` 是這次實際編碼的秒數，讀到快取時為 0.0
    （研究規格 8.7 的決策規則要把耗時算進成本）。
    """
    item_ids = [str(i) for i in item_ids]
    texts = [str(t) for t in texts]
    if len(item_ids) != len(texts):
        raise ValueError(f"item_id 數 {len(item_ids)} 與文字數 {len(texts)} 不一致")

    expected = {
        "model_name": model_name,
        "model_revision": revision,
        "normalize_embeddings": normalize,
        "max_length": max_length,
        "dimension": dimension,
        "item_ids": item_ids,
    }

    vectors_path, meta_path = _cache_paths(model_name, cache_dir)
    if not force and vectors_path.exists() and meta_path.exists():
        cached = json.loads(meta_path.read_text(encoding="utf-8"))
        # revision 為 None 表示「沒釘版本」，此時不以它判定快取失效：離線查不到
        # sha 會讓每次都重算，那比沿用舊快取更糟。釘了版本就一定要比對。
        reference = dict(expected)
        if revision is None:
            reference["model_revision"] = cached.get("model_revision")
        if _signature(cached) == _signature(reference):
            matrix = np.load(vectors_path)
            return EmbeddingStore(matrix=matrix, item_ids=item_ids, metadata=cached), 0.0
        print(f"[embed] 快取 metadata 與現在的設定不一致，重算：{meta_path.name}")

    encode = encoder or build_encoder(
        model_name=model_name, revision=revision, max_length=max_length, normalize=normalize
    )
    started = datetime.now(UTC)
    matrix = np.asarray(encode(texts), dtype=np.float32)
    seconds = (datetime.now(UTC) - started).total_seconds()
    if matrix.shape != (len(item_ids), dimension):
        raise ValueError(f"編碼結果形狀 {matrix.shape} 不是 ({len(item_ids)}, {dimension})")

    metadata = dict(expected)
    metadata.update(
        {
            "created_at": started.isoformat(),
            "encode_seconds": round(seconds, 1),
            "device": resolve_device(),
            "batch_size": cfg.EMBED_BATCH_SIZE,
            "n_items": len(item_ids),
        }
    )
    vectors_path.parent.mkdir(parents=True, exist_ok=True)
    np.save(vectors_path, matrix)
    meta_path.write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return EmbeddingStore(matrix=matrix, item_ids=item_ids, metadata=metadata), seconds


def build_embed_matrix(manifest: pd.DataFrame, store: EmbeddingStore) -> np.ndarray:
    """串接 embedding 與可見標註特徵，欄序與 TF-IDF 版本一致（文字在前）。

    回傳 dense float32：PCA 不吃稀疏矩陣，而 1024 維本來就是 dense 的。
    """
    text_block = store.lookup(manifest["item_id"])
    visible_block = visible_features(manifest).to_numpy(dtype=np.float32)
    return np.hstack([text_block, visible_block])


def embed_feature_names(dimension: int) -> list[str]:
    return [f"emb_{i:04d}" for i in range(dimension)] + list(VISIBLE_FEATURE_NAMES)


__all__ = [
    "SIGNATURE_KEYS",
    "EmbeddingStore",
    "build_embed_matrix",
    "build_encoder",
    "embed_feature_names",
    "load_or_build",
    "resolve_device",
    "resolve_revision",
]
