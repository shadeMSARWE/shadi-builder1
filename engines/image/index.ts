import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "image",
  name: "AI Image Studio",
  credits: 5,
  controller: { generate },
});
