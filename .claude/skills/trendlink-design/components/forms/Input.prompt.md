Form text input with label, hint, error, and optional leading icon.

```jsx
<Input label="公司名稱" placeholder="請輸入公司名稱" />
<Input label="電子郵件" type="email" iconLeft={<MailIcon/>} hint="我們不會公開您的信箱" />
<Input label="統一編號" error="格式不正確" />
```
Sizes `sm | md | lg`. Pair with `Select`, `Checkbox`, `Switch` in the same `forms/` group.
