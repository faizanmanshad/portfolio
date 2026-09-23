import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const commonSchema = z.object({
  title: z.string(),
  shortTitle: z.string().optional(),
  deck: z.string().optional(),
  type: z.string().optional(),
  domains: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  dateStart: z.coerce.date().optional(),
  dateEnd: z.coerce.date().optional(),
  dateDisplay: z.string().optional(),
  ongoing: z.boolean().default(false),
  organization: z.string().optional(),
  location: z.string().optional(),
  role: z.string().optional(),
  featured: z.boolean().default(false),
  priority: z.number().default(0),
  verificationStatus: z.enum([
    'official-document',
    'primary-curated-source',
    'user-reported',
    'conflicting-sources',
    'pending-verification',
  ]).default('user-reported'),
  summary: z.string().optional(),
  heroMedia: z.string().optional(),
  thumbnail: z.string().optional(),
  media: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  methods: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string(),
    })
  ).default([]),
  relatedIds: z.array(z.string()).default([]),
  evidence: z.array(z.string()).default([]),
  privacyLevel: z.string().default('public'),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: commonSchema.extend({
    challenge: z.string().optional(),
    context: z.string().optional(),
    responsibilities: z.array(z.string()).default([]),
    methodology: z.string().optional(),
    workflow: z.string().optional(),
    deliverables: z.array(z.string()).default([]),
    technicalDetails: z.string().optional(),
    codesStandards: z.array(z.string()).default([]),
    results: z.string().optional(),
    team: z.array(z.string()).default([]),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
  schema: commonSchema,
});

const research = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/research" }),
  schema: commonSchema.extend({
    publication: z.string().optional(),
    award: z.string().optional(),
    supervisor: z.string().optional(),
  }),
});

const recognition = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/recognition" }),
  schema: commonSchema,
});

const development = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/development" }),
  schema: commonSchema,
});

const journey = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/journey" }),
  schema: commonSchema,
});

export const collections = {
  projects,
  experience,
  research,
  recognition,
  development,
  journey,
};
