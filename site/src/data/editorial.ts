import type { Locale } from './site';

/** Accountable byline. Not a named person — confirm with the maintainer if a personal byline should replace this. */
export const editorial = {
  nameEn: 'OPC Vibe Stack editorial team',
  nameZh: 'OPC Vibe Stack 编辑团队',
  repoUrl: 'https://github.com/SS-Bot-Org/opc-vibe-stack',
  correctionsUrl: 'https://github.com/SS-Bot-Org/opc-vibe-stack/issues',
  /** Substantive About-page update date (author/correction section added). */
  aboutUpdated: '2026-11-10',
} as const;

export function editorialName(locale: Locale | string): string {
  return locale === 'zh' ? editorial.nameZh : editorial.nameEn;
}

export function aboutHref(locale: Locale | string): string {
  return locale === 'zh' ? '/zh/about/' : '/en/about/';
}
