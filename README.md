# MailCheck API - Documentation

This is a multi-level email verification service running on Cloudflare Workers.

---

## 1. Features

This API provides 6 levels of validation:
1.  **Syntax**: Standard email format check.
2.  **DNS**: Check if the domain has A/AAAA records.
3.  **MX**: Check for Mail Server records.
4.  **Disposable**: Detect throwaway email services.
5.  **Role-based**: Find emails like `admin@`, `support@`.
6.  **Free Provider**: Flag Gmail, Yahoo, etc.

---

## 2. API Endpoints

### Single Email Check
**GET `/verify?email=[address]`**

**Request:**
```bash
curl "https://mailcheck.bensontech.dev/verify?email=test@gmail.com"
```

**Response:**
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

### Batch Email Check
**POST `/verify/batch`**

**Request:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"emails": ["test@gmail.com", "admin@google.com"]}' \
  "https://mailcheck.bensontech.dev/verify/batch"
```

---

## 3. Scoring
- **100**: Perfect business email.
- **80-99**: Highly deliverable.
- **60-79**: Common/Free provider.
- **<60**: Potentially problematic.
- **0-40**: Invalid or high-risk.

---

## 4. Local Development

```bash
# Start local server
npm run dev

# Run local tests
npx wrangler dev
```
