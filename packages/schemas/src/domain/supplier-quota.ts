import { z } from 'zod';
import { idRef } from '../helpers/id-ref';
import { $Queue } from './queue';
import { $ChannelSupplier } from './channel-supplier';
import { ConfigBase } from './common';

export const $DayOfWeek = z.enum([
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
]);

export const $ActivePeriod = z.object({
  days: z.array($DayOfWeek),
  startTimePeriod: z.string(), // HH:MM:SS locale
  endTimePeriod: z.string(), // HH:MM:SS locale
});
export type ActivePeriod = z.infer<typeof $ActivePeriod>;

export const $Schedule = z.object({
  activePeriods: z.array($ActivePeriod),
});

export type Schedule = z.infer<typeof $Schedule>;

export const $SupplierQuota = ConfigBase('SupplierQuota').extend({
  channelSupplierId: idRef($ChannelSupplier),
  inputQueueIds: z.array(idRef($Queue)),
  tps: z.preprocess((val) => {
    if (typeof val === 'string') {
      return Number.parseInt(val);
    }
    return val;
  }, z.number()),
  periodSeconds: z.number(),
  initialQuota: z.number(),
  priority: z.number(),
  weight: z.number(),
  schedule: $Schedule.optional(),
}).describe('SupplierQuota');

export type SupplierQuota = z.infer<typeof $SupplierQuota>;
