import { $ClientPublishedEvent } from "@nhsdigital/nhs-notify-client-config-schemas/src/events/client-published-event";
import { version as schemaVersion } from "@nhsdigital/nhs-notify-client-config-schemas/package.json";
import buildEvent from "../event-builder";

describe("test clientChangedEvent builder function", () => {
  const testInput = {
    clientId: "test-client-id",
    clientName: "Test Client",
    environment: "test",
    apimId: "test-apim-id",
  };

  it("should successfully build a clientChangedEvent", () => {
    const event = buildEvent(testInput);

    expect(event).toHaveProperty(
      "type",
      "uk.nhs.notify.client-config.client-published.v1",
    );
    expect(event.data.id).toBe("test-client-id");
    expect(event.data.name).toBe("Test Client");
    expect(event.data.environment).toBe("test");
    expect(event.data.apimApplication).toEqual(
      expect.objectContaining({
        apimId: "test-apim-id",
      }),
    );
  });

  it("should use the schema package version to identify the event schema", () => {
    const event = buildEvent(testInput);

    expect(event.dataschemaversion).toEqual(schemaVersion);
    expect(event.dataschema).toEqual(
      expect.stringMatching(`client-published-${schemaVersion}\\.json$`),
    );
  });

  it("should validate using the event schema", () => {
    const event = buildEvent(testInput);

    expect(() => $ClientPublishedEvent.parse(event)).not.toThrow();
  });
});
