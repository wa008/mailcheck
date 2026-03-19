import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { html } from 'hono/html';
import { verifyEmail } from './validators/index';
import { rateLimit } from './middleware/rate-limit';
import { getFrontendHtml } from './frontend';

const app = new Hono();

// Global middleware
app.use('*', cors());
app.use('*', rateLimit());

// --- Routes ---

app.get('/', (c) => {
  return c.html(getFrontendHtml());
});

app.get('/api', (c) => {
  return c.json({
    name: "MailCheck API (Cloudflare Worker)",
    version: "1.2.0",
    levels: "L1-L6 (Syntax, DNS, MX, Disposable, Role, Free Provider)",
    endpoints: {
      single: "GET /verify?email=user@example.com",
      batch: "POST /verify/batch (JSON { emails: string[] })"
    }
  });
});

app.get('/health', (c) => {
  return c.json({ status: "ok" });
});

// Single email verification (GET /verify)
app.get('/verify', async (c) => {
  const email = c.req.query('email');
  
  if (!email) {
    return c.json({ error: "Missing email parameter" }, 400);
  }

  const result = await verifyEmail(email);
  return c.json(result);
});

// Batch email verification (POST /verify/batch)
app.post('/verify/batch', async (c) => {
  try {
    const { emails } = await c.req.json();
    
    if (!emails || !Array.isArray(emails)) {
      return c.json({ error: "Invalid input. Expected { emails: string[] }" }, 400);
    }

    // Limit batch size to 15 to stay within Cloudflare Free subrequest limits (50 total)
    // 15 emails * 3 DNS queries = 45 subrequests.
    if (emails.length > 15) {
      return c.json({ error: "Batch size exceeds limit (max 15 emails for Free Plan)" }, 400);
    }

    const results = await Promise.all(emails.map(email => verifyEmail(email)));
    
    const summary = {
      total: results.length,
      valid: results.filter(r => r.valid).length,
      invalid: results.filter(r => !r.valid).length
    };

    return c.json({ results, summary });
  } catch (error) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
});

// --- Error Handlers ---

app.notFound((c) => {
  return c.json({ error: "Endpoint not found" }, 404);
});

app.onError((err, c) => {
  console.error("Worker error:", err);
  return c.json({
    error: "Internal server error",
    details: err.message
  }, 500);
});

export default app;
