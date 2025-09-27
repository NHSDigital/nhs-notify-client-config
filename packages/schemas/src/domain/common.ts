import {z, ZodObject} from 'zod';

export function ConfigBase<T extends string>(type: T):
  ZodObject<{ id: PropertyKey extends T ? z.ZodString : z.core.$ZodBranded<z.ZodString, T> }> {
  return z.object({
    id: z.string().brand<T>(type),
  });
}

export const $Version = z.string().regex(/^[0-9]+\.[0-9]+\.[0-9]+$/).brand('Version');
export type Version = z.infer<typeof $Version>;

export const $Environment = z.string().meta({
  title: 'Environment',
  description: 'The environment in which the configuration has effect',
  examples: ['dev', 'int', 'prod']
});
