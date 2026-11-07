# OPC Vibe Stack (site)

English-first static site for one-person companies using Claude Code, Codex, and Grok Build.

- Product: [PRD v0.5](../PRD-v0.5-en.md)
- Design: [SDD v0.2](../SDD-v0.2.md)
- Domain: `opcvibestack.com`

## Develop

Requires Node.js ≥ 22.23.4.

```bash
npm install
npm run dev
npm run build
```

## Deploy

See `ops/deploy.sh.example` and `ops/nginx/opcvibestack.conf.example`. M1 releases are self-contained under `/srv/opcvibestack/releases/<id>/`. Do not request VPS credentials until Fan is ready to deploy.
