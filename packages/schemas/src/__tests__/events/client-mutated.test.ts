import fs from 'node:fs';
import path from 'node:path';
import { $ClientChangedEvent } from '../../schemas/client-mutated-event';

describe('ClientChangedEvent validations', () => {

  it('should validate a clientChanged event with all required', () => {
    const filePath = path.resolve(
      __dirname,
      '../testData/valid-client.json'
    );

    const event = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    expect(() => $ClientChangedEvent.parse(event)).not.toThrow();
  });

  it('should throw error for clientChanged event with missing MESH and APIM ID', () => {
    const filePath = path.resolve(
      __dirname,
      '../testData/client-with-missing-apim-mesh.json'
    );

    const event = JSON.parse(
      fs.readFileSync(filePath, 'utf8')
    );

    expect(() => $ClientChangedEvent.parse(event)).toThrow();
  });

});
