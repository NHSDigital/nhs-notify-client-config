import { z } from 'zod';
import { $Version, ConfigBase } from './common';
import { idRef } from '../helpers/id-ref';
import { $Layout } from './layout';

export const $SpecificationFeature = z.enum(['SAME_DAY', 'BRAILLE', 'AUDIO_CD', 'MAILMARK']);
export const $EnvelopeFeature = z.enum(['WHITEMAIL', 'NHS_BRANDING', 'NHS_BARCODE']);

export const $Envelope = ConfigBase('Envelope').extend({
  name: z.string(),
  size: z.enum(['C5', 'C4', 'DL']),
  features: z.array($EnvelopeFeature).optional(),
}).describe('Envelope');
export type Envelope = z.infer<typeof $Envelope>;
export type EnvelopeId = Envelope['id'];

export const $Insert = ConfigBase('Insert').extend({
  name: z.string(),
  type: z.enum(['FLYER', 'BOOKLET']),
  source: z.enum(['IN_HOUSE', 'EXTERNAL']),
  artwork: z.url().optional()
}).describe('Insert');
export type Insert = z.infer<typeof $Insert>;
export type InsertId = Insert['id'];

export const $Specification = ConfigBase('Specification').extend({
  name: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: $Version,
  layout: idRef($Layout),
  billing: z.object({
    basePrice: z.number(),
    unitPrice: z.number(),
  }).partial().optional(),
  postage: z.object({
    tariff: z.string(),
    size: z.string(),
    deliverySLA: z.number(),
    maxSheets: z.number(),
    maxWeight: z.number().optional(),
    maxThickness: z.number().optional(),
  }),
  pack: z.object({
    envelope: idRef($Envelope),
    printColour: z.enum(['BLACK', 'COLOUR']),
    paperColour: z.string().optional(),
    insert: idRef($Insert).optional(),
    features: z.array($SpecificationFeature).optional(),
    additional: z.record(z.string(), z.string()).optional()
  })
}).describe('Specification');
export type Specification = z.infer<typeof $Specification>;
export type SpecificationId = Specification['id'];

export const $SpecificationGroup = ConfigBase('SpecificationGroup').extend({
  name: z.string(),
  description: z.string().optional(),
  specifications: z.array(idRef($Specification)).nonempty(),
}).describe('SpecificationGroup');
export type SpecificationGroup = z.infer<typeof $SpecificationGroup>;
