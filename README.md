# Email Check API - Documentation (文档)

This is a multi-level email verification service (多层级邮件验证服务) running on Cloudflare Workers.

---

## 1. Features (功能)

This API provides 6 levels of validation (6个级别的校验):
1.  **Syntax (语法)**: Standard email format check (标准邮件格式检查).
2.  **DNS (域名解析)**: Check if the domain has A/AAAA records (域名解析记录检查).
3.  **MX (邮件服务器)**: Check for Mail Server records (邮件服务器记录检查).
4.  **Disposable (临时邮箱)**: Detect throwaway email services (自动检测临时/一次性邮箱).
5.  **Role-based (角色前缀)**: Find emails like `admin@`, `support@` (识别类似 admin/support 的角色账号).
6.  **Free Provider (免费邮箱)**: Flag Gmail, Yahoo, etc (标记免费邮箱服务商).

---

## 2. API Endpoints (接口地址)

### Single Email Check (单次验证)
**GET `/verify?email=[address]`**

**Request (请求):**
```bash
curl "https://email-verify.yourname.workers.dev/verify?email=test@gmail.com"
```

**Response (响应):**
```json
{
  "email": "test@gmail.com",
  "valid": true,
  "score": 65,
  "checks": {
    "syntax": { "valid": true, "reason": "Valid syntax" },
    "dns": { "valid": true, "hasARecord": true, "hasAAAARecord": true },
    "mx": { "valid": true, "records": ["...google-smtp..."] },
    "disposable": { "isDisposable": false },
    "roleBased": { "isRole": true, "role": "test" },
    "freeProvider": { "isFree": true, "provider": "gmail.com" }
  },
  "timestamp": "2026-03-19T15:05:03.748Z"
}
```

### Batch Email Check (批量验证)
**POST `/verify/batch`**

**Request (请求):**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"emails": ["test@gmail.com", "admin@google.com"]}' \
  "https://email-verify.yourname.workers.dev/verify/batch"
```

---

## 3. Scoring (评分机制)
- **100**: Perfect business email (完美的企业邮箱).
- **80-99**: Highly deliverable (高送达率).
- **60-79**: Common/Free provider (常见/免费邮箱).
- **<60**: Potentially problematic (可能存在问题).
- **0-40**: Invalid or high-risk (无效或高风险).

---

## 4. Local Development (本地开发)

```bash
# Start local server (启动本地测试)
npm run dev

# Run local tests (本地测试)
npx wrangler dev
```
