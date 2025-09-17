import { z } from "zod";

const $Config = z.object({
  EVENT_SOURCE: z.string(),
});

export const loadConfig = () => {
  return $Config.parse(process.env);
};

//TO-DO: needs to be updated to use the loadConfig and use correct event source once app/bounded context is set up
export const eventSource = "//notify.nhs.uk/app/nhs-notify-client-config-dev/main";
