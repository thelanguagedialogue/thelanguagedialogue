import { whatsappAct } from "@/lib/links";
import { Btn, WhatsAppIcon } from "./Ui";

/** Floating WhatsApp button, shown once you are past the cover (components/Motion.tsx). */
export default function WhatsAppFloat() {
  const wa = whatsappAct();
  if (!wa) return null;
  return <Btn act={wa} className="wa" label="Chat on WhatsApp"><WhatsAppIcon /></Btn>;
}
