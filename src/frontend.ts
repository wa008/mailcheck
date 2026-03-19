export const getFrontendHtml = () => {
  const BASE = 'https://mailcheck.bensontech.dev';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MailCheck - Email Verification Service</title>
    <meta name="description" content="Free multi-level email verification API. Check syntax, DNS, MX records, disposable emails, and more.">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-light: #818cf8;
            --bg: #0f172a;
            --bg-card: rgba(30, 41, 59, 0.65);
            --border: rgba(255,255,255,0.08);
            --text: #f1f5f9;
            --text-muted: #94a3b8;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --code-bg: rgba(0,0,0,0.35);
        }
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            background-image: radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.12) 0, transparent 60%),
                              radial-gradient(ellipse at 80% 100%, rgba(139,92,246,0.08) 0, transparent 60%);
            color: var(--text);
            min-height: 100vh;
            padding: 2.5rem 1rem 4rem;
        }
        .container { max-width: 860px; margin: 0 auto; }

        /* Header */
        header { text-align: center; margin-bottom: 2.5rem; }
        h1 {
            font-size: 2.8rem; font-weight: 700;
            background: linear-gradient(135deg, #818cf8, #c084fc, #f0abfc);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            margin-bottom: 0.4rem;
        }
        header p { color: var(--text-muted); font-size: 1.05rem; }

        /* Cards */
        .card {
            background: var(--bg-card);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border);
            border-radius: 1rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }

        /* Try it */
        .input-row { display:flex; gap:0.5rem; }
        input {
            flex:1; background: var(--code-bg); border:1px solid var(--border);
            color: var(--text); padding:0.75rem 1rem; border-radius:0.5rem; font-size:0.95rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus { outline:none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(99,102,241,0.25); }
        .btn {
            background: var(--primary); color:#fff; border:none;
            padding: 0.75rem 1.5rem; border-radius:0.5rem; font-weight:600;
            cursor:pointer; transition: transform 0.15s, box-shadow 0.15s;
            box-shadow: 0 4px 12px rgba(99,102,241,0.3);
        }
        .btn:hover { transform:translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }

        /* Results */
        .result-item {
            background: var(--code-bg); margin-top:0.6rem; padding:1rem; border-radius:0.6rem;
            display:flex; justify-content:space-between; align-items:center;
            animation: slideUp 0.25s ease-out;
        }
        .result-item.valid { border-left: 3px solid var(--success); }
        .result-item.invalid { border-left: 3px solid var(--danger); }
        .badge {
            font-size:0.7rem; padding:0.15rem 0.4rem; margin-right:0.3rem;
            border-radius:0.25rem; background:rgba(255,255,255,0.07); color:var(--text-muted);
        }
        .score { font-size:1.1rem; font-weight:700; }

        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        /* Section headings */
        .section-title {
            font-size: 1.3rem; font-weight: 600; margin-bottom: 1rem;
            display:flex; align-items:center; gap:0.5rem;
        }
        .section-title .icon { font-size:1.2rem; }

        /* API Docs */
        .endpoint { margin-bottom: 1.25rem; }
        .method-badge {
            display:inline-block; font-family:'JetBrains Mono',monospace; font-size:0.75rem;
            font-weight:600; padding:0.2rem 0.5rem; border-radius:0.3rem; margin-right:0.4rem;
        }
        .method-get { background:rgba(16,185,129,0.15); color:#34d399; }
        .method-post { background:rgba(99,102,241,0.15); color:#a5b4fc; }
        .endpoint-path {
            font-family:'JetBrains Mono',monospace; font-size:0.9rem; color:var(--text);
        }
        .endpoint-desc { color:var(--text-muted); font-size:0.85rem; margin-top:0.3rem; }

        pre {
            background: var(--code-bg); border:1px solid var(--border); border-radius:0.5rem;
            padding: 1rem; overflow-x:auto; font-family:'JetBrains Mono',monospace;
            font-size: 0.82rem; line-height:1.6; color:#cbd5e1; margin-top:0.6rem;
        }

        /* Levels table */
        .level-grid { display:grid; grid-template-columns: auto 1fr; gap: 0.4rem 1rem; font-size:0.88rem; }
        .level-tag {
            font-family:'JetBrains Mono',monospace; font-size:0.75rem; font-weight:600;
            background:rgba(99,102,241,0.12); color:var(--primary-light);
            padding:0.15rem 0.5rem; border-radius:0.3rem; text-align:center;
        }

        /* Footer */
        footer { text-align:center; color:var(--text-muted); font-size:0.8rem; margin-top:2rem; }

        #loading { display:none; text-align:center; margin-top:1rem; color:var(--text-muted); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>MailCheck</h1>
            <p>Multi-level email verification API</p>
        </header>

        <!-- Try it -->
        <div class="card">
            <div class="section-title"><span class="icon">⚡</span> Try It</div>
            <div class="input-row">
                <input type="text" id="email" placeholder="Enter email to verify..." onkeydown="if(event.key==='Enter')verify()">
                <button class="btn" onclick="verify()">Verify</button>
            </div>
            <div id="loading">Verifying...</div>
            <div id="results"></div>
        </div>

        <!-- Verification Levels -->
        <div class="card">
            <div class="section-title"><span class="icon">🛡️</span> Verification Levels</div>
            <div class="level-grid">
                <span class="level-tag">L1</span><span>Syntax — format validation</span>
                <span class="level-tag">L2</span><span>DNS — domain A/AAAA record check</span>
                <span class="level-tag">L3</span><span>MX — mail server record check</span>
                <span class="level-tag">L4</span><span>Disposable — throwaway email detection</span>
                <span class="level-tag">L5</span><span>Role — role-based prefix detection (admin, support...)</span>
                <span class="level-tag">L6</span><span>Free Provider — Gmail, Yahoo, etc.</span>
            </div>
        </div>

        <!-- API Documentation -->
        <div class="card">
            <div class="section-title"><span class="icon">📖</span> API Documentation</div>

            <div class="endpoint">
                <div>
                    <span class="method-badge method-get">GET</span>
                    <span class="endpoint-path">/verify?email={address}</span>
                </div>
                <div class="endpoint-desc">Verify a single email address. Returns validation result with score.</div>
<pre>curl "${BASE}/verify?email=test@gmail.com"</pre>
            </div>

            <div class="endpoint">
                <div>
                    <span class="method-badge method-post">POST</span>
                    <span class="endpoint-path">/verify/batch</span>
                </div>
                <div class="endpoint-desc">Verify multiple emails at once (max 15). Send JSON body with emails array.</div>
<pre>curl -X POST "${BASE}/verify/batch" \\
  -H "Content-Type: application/json" \\
  -d '{"emails": ["a@gmail.com", "b@outlook.com"]}'</pre>
            </div>

            <div class="endpoint">
                <div>
                    <span class="method-badge method-get">GET</span>
                    <span class="endpoint-path">/health</span>
                </div>
                <div class="endpoint-desc">Health check endpoint. Returns {"status": "ok"}.</div>
            </div>

            <div class="endpoint">
                <div>
                    <span class="method-badge method-get">GET</span>
                    <span class="endpoint-path">/api</span>
                </div>
                <div class="endpoint-desc">Returns API metadata and available endpoints.</div>
            </div>
        </div>

        <!-- Response Example -->
        <div class="card">
            <div class="section-title"><span class="icon">📋</span> Response Example</div>
<pre>{
  "email": "test@gmail.com",
  "valid": true,
  "score": 65,
  "checks": {
    "syntax":     { "valid": true, "reason": "Valid syntax" },
    "dns":        { "valid": true, "hasARecord": true, "hasAAAARecord": true },
    "mx":         { "valid": true, "records": ["gmail-smtp-in.l.google.com."] },
    "disposable": { "isDisposable": false },
    "roleBased":  { "isRole": true, "role": "test" },
    "freeProvider": { "isFree": true, "provider": "gmail.com" }
  },
  "timestamp": "2026-03-19T15:05:03.748Z"
}</pre>
        </div>

        <footer>MailCheck &mdash; Powered by Cloudflare Workers</footer>
    </div>

    <script>
        async function verify() {
            const email = document.getElementById('email').value;
            if(!email) return;
            document.getElementById('loading').style.display = 'block';
            try {
                const res = await fetch('/verify?email=' + encodeURIComponent(email));
                const data = await res.json();
                const div = document.createElement('div');
                div.className = 'result-item ' + (data.valid ? 'valid' : 'invalid');
                let badges = '';
                if(data.checks.disposable.isDisposable) badges += '<span class="badge" style="color:#ef4444">Disposable</span>';
                if(data.checks.roleBased.isRole) badges += '<span class="badge" style="color:#f59e0b">Role</span>';
                if(data.checks.freeProvider.isFree) badges += '<span class="badge">Free</span>';
                div.innerHTML = '<div><strong>' + data.email + '</strong><br>' + badges +
                    '<span style="font-size:0.82rem;color:#94a3b8">' + data.checks.syntax.reason +
                    ' · MX: ' + (data.checks.mx.valid ? '✅' : '❌') + '</span></div>' +
                    '<div class="score" style="color:' + (data.score>70?'#10b981':data.score>40?'#f59e0b':'#ef4444') + '">' + data.score + '</div>';
                document.getElementById('results').prepend(div);
            } catch(e) { console.error(e); }
            finally { document.getElementById('loading').style.display = 'none'; }
        }
    </script>
</body>
</html>
`;
};
