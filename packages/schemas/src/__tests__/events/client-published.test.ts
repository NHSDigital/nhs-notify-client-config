import fs from 'node:fs';
import path from 'node:path';
import {$ClientPublishedEvent} from '../../schemas/client-published-event';

function readJson(filename: string): unknown {
  const filePath = path.resolve(
    __dirname,
    '../testData/',
    filename
  );

  return JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );
}

describe('ClientChangedEvent validations', () => {

  it('should validate a clientChanged event with all required', () => {
    const json = readJson('client-valid.json');

    expect(() => $ClientPublishedEvent.parse(json)).not.toThrow();
  });

  it('should throw error for clientChanged event with missing environment', () => {
    const json = readJson('client-with-missing-environment.json');

    expect(() => $ClientPublishedEvent.parse(json)).toThrow();
  });

});
