import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { readInventory } from './lib/inventory.mjs';
import { articleSchema, changelogSchema, loaderId, assertConditional } from './lib/content-schema.mjs';

function validatedGlob(options: Parameters<typeof glob>[0]) {
  const loader = glob(options);
  return { ...loader, async load(context: Parameters<typeof loader.load>[0]) {
    await readInventory(); // Reject duplicate identities before glob can overwrite an entry.
    return loader.load(context);
  } };
}

const articles = defineCollection({
  loader: validatedGlob({ pattern: '**/{en,zh}/*.md', base: './src/content/articles',
    generateId: ({ entry, data }) => loaderId(entry, data) }),
  schema: articleSchema.superRefine((data, ctx) => {
    try { assertConditional(data, 'article'); }
    catch (error) { ctx.addIssue({ code: 'custom', message: String(error) }); }
  }),
});
const changelog = defineCollection({
  loader: validatedGlob({ pattern: '**/{en,zh}/*.md', base: './src/content/changelog',
    generateId: ({ entry, data }) => loaderId(entry, data) }),
  schema: changelogSchema,
});
export const collections = { articles, changelog };
