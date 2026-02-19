import { register } from "@/system/registry";
import { generate } from "./controller";

register({
  id: "video",
  name: "AI Video Factory",
  credits: 50,
  controller: { generate },
});
