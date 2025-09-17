import { $Version } from '../common';
import { $SpecificationSupplier, SpecificationSupplier } from '../specification-supplier';
import { EnvelopeId, Specification } from '../specification';
import { LayoutId } from '../layout';

describe('SpecificationSupplier schema validation', () => {

  const standardLetterSpecification: Specification = {
    id: 'standard-letter' as any,
    name: 'Standard Economy-class Letter',
    status: 'PUBLISHED',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: $Version.parse('1.0.0'),
    layout: 'standard' as LayoutId,
    postage: {
      tariff: 'economy',
      size: 'letter',
      deliverySLA: 4,
      maxSheets: 5
    },
    pack: {
      envelope: 'nhs-economy' as EnvelopeId,
      printColour: 'BLACK',
      features: ['MAILMARK']
    }
  };

  const testSpecificationSupplier: SpecificationSupplier = {
    id: 'test-specification-supplier' as any,
    specificationId: standardLetterSpecification.id,
    supplierId: 'supplier-123' as any,
  }

  it('should validate a specification supplier', () => {
    expect(() => $SpecificationSupplier.parse(testSpecificationSupplier)).not.toThrow();
  });

});
