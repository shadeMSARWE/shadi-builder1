import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "store",
  name: "AI Store Builder",
  credits: 30,
  controller: { generate },
});
