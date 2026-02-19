import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "saas",
  name: "AI SaaS Builder",
  credits: 50,
  controller: { generate },
});
