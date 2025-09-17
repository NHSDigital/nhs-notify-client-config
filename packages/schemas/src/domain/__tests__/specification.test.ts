import { $Specification, EnvelopeId, Specification, SpecificationId } from '../specification';
import { $Version } from '../common';
import { LayoutId } from '../layout';

describe('Specification schema validation', () => {

  const standardLetterSpecification: Specification = {
    id: 'standard-letter' as SpecificationId,
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

  it('should validate a standard letter specification', () => {
    expect(() => $Specification.strict().parse(standardLetterSpecification)).not.toThrow();
  });

  it('should accept a letter specification with unrecognised fields', () => {
    expect(() => $Specification.parse({
      ...standardLetterSpecification,
      additionalField: { some: 'data' }
    })).not.toThrow();
  });

});
