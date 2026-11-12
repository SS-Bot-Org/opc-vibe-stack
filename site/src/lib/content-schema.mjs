import { z } from 'zod';
const evidenceSchema = z.enum(['tested', 'documentation-backed', 'unverified']);
const sourceKindSchema = z.enum(['x', 'docs', 'blog', 'other']);
const publicSourceSchema = z.object({
  title: z.string().min(1),
  url: z.url().refine((u) => u.startsWith('http://') || u.startsWith('https://'), {
    message: 'publicSources.url must be http(s)',
  }),
  kind: sourceKindSchema,
});
const verificationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  environment: z.string().min(1),
  outcome: z.string().min(1),
});
const briefingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().optional(),
});

export const articleSchema = z.object({
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
    verification: verificationSchema.optional(),
    applicableToolsVersions: z.string().min(1),
    published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    seoTitle: z.string().min(1).max(70).optional(),
    subtitle: z.string().min(1).max(160).optional(),
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
  });
export const changelogSchema = z.object({
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
  });

export function loaderId(entry, data) {
  const locale = data.locale || (entry.startsWith('zh/') ? 'zh' : 'en');
  return `${locale}/${data.slug || entry.split('/').pop().replace(/\.mdx?$/, '')}`;
}
export function assertConditional(data, label) {
  if (data.status === 'draft') return;
  if (!data.published) throw new Error(`${label}: published date is required`);
  if (data.published > data.updated) throw new Error(`${label}: published date must be on or before updated`);
  if (data.evidence === 'documentation-backed' && !data.publicSources.length)
    throw new Error(`${label}: documentation-backed evidence requires publicSources`);
  if (data.category === 'stack') {
    for (const key of ['toolId', 'toolAvailability', 'bestFor', 'poorFit', 'caveats'])
      if (!data[key]?.trim()) throw new Error(`${label}: stack requires ${key}`);
  }
  if (data.evidence === 'tested' && !data.verification)
    throw new Error(`${label}: tested evidence requires verification date, environment and outcome`);
  if ((data.category === 'alert' || ['warning', 'deprecated'].includes(data.toolAvailability)) && !data.notice?.text)
    throw new Error(`${label}: alert or non-active tool requires a notice`);
  if (data.status === 'deprecated' && !data.notice?.text)
    throw new Error(`${label}: deprecated guidance requires a notice`);
}
