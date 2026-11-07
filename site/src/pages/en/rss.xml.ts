import type { APIRoute } from 'astro';
import { getPublishedChangelog } from '../../lib/content';
import { absoluteUrl } from '../../lib/routes';
import { site } from '../../data/site';

export const prerender = true;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const GET: APIRoute = async () => {
  const entries = await getPublishedChangelog('en');
  const items = entries
    .map((e) => {
      const link = absoluteUrl(`/en/changelog/#${e.data.slug}`);
      const guid = `tag:opcvibestack.com,changelog:${e.data.slug}`;
      const desc = esc(e.data.summary);
      return `    <item>
      <title>${esc(e.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${new Date(e.data.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <description>${desc}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.name)} changelog</title>
    <link>${absoluteUrl('/en/changelog/')}</link>
    <description>Weekly substantive updates to OPC Vibe Stack.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
};
