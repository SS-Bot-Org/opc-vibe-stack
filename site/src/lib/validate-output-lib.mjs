export const SITE_ORIGIN = 'https://opcvibestack.com';

export function attrsOf(node) {
  return Object.fromEntries((node.attrs || []).map((a) => [a.name, a.value]));
}

export function parseSrcset(srcset) {
  if (!srcset?.trim()) return [];
  return srcset.split(',').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean);
}

/**
 * Resolve an image URL against the page path on the site origin.
 * Rejects data:, blob:, and any origin other than the site (covers //host, http:, https:).
 */
export function assertSameOriginAsset(src, pagePath, siteOrigin = SITE_ORIGIN) {
  const basePath = pagePath.replace(/index\.html$/, '');
  const normalizedBase = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const base = `${siteOrigin}${normalizedBase}`;
  let url;
  try {
    url = new URL(src, base);
  } catch {
    throw new Error(`${pagePath}: invalid image URL (${src})`);
  }
  if (url.protocol === 'data:') {
    throw new Error(`${pagePath}: data: image URLs are not allowed (${src})`);
  }
  if (url.protocol === 'blob:') {
    throw new Error(`${pagePath}: blob: image URLs are not allowed (${src})`);
  }
  if (url.origin !== siteOrigin) {
    throw new Error(`${pagePath}: external image hotlink forbidden (${src})`);
  }
  return url;
}

export function resolveLocalPath(urlPath, files) {
  const key = decodeURIComponent(urlPath) + (urlPath.endsWith('/') ? 'index.html' : '');
  if (files.has(key)) return key;
  const decoded = decodeURIComponent(urlPath);
  if (files.has(decoded)) return decoded;
  return null;
}

export function validateImageRef(img, files, siteOrigin = SITE_ORIGIN) {
  if (!img.fromSrcset) {
    if (img.alt === undefined) throw new Error(`${img.from}: img missing alt attribute (${img.src})`);
    if (!img.decorative && img.alt.trim() === '') {
      throw new Error(`${img.from}: informative img needs non-empty alt or data-decorative="true" (${img.src})`);
    }
  }
  const url = assertSameOriginAsset(img.src, img.from, siteOrigin);
  const resolved = resolveLocalPath(url.pathname, files);
  if (!resolved) throw new Error(`${img.from}: missing image ${img.src}`);
  return resolved;
}

export function collectImageRefsFromHtml(html, pageKey) {
  // Lightweight: used by unit tests; production CLI walks parse5 trees.
  const refs = [];
  const imgTag = /<img\b([^>]*)>/gi;
  let match;
  while ((match = imgTag.exec(html))) {
    const attrs = match[1];
    const get = (name) => {
      const m = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i').exec(attrs);
      return m ? (m[2] ?? m[3]) : undefined;
    };
    const src = get('src');
    const alt = get('alt');
    const decorative = /\bdata-decorative\s*=\s*("true"|'true'|true)/i.test(attrs);
    const srcset = get('srcset');
    if (src !== undefined) {
      refs.push({ from: pageKey, src, alt, decorative });
    }
    for (const candidate of parseSrcset(srcset)) {
      refs.push({ from: pageKey, src: candidate, alt, decorative, fromSrcset: true });
    }
  }
  return refs;
}

/** Compare CSS selector specificity tuples [a,b,c] (style, id, class/attr/pseudo-class, type/pseudo-element approximated). */
export function specificity(selector) {
  const s = selector.replace(/::?(before|after|placeholder|marker)/g, ' ');
  const ids = (s.match(/#[\w-]+/g) || []).length;
  const attrs = (s.match(/\[[^\]]+\]/g) || []).length;
  const classes = (s.match(/\.[\w-]+/g) || []).length;
  const pseudos = (s.match(/:[\w-]+/g) || []).length;
  const types = (s.match(/(^|[\s>+~])([a-z][\w-]*)/gi) || []).length;
  return [ids, classes + attrs + pseudos, types];
}

export function specificityGreaterOrEqual(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return true;
}
