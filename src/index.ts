import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { verifyEmail } from './validators/index';
import { rateLimit } from './middleware/rate-limit';

const app = new Hono();

// Global middleware
app.use('*', cors());
app.use('*', rateLimit());

// --- Routes ---

app.get('/', (c) => {
  return c.json({
    name: "Email Verification API (Cloudflare Worker)",
    version: "1.0.0",
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

    // Limit batch size to protect CPU limits on free plan (10ms CPU total)
    if (emails.length > 50) {
      return c.json({ error: "Batch size exceeds limit (max 50 emails)" }, 400);
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
