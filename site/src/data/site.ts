export const site = {
  name: 'OPC Vibe Stack',
  domain: 'opcvibestack.com',
  origin: 'https://opcvibestack.com',
  tagline: 'Ship alone, faster—with Claude Code, Codex, and Grok Build—then sell.',
  defaultLocale: 'en' as const,
  locales: ['en', 'zh'] as const,
  primaryToolIds: ['claude-code', 'codex', 'grok-build'] as const,
  ogImagePath: '/og/default.png',
};

export type Locale = (typeof site.locales)[number];

export const navEn = [
  { label: 'Stack', href: '/en/stack/' },
  { label: 'Research', href: '/en/research/' },
  { label: 'Build', href: '/en/build/' },
  { label: 'Sell', href: '/en/sell/' },
  { label: 'Playbooks', href: '/en/playbooks/' },
  { label: 'Hardware', href: '/en/hardware/' },
  { label: 'Changelog', href: '/en/changelog/' },
] as const;

/** Chinese nav: full zh section coverage (M3b). */
export const navZh = [
  { label: '工具栈', href: '/zh/stack/' },
  { label: '调研', href: '/zh/research/' },
  { label: '构建', href: '/zh/build/' },
  { label: '销售', href: '/zh/sell/' },
  { label: 'Playbooks', href: '/zh/playbooks/' },
  { label: '硬件', href: '/zh/hardware/' },
  { label: '更新日志', href: '/zh/changelog/' },
] as const;

/** @deprecated use navForLocale */
export const nav = navEn;

export const footerLinksEn = [
  { label: 'About', href: '/en/about/' },
  { label: 'Disclaimer', href: '/en/about/#disclaimer' },
  { label: 'RSS', href: '/en/rss.xml' },
  { label: 'Anti-patterns', href: '/en/anti-patterns/' },
] as const;

export const footerLinksZh = [
  { label: '关于', href: '/zh/about/' },
  { label: '免责声明', href: '/zh/about/#disclaimer' },
  { label: '反模式', href: '/zh/anti-patterns/' },
  { label: 'RSS（英文）', href: '/en/rss.xml' },
] as const;

export const footerLinks = footerLinksEn;

export type Evidence = 'tested' | 'documentation-backed' | 'unverified';

export const evidenceCopy: Record<Evidence, string> = {
  tested: 'Reproduced by the editors (or equivalent) with date and environment noted.',
  'documentation-backed': 'Steps match official docs or a primary vendor source; not necessarily re-run this week.',
  unverified: 'Reported from a briefing or public post; original source checked but not re-tested. Keep numerical disclaimers.',
};

export const evidenceCopyZh: Record<Evidence, string> = {
  tested: '编辑已复现（或等价验证），并记录日期与环境。',
  'documentation-backed': '步骤与官方文档或主要厂商来源一致；不一定本周重跑。',
  unverified: '来自简报或公开帖文；已核对原文但未复测。数字声明请保留。',
};
