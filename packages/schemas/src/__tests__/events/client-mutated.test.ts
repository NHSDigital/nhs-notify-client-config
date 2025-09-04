import fs from 'node:fs';
import path from 'node:path';
import { $ClientMutatedEvent } from '../../schemas/client-mutated-event';

describe('ClientMutatedEvent validations', () => {

  it('should validate a clientMutated event with all required', () => {
    const filePath = path.resolve(
      __dirname,
      '../testData/valid-client.json'
    );

    const event = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    expect(() => $ClientMutatedEvent.parse(event)).not.toThrow();
  });

  it('should throw error for clientMutated event with missing MESH and APIM ID', () => {
    const filePath = path.resolve(
      __dirname,
      '../testData/client-with-missing-apim-mesh.json'
    );

    const event = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    expect(() => $ClientMutatedEvent.parse(event)).toThrow();
  });

});
