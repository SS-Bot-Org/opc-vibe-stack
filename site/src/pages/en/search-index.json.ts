import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../../lib/content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const items = await buildSearchIndex('en');
  return new Response(JSON.stringify(items, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
};
