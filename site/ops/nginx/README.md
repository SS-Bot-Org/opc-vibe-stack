# Nginx canonical redirects (example only)

`opcvibestack.conf.example` adds two normalization rules that the live site still needs:

1. `www.opcvibestack.com` → `https://opcvibestack.com` with the same path and query.
2. Any explicit `index.html` → the directory URL (`/en/index.html` → `/en/`), query preserved.

Do **not** apply this file from a content pull request. A maintainer should review the live
server (and Cloudflare) first, then install or merge the snippet and reload nginx.

Suggested apply steps (operator only):

1. Diff against the live site config and confirm where TLS and `www` are already handled.
2. Install the `www` server block and the `index.html` locations without dropping existing TLS, logs, or deny rules.
3. `nginx -t` and reload.
4. Check: `https://www.opcvibestack.com/en/?utm=1` and `https://opcvibestack.com/en/index.html?utm=1` both 301 to `https://opcvibestack.com/en/?utm=1`.
