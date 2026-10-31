"""共用 fixture。資料下載一次、整個 session 共用。"""

from __future__ import annotations

import pytest

from splitsense.data import build_items, load_annotations
from splitsense.split import build_split_manifest


@pytest.fixture(scope="session")
def annotations():
    return load_annotations()


@pytest.fixture(scope="session")
def table(annotations):
    return build_items(annotations)


@pytest.fixture(scope="session")
def split_manifest(table):
    return build_split_manifest(table)
