import type { APIRoute } from 'astro';
import { readInventory } from '../lib/inventory.mjs';
import { site } from '../data/site';
export const GET: APIRoute = async () => {
  const { routes } = await readInventory();
  const urls = [...routes].sort().map((route) => `<url><loc>${new URL(route, site.origin).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
