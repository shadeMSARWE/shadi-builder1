import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "app",
  name: "AI App Builder",
  credits: 50,
  controller: { generate },
});
