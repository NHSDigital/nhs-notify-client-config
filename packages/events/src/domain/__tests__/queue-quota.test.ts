import { $Queue } from "../queue";

describe("Queue validations", () => {
  const validQueue = {
    channel: "LETTER",
    maxRequestsPerPeriod: 50_000,
    maxRequestsPerSecond: 100,
    periodOffset: 0,
    periodSeconds: 86_400,
    schedule: [
      {
        daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
        endTime: "18:00",
        startTime: "08:00",
      },
    ],
  };

  it("allows overlapping schedule periods", () => {
    const queue = {
      ...validQueue,
      schedule: [
        {
          daysOfWeek: ["MONDAY", "TUESDAY"],
          endTime: "17:00",
          startTime: "09:00",
        },
        {
          daysOfWeek: ["MONDAY"],
          endTime: "18:00",
          startTime: "12:00",
        },
      ],
    };

    expect(() => $Queue.parse(queue)).not.toThrow();
  });

  it("rejects invalid schedule day values", () => {
    const queue = {
      ...validQueue,
      schedule: [
        {
          daysOfWeek: ["FUNDAY"],
          endTime: "18:00",
          startTime: "08:00",
        },
      ],
    };

    expect(() => $Queue.parse(queue)).toThrow();
  });

  it("rejects invalid schedule time values", () => {
    const queue = {
      ...validQueue,
      schedule: [
        {
          daysOfWeek: ["MONDAY"],
          endTime: "18:00",
          startTime: "24:00",
        },
      ],
    };

    expect(() => $Queue.parse(queue)).toThrow();
  });
});
