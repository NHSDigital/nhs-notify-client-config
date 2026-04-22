import { z } from "zod";
import { $Channel } from "./channel";

const $DayOfWeek = z
  .enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ])
  .meta({
    title: "DayOfWeek",
    description: "Day of the week on which a queue schedule period applies.",
  });

const $TimeOfDay = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
  .meta({
    title: "TimeOfDay",
    description: "24-hour time in HH:MM format.",
    examples: ["09:00", "17:30"],
  });

export const $QueueSchedulePeriod = z
  .object({
    daysOfWeek: z.array($DayOfWeek).nonempty().meta({
      description:
        "Days of the week on which this queue schedule period is active.",
    }),
    startTime: $TimeOfDay.meta({
      title: "Start Time",
      description:
        "Inclusive start time for the active schedule period, in HH:MM 24-hour format.",
      examples: ["08:00"],
    }),
    endTime: $TimeOfDay.meta({
      title: "End Time",
      description:
        "Exclusive end time for the active schedule period, in HH:MM 24-hour format.",
      examples: ["18:00"],
    }),
  })
  .meta({
    title: "QueueSchedulePeriod",
    description:
      "A scheduled time window during which queue throttling is active. Multiple schedule periods may overlap.",
  });

export const $Queue = z
  .object({
    channel: $Channel,
    maxRequestsPerSecond: z
      .number()
      .min(0)
      .refine((value) => value > 0, {
        message: "maxRequestsPerSecond must be greater than 0",
      })
      .optional()
      .meta({
        description:
          "Maximum number of requests that may be dispatched per second while the queue throttling rules are active.",
      }),
    maxRequestsPerPeriod: z.number().int().min(1).optional().meta({
      description:
        "Maximum number of requests that may be dispatched during a single quota period while the queue throttling rules are active.",
    }),
    periodSeconds: z.number().int().min(1).optional().meta({
      description:
        "Length of the quota period, in seconds, used with maxRequestsPerPeriod.",
    }),
    periodOffset: z.number().int().nonnegative().optional().meta({
      description:
        "Offset in seconds applied to the start of each quota period calculation.",
    }),
    schedule: z.array($QueueSchedulePeriod).nonempty().optional().meta({
      description:
        "Schedule periods during which queue throttling is active. The quota applies whenever the current time falls within any defined schedule period.",
    }),
    queueNamePrefixOverride: z.string().optional().meta({
      description:
        "Optional prefix override used when generating the queue name for this campaign channel.",
    }),
  })
  .meta({
    title: "Queue",
    description:
      "Campaign queue configuration for a single channel, including per-queue throttling limits and active schedule windows.",
  });

export type QueueSchedulePeriod = z.infer<typeof $QueueSchedulePeriod>;
export type Queue = z.infer<typeof $Queue>;
