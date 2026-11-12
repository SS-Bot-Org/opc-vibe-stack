# Nginx canonical redirects

`opcvibestack.conf.example` is a sanitized copy of the live VPS config applied
on 2026-11-11. It is documentation of what is running, not a content-release
artifact. Do **not** apply this file from a content pull request. Changing live
nginx is a separate operator step (backup, `nginx -t`, reload, verify, rollback).

Canonical host: `https://opcvibestack.com/<path>/` (apex, HTTPS, trailing slash,
no `www`, no explicit `index.html`). Path and query are preserved on redirects.

## What the live config does

1. `http://` and `https://www.opcvibestack.com$request_uri` →
   `https://opcvibestack.com$request_uri` (301). The **HTTPS www server block**
   is required because TLS already terminates on the VPS. The Let's Encrypt
   certificate covers both apex and `www`; do not drop those cert paths when
   editing.
2. Any explicit `index.html` (`/index.html` or `/<path>/index.html`) → the
   directory URL (`/en/index.html` → `/en/`), query preserved, using
   `if ($request_uri …)` rather than `location` blocks.
3. Existing apex HTTP → HTTPS and `/` → `/en/` redirects are unchanged.
   `try_files $uri $uri/ $uri/index.html` still serves directory URLs as 200.

## Why `if ($request_uri)` instead of `location` for `index.html`

An earlier sketch used:

```nginx
location = /index.html {
    return 301 /$is_args$args;
}
location ~* ^(.+)/index\.html$ {
    return 301 $1/$is_args$args;
}
```

Those locations match the rewritten `$uri`. With
`try_files $uri $uri/ $uri/index.html` and nginx's default `index index.html`,
a client request to `/en/` can be internally rewritten to `/en/index.html`,
which would then 301 back to `/en/` — a redirect loop.

`$request_uri` is the original client URI (including the query string). The
`if` + `return 301` form therefore redirects only when the client actually
asked for `index.html`. Internal `try_files` / index-module rewrites still
serve the file, and `/en` still 301s to `/en/`.

The path capture must be `([^?]*)`, not `(.+)`. `.+` can cross `?`, so a
query value that happens to contain `/index.html` is treated as the page
path. The live repro was `/en/?next=/index.html` 301ing to
`/en/?next=/?next=/index.html` and looping. Restricting the capture to the
path means that URL stays 200 with the query intact, while a real
`/en/stack/index.html?next=/index.html` still 301s once to
`/en/stack/?next=/index.html`.

## Apply or change (operator only)

1. Diff this file against `/etc/nginx/sites-available/opcvibestack.conf` on the
   VPS. Confirm TLS, logs, and any deny rules are preserved.
2. Back up the live file with a UTC timestamp, and keep a second copy (for
   example under `/root/nginx-backups/`).
3. Install the new config.
4. Run `nginx -t`. If it fails, restore the backup and stop.
5. Reload nginx (`systemctl reload nginx`).
6. Run the verification curls below. On any failure, roll back immediately.

## Rollback

```bash
cp -a /etc/nginx/sites-available/opcvibestack.conf.bak-<UTC-stamp> \
      /etc/nginx/sites-available/opcvibestack.conf
nginx -t && systemctl reload nginx
```

Confirm `nginx -t` succeeds and `systemctl is-active nginx` is `active` after
the restore. Do not start a new change until the previous config is serving
again.

## Verification curls

Probe the origin (use `curl --resolve` to the VPS A record if a local resolver
intercepts these names). Expect 301 to the apex canonical URL, query preserved.
Directory URLs and static files stay 200. Follow redirects with `--max-redirs 5`
and confirm there is no loop.

```bash
# www HTTP and HTTPS → apex (query preserved)
curl -sSI http://www.opcvibestack.com/en/
# Location: https://opcvibestack.com/en/
curl -sSI 'http://www.opcvibestack.com/en/?utm=1'
# Location: https://opcvibestack.com/en/?utm=1
curl -sSI https://www.opcvibestack.com/en/
curl -sSI 'https://www.opcvibestack.com/en/?utm=1'

# explicit index.html → directory URL (query preserved)
curl -sSI https://opcvibestack.com/en/index.html
# Location: https://opcvibestack.com/en/
curl -sSI https://opcvibestack.com/zh/index.html
# Location: https://opcvibestack.com/zh/
curl -sSI 'https://opcvibestack.com/en/stack/index.html?x=1'
# Location: https://opcvibestack.com/en/stack/?x=1

# query values may contain "/index.html" and must not trigger a redirect
curl -sSI 'https://opcvibestack.com/en/?next=/index.html'
# HTTP/1.1 200 (no Location)
curl -sSI 'https://opcvibestack.com/en/stack/index.html?next=/index.html'
# Location: https://opcvibestack.com/en/stack/?next=/index.html

# apex pages, robots, sitemap, and 404 still behave as before
curl -sSI https://opcvibestack.com/en/
curl -sSI https://opcvibestack.com/zh/
curl -sSI https://opcvibestack.com/robots.txt
curl -sSI https://opcvibestack.com/sitemap.xml
curl -sSI https://opcvibestack.com/this-page-does-not-exist-opc-probe

# HTTP → HTTPS and / → /en/ still work
curl -sSI http://opcvibestack.com/en/
curl -sSI https://opcvibestack.com/

# no redirect loop (directory URL is a 200 with 0 hops)
curl -sS -o /dev/null -w '%{http_code} %{url_effective} %{num_redirects}\n' \
  -L --max-redirs 5 'https://www.opcvibestack.com/en/?utm=1'
curl -sS -o /dev/null -w '%{http_code} %{url_effective} %{num_redirects}\n' \
  -L --max-redirs 5 'https://opcvibestack.com/en/index.html?utm=1'
curl -sS -o /dev/null -w '%{http_code} %{url_effective} %{num_redirects}\n' \
  -L --max-redirs 5 https://opcvibestack.com/en/
curl -sS -o /dev/null -w '%{http_code} %{url_effective} %{num_redirects}\n' \
  -L --max-redirs 5 'https://opcvibestack.com/en/?next=/index.html'
# 200 https://opcvibestack.com/en/?next=/index.html 0
curl -sS -o /dev/null -w '%{http_code} %{url_effective} %{num_redirects}\n' \
  -L --max-redirs 5 'https://opcvibestack.com/en/stack/index.html?next=/index.html'
# 200 https://opcvibestack.com/en/stack/?next=/index.html 1
```
