import { z } from "zod";

const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Expected a YYYY-MM date");

const url = z.url();

/** Extra depth for the case-study pages. Every field is optional and only
 * rendered when the content actually supports it. */
const caseStudySchema = z.object({
  problem: z.string().optional(),
  role: z.string().optional(),
  architecture: z.string().optional(),
  challenges: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
});

const experienceProjectSchema = z.union([
  z.string(),
  z.object({
    id: z.string(),
    name: z.string(),
    type: z.string().optional(),
    role: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    link: url.optional(),
    github: url.optional(),
    caseStudy: caseStudySchema.optional(),
  }),
]);

export const portfolioSchema = z.object({
  site: z.object({
    title: z.string(),
    description: z.string(),
  }),
  profile: z.object({
    name: z.string().min(1),
    initials: z.string().min(1).max(3),
    username: z.string().min(1),
    role: z.string(),
    summary: z.string(),
    intro: z.array(z.string()).default([]),
    focus: z.array(z.string()).default([]),
    careerStart: yearMonth,
    email: z.email(),
    cv: z.string(),
    links: z
      .object({
        website: url.optional(),
        github: url.optional(),
        linkedin: url.optional(),
        repository: url.optional(),
      })
      .default({}),
  }),
  experiences: z
    .array(
      z.object({
        id: z.string(),
        company: z.string(),
        role: z.string(),
        link: url.optional(),
        start: yearMonth,
        end: yearMonth.optional(),
        description: z.string(),
        projects: z.array(experienceProjectSchema).default([]),
      })
    )
    .default([]),
  projects: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        company: z.string(),
        description: z.string(),
        tags: z.array(z.string()).default([]),
        link: url.optional(),
        github: url.optional(),
        caseStudy: caseStudySchema.optional(),
      })
    )
    .default([]),
  contributions: z
    .array(
      z.object({
        id: z.string(),
        repository: z.string(),
        title: z.string(),
        number: z.number().int().positive(),
        status: z.enum(["Merged", "Open", "Closed"]),
        description: z.string(),
        tags: z.array(z.string()).default([]),
        link: url,
      })
    )
    .default([]),
  awards: z
    .array(
      z.object({
        title: z.string(),
        event: z.string(),
        date: z.string(),
        description: z.string(),
        link: url.optional(),
      })
    )
    .default([]),
  skills: z.record(z.string(), z.array(z.string())).default({}),
  system: z.object({
    hostname: z.string().default("portfolio"),
    defaultAppearance: z.enum(["light", "dark", "auto"]).default("auto"),
    defaultWallpaper: z.string(),
    wallpapers: z
      .array(
        z
          .object({
            id: z.string(),
            name: z.string(),
            src: z.string().optional(),
            preview: z.string().optional(),
            gradient: z.string().optional(),
            isLight: z.boolean().optional(),
          })
          .refine((wallpaper) => wallpaper.src || wallpaper.gradient, {
            message: "A wallpaper needs either a src or a gradient",
          })
      )
      .min(1),
    welcome: z.object({
      title: z.string(),
      body: z.string(),
    }),
    browser: z
      .object({
        homepage: url.optional(),
      })
      .default({}),
  }),
});

export type PortfolioContent = z.infer<typeof portfolioSchema>;
export type Profile = PortfolioContent["profile"];
export type Experience = PortfolioContent["experiences"][number];
export type ExperienceProject = z.infer<typeof experienceProjectSchema>;
export type Project = PortfolioContent["projects"][number];
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Award = PortfolioContent["awards"][number];
export type Wallpaper = PortfolioContent["system"]["wallpapers"][number];

export class ContentValidationError extends Error {
  constructor(readonly issues: z.ZodIssue[]) {
    super(
      `Invalid portfolio content:\n${issues
        .map((issue) => `• ${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("\n")}`
    );
    this.name = "ContentValidationError";
  }
}

export const parsePortfolio = (data: unknown): PortfolioContent => {
  const result = portfolioSchema.safeParse(data);
  if (!result.success) throw new ContentValidationError(result.error.issues);
  return result.data;
};
