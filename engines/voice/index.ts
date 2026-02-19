import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "voice",
  name: "AI Voice Studio",
  credits: 10,
  controller: { generate },
});
