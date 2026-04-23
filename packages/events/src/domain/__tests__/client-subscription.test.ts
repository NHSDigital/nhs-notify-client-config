import { $ClientSubscription } from "../client-subscription";

describe("ClientSubscription validations", () => {
  const validSubscription = {
    callbackApiTokenParameterPath:
      "/nhs-notify/client-config/subscriptions/example/callback-api-token",
    callbackUrl: "https://example.nhs.uk/client/callback",
    environment: "INT",
    messageStatuses: ["delivered", "failed"],
  };

  it("accepts subscriptions with at least one status set", () => {
    expect(() => $ClientSubscription.parse(validSubscription)).not.toThrow();
  });

  it("rejects subscriptions with no status sets", () => {
    const subscriptionWithoutStatuses = {
      callbackApiTokenParameterPath:
        "/nhs-notify/client-config/subscriptions/example/callback-api-token",
      callbackUrl: "https://example.nhs.uk/client/callback",
      environment: "INT",
    };

    expect(() =>
      $ClientSubscription.parse(subscriptionWithoutStatuses),
    ).toThrow(/ClientSubscription must declare at least one/u);
  });
});
