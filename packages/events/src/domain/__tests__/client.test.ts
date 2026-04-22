import { $Client } from "../client";

describe("Client validations", () => {
  const validClient = {
    globalQueues: [
      {
        channel: "EMAIL",
      },
    ],
    id: "00f3b388-bbe9-41c9-9e76-052d37ee8988",
    name: "Test Client",
    slug: "test-client",
    status: "INT",
  };

  it("accepts unique global queues by channel", () => {
    expect(() => $Client.parse(validClient)).not.toThrow();
  });

  it("rejects duplicate global queues for the same channel", () => {
    const duplicateGlobalQueues = {
      ...validClient,
      globalQueues: [
        {
          channel: "EMAIL",
        },
        {
          channel: "EMAIL",
        },
      ],
    };

    expect(() => $Client.parse(duplicateGlobalQueues)).toThrow(
      /globalQueues must contain at most one entry per channel/u,
    );
  });
});
