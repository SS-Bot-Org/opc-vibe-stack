import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const evidenceSchema = z.enum(['tested', 'documentation-backed', 'unverified']);
const sourceKindSchema = z.enum(['x', 'docs', 'blog', 'other']);
const publicSourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().refine((u) => u.startsWith('http://') || u.startsWith('https://'), {
    message: 'publicSources.url must be http(s)',
  }),
  kind: sourceKindSchema,
});
const briefingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().optional(),
});

function localeSlugId({ entry, data }: { entry: string; data: Record<string, unknown> }) {
  const locale =
    (typeof data.locale === 'string' && data.locale) ||
    (entry.includes('/zh/') || entry.startsWith('zh/') ? 'zh' : 'en');
  const slugFromData = typeof data.slug === 'string' ? data.slug : '';
  const slugFromPath = entry.split('/').pop()?.replace(/\.mdx?$/, '') || entry;
  const slug = slugFromData || slugFromPath;
  return `${locale}/${slug}`;
}

const articles = defineCollection({
  loader: glob({
    pattern: '**/{en,zh}/*.md',
    base: './src/content/articles',
    generateId: localeSlugId,
  }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    summary: z.string().min(1).max(160),
    locale: z.enum(['en', 'zh']).default('en'),
    category: z.enum(['stack', 'guide', 'checklist', 'playbook', 'alert']),
    stage: z.enum(['research', 'build', 'sell', 'cross']),
    tools: z.array(z.string()).default([]),
    priority: z.enum(['P0', 'P1', 'P2']),
    status: z.enum(['draft', 'published', 'deprecated']),
    evidence: evidenceSchema,
    applicableToolsVersions: z.string().min(1),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    internalBriefing: z.array(briefingSchema).default([]),
    publicSources: z.array(publicSourceSchema).default([]),
    tags: z.array(z.string()).default([]),
    notice: z
      .object({
        text: z.string().min(1),
        relatedSlugs: z.array(z.string()).default([]),
      })
      .optional(),
    toolId: z.string().optional(),
    toolAvailability: z.enum(['active', 'warning', 'deprecated']).optional(),
    bestFor: z.string().optional(),
    poorFit: z.string().optional(),
    caveats: z.string().optional(),
  }),
});

const changelog = defineCollection({
  loader: glob({
    pattern: '**/{en,zh}/*.md',
    base: './src/content/changelog',
    generateId: localeSlugId,
  }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    title: z.string().min(1),
    summary: z.string().min(1).max(200),
    locale: z.enum(['en', 'zh']).default('en'),
    status: z.enum(['draft', 'published']),
    changes: z
      .array(
        z.object({
          type: z.enum(['added', 'revised', 'deprecated', 'alert']),
          text: z.string().min(1),
          affectedPages: z.array(z.string().min(1)).min(1),
          evidence: evidenceSchema,
        }),
      )
      .min(1),
    internalBriefing: z.array(briefingSchema).default([]),
    publicSources: z.array(publicSourceSchema).default([]),
  }),
});

export const collections = { articles, changelog };
