"use client";
import { usePathname } from "next/navigation";
import Faq from "./Faq";
const q = (question, answer) => ({ question, answer });
const help = {
  invoices: [
    q(
      "Which amount should I pay?",
      "Use the amount, payment reference and bank details on the invoice issued for your project. Check any payment already recorded before making another transfer. If the figures do not match your records, contact the project team before paying.",
    ),
    q(
      "How do I query an invoice?",
      "Keep the invoice number and the item you want to discuss to hand. Use your project support channel so the team can check it against the agreed quotation and any approved changes.",
    ),
  ],
  quotes: [
    q(
      "What should I check before accepting a quotation?",
      "Review the scope, exclusions, allowances, VAT, payment stages and programme. Ask for clarification on anything you cannot identify in the drawings or specification before accepting.",
    ),
    q(
      "Does a change in scope affect the price?",
      "It can. A change should have a written scope, cost and programme impact agreed before the related work proceeds. Keep the latest approved version for your records.",
    ),
  ],
  moodboards: [
    q(
      "Does adding a product approve it for purchase?",
      "Treat moodboards as a record of selections and discussion. Confirm specification, quantity, availability and the agreed purchasing responsibility with the project team before ordering.",
    ),
    q(
      "What should I check when choosing finishes?",
      "Check dimensions, compatibility, maintenance needs and lead times. Where colour or texture matters, view a physical sample before making the final choice.",
    ),
  ],
  photos: [
    q(
      "What makes a useful project photograph?",
      "Include one view showing the location and a close-up of the detail. Add enough context for the team to understand the room, stage of work and issue.",
    ),
    q(
      "Should I report an urgent issue only with a photo?",
      "No. Contact the project team directly for anything urgent, then add photographs and a written description to support the conversation.",
    ),
  ],
  tickets: [
    q(
      "What should I include in a support request?",
      "Describe the issue, the room or item affected, when it started and the result you need. Add relevant photographs or document references so the team can respond with the right context.",
    ),
    q(
      "Where should I put follow-up information?",
      "Keep updates with the existing request where possible. This gives the team one record of the conversation and reduces duplicated work.",
    ),
  ],
  settings: [
    q(
      "Why should I keep my contact details current?",
      "The project team uses your account details to contact you about the build, decisions and documents. Check them whenever your email address or phone number changes.",
    ),
    q(
      "Do email preferences change my project agreement?",
      "No. Notification preferences control communications available in this account. Your signed scope, payment obligations and project responsibilities still apply.",
    ),
  ],
  project: [
    q(
      "What should I do if a project detail looks wrong?",
      "Check it against your latest agreed documents and tell the project team which detail needs correcting. Do not rely on an older screenshot or an earlier quote version.",
    ),
    q(
      "How should I record a decision or change?",
      "Keep the decision, its scope and any agreed cost or programme impact in writing. The team can then check the instruction against the current project record.",
    ),
  ],
};
export default function PageHelp() {
  const path = usePathname();
  const group = path.match(/invoice|payment/)
    ? "invoices"
    : path.match(/quot|rates/)
      ? "quotes"
      : path.includes("moodboard") || path.includes("product")
        ? "moodboards"
        : path.includes("photo")
          ? "photos"
          : path.includes("ticket")
            ? "tickets"
            : path.match(/settings|preferences/)
              ? "settings"
              : "project";
  return <Faq compact title="A little guidance" items={help[group]} />;
}
