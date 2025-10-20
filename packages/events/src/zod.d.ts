import * as z from "zod";

declare module "zod" {
  interface GlobalMeta {
    // add new fields here
    examples?: z.$output[];
  }
}
