import { buildEvent } from "../event-builder";

describe("test clientMutatedEvent builder function", () => {
  it("should successfully build a clientMutatedEvent", () => {
    const testInput = {
      clientId: "test-client-id",
      clientName: "Test Client",
      apimId: "test-apim-id",
    };

    const event = buildEvent(testInput);

    expect(event).toHaveProperty(
      "type",
      "uk.nhs.notify.config.ClientMutated.V1",
    );
    expect(event.data.id).toBe("test-client-id");
    expect(event.data.name).toBe("Test Client");
    expect(event.data.apimApplication).toEqual(
      expect.objectContaining({
        apimId: "test-apim-id",
      }),
    );
  });
});
