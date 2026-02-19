import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "advanced",
  name: "Advanced Tools",
  credits: 10,
  controller: { generate },
});
