import { uiEn, type UiStrings } from '../data/ui/en';
import { uiZh } from '../data/ui/zh';
import { navEn, navZh, footerLinksEn, footerLinksZh, type Locale } from '../data/site';

export function uiFor(locale: Locale | string): UiStrings {
  return locale === 'zh' ? uiZh : uiEn;
}

export function navFor(locale: Locale | string) {
  return locale === 'zh' ? navZh : navEn;
}

export function footerFor(locale: Locale | string) {
  return locale === 'zh' ? footerLinksZh : footerLinksEn;
}

export function detectLocaleFromPath(pathname: string): Locale {
  return pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en';
}
