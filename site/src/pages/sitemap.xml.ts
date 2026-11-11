import type { APIRoute } from 'astro';
import { readInventory } from '../lib/inventory.mjs';
import { site } from '../data/site';
import { routeLastmod } from '../lib/lastmod.mjs';
import { isLastmodFormat } from '../lib/seo.mjs';

export const GET: APIRoute = async () => {
  const inventory = await readInventory();
  const urls = [...inventory.routes].sort().map((route) => {
    const lastmod = routeLastmod(route, inventory);
    if (!lastmod || !isLastmodFormat(lastmod)) {
      throw new Error(`Missing or invalid lastmod for sitemap route ${route}`);
    }
    return `<url><loc>${new URL(route, site.origin).href}</loc><lastmod>${lastmod}</lastmod></url>`;
  }).join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
