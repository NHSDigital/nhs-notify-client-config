import { z } from 'zod';
import { idRef } from '../helpers/id-ref';
import { $ChannelSupplier } from './channel-supplier';
import { $Specification } from './specification';
import { ConfigBase } from './common';

export const $SpecificationSupplier = ConfigBase('SpecificationSupplier').extend({
  specificationId: idRef($Specification),
  supplierId: idRef($ChannelSupplier),
}).describe('SpecificationSupplier');

export type SpecificationSupplier = z.infer<typeof $SpecificationSupplier>;
