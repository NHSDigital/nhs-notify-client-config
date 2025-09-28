import {z, ZodObject} from 'zod';

export function ConfigBase<T extends string>(type: T):
  z.ZodObject<{ id: z.core.$ZodBranded<z.ZodString, T> }> {
  const idType = z.string().brand<T>(type).meta({
    title: `${type} ID`,
    description: `Unique identifier for the ${type}`
  }) as z.core.$ZodBranded<z.ZodString, T>;

  return z.object({
    id: idType,
  });
}

export const $Version = z.string().regex(/^[0-9]+\.[0-9]+\.[0-9]+$/).brand('Version');
export type Version = z.infer<typeof $Version>;

export const $Environment = z.string().meta({
  title: 'Environment',
  description: 'The environment in which the configuration has effect',
  examples: ['dev', 'int', 'prod']
});
