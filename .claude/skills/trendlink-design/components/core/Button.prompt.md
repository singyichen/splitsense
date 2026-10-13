Brand action button — use for any primary/secondary action; the golden pill `primary` is reserved for the single most important CTA on a view (了解更多, 立即諮詢).

```jsx
<Button variant="primary" size="lg" iconRight={<ArrowIcon />}>立即諮詢</Button>
<Button variant="secondary">了解更多</Button>
<Button variant="outline" size="sm">取消</Button>
```

Variants: `primary` (golden CTA), `secondary` (navy), `outline`, `ghost`. Sizes: `sm | md | lg`. Use `shape="rounded"` for dense app toolbars; default `pill` matches the marketing site. Supports `iconLeft` / `iconRight`, `fullWidth`, `disabled`.
