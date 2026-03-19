export const getFrontendHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EmailVerify - Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #6366f1; --bg: #0f172a; --card-bg: rgba(30, 41, 59, 0.7); --text: #f8fafc; --text-muted: #94a3b8; }
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }
        body { background:var(--bg); color:var(--text); min-height:100vh; padding:2rem 1rem; display:flex; flex-direction:column; align-items:center; }
        .container { max-width: 800px; width:100%; }
        h1 { font-size: 2.5rem; text-align:center; margin-bottom: 2rem; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .card { background: var(--card-bg); border-radius: 1rem; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 2rem; backdrop-filter: blur(10px); }
        .input-row { display: flex; gap: 0.5rem; }
        input { flex:1; background: #000; border:1px solid #333; color:#fff; padding:0.8rem; border-radius: 0.5rem; }
        button { background: var(--primary); color:#fff; border:none; padding:0.8rem 1.5rem; border-radius: 0.5rem; cursor:pointer; font-weight:600; }
        .result-item { background: rgba(0,0,0,0.2); margin-top:0.5rem; padding:1rem; border-radius:0.5rem; display:flex; justify-content:space-between; align-items:center; }
        .valid { border-left: 4px solid #10b981; }
        .invalid { border-left: 4px solid #ef4444; }
        .badge { font-size:0.7rem; padding:0.1rem 0.3rem; margin-right:0.3rem; border-radius:0.2rem; background:rgba(255,255,255,0.1); color:#94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>EmailVerify</h1>
        <div class="card">
            <div class="input-row">
                <input type="text" id="email" placeholder="email@example.com" onkeydown="if(event.key==='Enter')verify()">
                <button onclick="verify()">Verify</button>
            </div>
            <div id="loading" style="display:none; text-align:center; margin-top:1rem;">Checking...</div>
        </div>
        <div id="results"></div>
    </div>
    <script>
        async function verify() {
            const email = document.getElementById('email').value;
            if(!email) return;
            document.getElementById('loading').style.display = 'block';
            try {
                const res = await fetch(\`/verify?email=\${encodeURIComponent(email)}\`);
                const data = await res.json();
                const div = document.createElement('div');
                div.className = 'result-item ' + (data.valid ? 'valid' : 'invalid');
                
                let badges = '';
                if(data.checks.disposable.isDisposable) badges += '<span class="badge">Disposable</span>';
                if(data.checks.roleBased.isRole) badges += '<span class="badge">Role</span>';

                div.innerHTML = '<div><strong>' + data.email + '</strong><br>' + badges + '<span>' + data.checks.syntax.reason + '</span></div><div style="font-weight:bold">' + data.score + '</div>';
                document.getElementById('results').prepend(div);
            } finally { document.getElementById('loading').style.display = 'none'; }
        }
    </script>
</body>
</html>
`;
