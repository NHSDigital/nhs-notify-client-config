import { buildEvent } from "../event-builder";

describe("test clientChangedEvent builder function", () => {
  it("should successfully build a clientChangedEvent", () => {
    const testInput = {
      clientId: "test-client-id",
      clientName: "Test Client",
      environment: "test",
      apimId: "test-apim-id",
    };

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
});
