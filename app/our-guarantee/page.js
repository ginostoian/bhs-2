import { businessFacts } from "@/libs/businessFacts";
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import Faq from "@/components/brand/Faq";
import { FaqSchema } from "@/components/brand/Schema";
import styles from "./page.module.css";

export const metadata = getSEOTags({
  title: "Our Workmanship Guarantee | Better Homes",
  description: "Care that continues after handover. Explore our workmanship guarantees and how Better Homes manages aftercare through your online client portal.",
  canonicalUrlRelative: "/our-guarantee",
});

const steps = [
  ["Tell us what needs attention", "Raise a ticket in your client portal. Describe what you have noticed, where it is and when it started. You can attach photographs or documents to help us understand the issue."],
  ["We review it and explain the next step", "Our team reviews the details and lets you know if we need more information or a closer look. We clarify the relevant cover and discuss what needs to happen next, including access if a visit is needed."],
  ["Keep the details together", "Follow the ticket’s status, read updates and add information in the same place. This gives you and our team a shared record as we coordinate the agreed next steps and work towards resolving the issue."],
];
const faqs = [
  { question: "How do I request aftercare support?", answer: "Sign in to your client portal and raise a support ticket. Include the location of the issue, when you noticed it and any helpful photographs. If you cannot access your account, contact the team and we will help you get started." },
  { question: "Can I follow progress online?", answer: "Yes. Your ticket shows its current status and updates. You can add further information and attachments, keeping the details together as the issue is reviewed and the next steps are arranged." },
  { question: "What does the workmanship guarantee cover?", answer: businessFacts.workmanship },
  { question: "What if an appliance or fitting breaks?", answer: "Item breakages are excluded from our workmanship guarantee and fall under the manufacturers’ own guarantees. Keep the product details and warranty documents from handover. If you are unsure whether an issue concerns the product or its installation, explain it in your ticket so we can review the details and clarify the appropriate next step." },
  { question: "What should I do if the issue is urgent?", answer: "If an issue needs urgent attention, call the team as well as recording it in the portal. The ticket system is not an emergency response service. If there is an immediate danger, contact the appropriate emergency service first." },
];

export default function Page() {
  return (
    <main>
      <section className="bh-wrap bh-section">
        <p className="bh-eyebrow">Aftercare</p>
        <h1 className="bh-title">Confidence that continues after handover.</h1>
        <p className="bh-lead">Settling into your finished home should feel reassuring. If something needs attention, you have a team to turn to and a clear way to put it in our hands.</p>
        <p className={styles.intro}>We complete a snagging review and provide the relevant handover documents and workmanship terms. Our care continues beyond that point: we help you understand the issue, explain the next steps and coordinate the agreed follow-up.</p>
        <div className="bh-actions">
          <Link href="/dashboard/tickets" className="bh-button">Request aftercare support</Link>
          <Link href="/contact" className="bh-text-link">Contact the team</Link>
        </div>
      </section>

      <section className={`bh-wrap bh-section ${styles.process}`} aria-labelledby="aftercare-process">
        <div>
          <p className="bh-eyebrow">A clear process</p>
          <h2 id="aftercare-process" className="bh-heading">One place to raise it.<br />A clear way forward.</h2>
          <p className={styles.intro}>Our online ticket system helps us manage aftercare carefully. Your description, photographs and updates stay together, giving the team the context to follow your request through.</p>
          <p className={styles.intro}>You do not need to diagnose the problem yourself. Start by telling us what you have noticed. We will review it with you and explain how we can help.</p>
          <Link href="/dashboard/tickets" className="bh-text-link">Open your client portal →</Link>
        </div>
        <ol className={styles.steps}>
          {steps.map(([title, text], index) => (
            <li key={title}>
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className={`bh-wrap bh-section ${styles.cover}`} aria-labelledby="workmanship-cover">
        <p className="bh-eyebrow">Your workmanship cover</p>
        <h2 id="workmanship-cover" className="bh-heading">Care backed by clear guarantees.</h2>
        <p className={styles.intro}>Knowing where you stand matters. These are the guarantee periods for our work, with product guarantees kept separate so the right cover is clear.</p>
        <dl className="bh-facts" style={{ marginTop: 40 }}>
          <div><dt>Structural work, extensions and loft conversions</dt><dd>{businessFacts.guaranteePeriods.structural}</dd></div>
          <div><dt>Kitchen and bathroom installations</dt><dd>{businessFacts.guaranteePeriods.kitchen}</dd></div>
          <div><dt>Decoration</dt><dd>{businessFacts.guaranteePeriods.decoration}</dd></div>
        </dl>
        <p className={styles.exclusion}>Item breakages are excluded from our workmanship guarantee and fall under the manufacturers’ own guarantees. If you are unsure which cover applies, include the details in your support request so we can clarify the next step.</p>
      </section>
      <Faq items={faqs} />
      <FaqSchema items={faqs} path="/our-guarantee" />
    </main>
  );
}
