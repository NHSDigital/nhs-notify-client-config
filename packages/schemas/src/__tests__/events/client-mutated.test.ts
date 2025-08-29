/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'node:fs';
import path from 'node:path';
import { $ClientMutatedEvent } from '../../schemas/client-mutated-event';

describe('ClientMutatedEvent validations', () => {

  it('should validate a clientMutated event with all required', () => {
    const filePath = path.resolve(
      __dirname,
      '../testData/validClientDetails.json'
    );

    const event = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    expect(() => $ClientMutatedEvent.parse(event)).not.toThrow();
  });

  it('should throw error for clientMutated event with missing MESH and APIM ID', () => {
    const filePath = path.resolve(
      __dirname,
      '../testData/clientWithMissingAPIMorMESH.json'
    );

    const event = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    const result = $ClientMutatedEvent.safeParse(event);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("At least one of MESH or APIM is required as an integration method")
    }
  });

});
