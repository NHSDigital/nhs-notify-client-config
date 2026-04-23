import { z } from "zod";

export function ConfigBase<T extends string>(
  type: T,
): z.ZodObject<{ id: z.ZodString }> {
  return z.object({
    id: z.string().meta({
      title: `${type} ID`,
      description: `Unique identifier for the ${type}`,
    }),
  });
}

export const $Version = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/)
  .meta({
    title: "Version",
    description: "Semantic version for the schema or event payload",
  });
export type Version = z.infer<typeof $Version>;

export const $Environment = z.enum(["INT", "PROD"]).meta({
  title: "Environment",
  description:
    "The target environment for an environment-scoped configuration entry.",
  examples: ["INT", "PROD"],
});
export type Environment = z.infer<typeof $Environment>;

export const $EnvironmentStatus = z
  .enum(["DRAFT", "INT", "PROD", "DISABLED"])
  .meta({
    title: "EnvironmentStatus",
    description:
      "Indicates whether the configuration is in draft, enabled in INT, enabled in PROD, or disabled in all environments. `PROD` implies the configuration has also been promoted through INT.",
  });
export type EnvironmentStatus = z.infer<typeof $EnvironmentStatus>;

export const $ParameterStorePath = z.string().meta({
  title: "Parameter Store Path",
  description:
    "AWS Systems Manager Parameter Store path containing the secret value. The secret itself is never published in an event payload.",
  examples: ["/nhs-notify/client-config/example/path"],
});

export const $Slug = z
  .string()
  .regex(/^[a-z0-9-]+$/)
  .refine(
    (slug) =>
      !slug.startsWith("-") && !slug.endsWith("-") && !slug.includes("--"),
    {
      message:
        "Slug must use lowercase letters, numbers, and single hyphens between segments.",
    },
  )
  .meta({
    title: "Slug",
    description:
      "Human-readable identifier using lowercase letters, numbers, and hyphens.",
    examples: ["nhs-app-reminders", "test-client"],
  });

export function validateUniqueEnvironments(
  items: { environment: Environment }[],
  ctx: z.RefinementCtx,
  fieldName: string,
): void {
  const seen = new Map<Environment, number>();

  for (const [index, item] of items.entries()) {
    const existingIndex = seen.get(item.environment);

    if (existingIndex === undefined) {
      seen.set(item.environment, index);
    } else {
      ctx.addIssue({
        code: "custom",
        message: `${fieldName} must contain at most one entry per environment`,
        path: [fieldName, index, "environment"],
      });
    }
  }
}

export function validateUniqueStringValues<T>(
  items: T[],
  ctx: z.RefinementCtx,
  fieldName: string,
  getValue: (item: T) => string,
  valueName: string,
): void {
  const seen = new Map<string, number>();

  for (const [index, item] of items.entries()) {
    const value = getValue(item);
    const existingIndex = seen.get(value);

    if (existingIndex === undefined) {
      seen.set(value, index);
    } else {
      ctx.addIssue({
        code: "custom",
        message: `${fieldName} must contain at most one entry per ${valueName}`,
        path: [fieldName, index],
      });
    }
  }
}
