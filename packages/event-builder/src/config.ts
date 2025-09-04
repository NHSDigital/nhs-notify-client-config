import { z } from "zod";

const $Config = z.object({
  EVENT_SOURCE: z.string(),
});

export const loadConfig = () => {
  return $Config.parse(process.env);
};

export const eventSource = "//notify.nhs.uk/app/nhs-notify-config-dev/main";
