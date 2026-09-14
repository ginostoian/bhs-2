import { businessFacts } from "@/libs/businessFacts";
import Image from "next/image";
import Link from "next/link";
import styles from "./ServiceConfidence.module.css";

const content = {
  "/house-extension": {
    name: "extension",
    intro: "An extension brings structure, weather protection and your existing home together. Knowing who is managing each stage makes the process easier to follow.",
    tasks: [
      ["Prepare the work around your home", "We agree access, the working area and the sequence of the build before starting, including how the new space connects to the existing house."],
      ["Coordinate the construction", "We manage the building trades and the sequence from groundworks and structure to the roof, glazing and interior finish. Your architect and structural engineer remain responsible for their professional designs."],
      ["Make decisions visible", "Your project lead keeps you informed about progress and upcoming decisions. Changes to the agreed work are discussed with their cost and programme implications before approval."],
    ],
    project: { slug: "james-n8", location: "N8, North London", title: "More room for everyday family life.", image: "/assets/portfolio/extension-james-n8/extension-james-1.webp", alt: "Completed kitchen extension and renovation in N8", need: "A larger, lighter kitchen-living space with a better connection to the garden.", work: "Extension and structural work, kitchen installation, interior upgrades and final decoration brought the spaces together." },
  },
  "/general-renovation": {
    name: "whole-home renovation",
    intro: "A whole-home renovation involves many connected decisions. We manage the construction as one programme, so the work in each room supports the next stage.",
    tasks: [
      ["Plan the sequence, room by room", "We agree the scope and work stages before starting, including access and whether the planned work is compatible with staying in the property."],
      ["Bring the trades together", "We coordinate structural work, plumbing, electrics, kitchens, bathrooms and finishing within the agreed scope. Design questions are taken back to your appointed professionals where their input is needed."],
      ["Keep the details and decisions clear", "Your project lead keeps you informed about progress and the choices needed next. We discuss proposed changes and their effect on cost and timing before you approve them."],
    ],
    project: { slug: "daniel-n19", location: "N19, North London", title: "A home that works together, room to room.", image: "/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp", alt: "Completed rear extension and kitchen-living space within Daniel’s whole-home renovation in N19", need: "More living space and a better flow through the home, without moving.", work: "A rear extension was combined with internal renovation, bathrooms, bedrooms, kitchen joinery and integrated storage." },
  },
  "/loft-conversion": {
    name: "loft conversion",
    intro: "A successful loft conversion needs more than a finished room. The structure, staircase and connection to the home below all need careful coordination.",
    tasks: [
      ["Clarify the design before the build", "We work from your appointed architect’s and engineer’s designs, with the staircase, structural work and roof changes included in the agreed construction scope."],
      ["Coordinate the roof and the rooms below", "We plan access and the sequence of opening up, structural work and weather protection. We discuss how the staircase connection and services will affect the existing home."],
      ["Keep the finishing stages connected", "We coordinate insulation, windows, services and finishing within the agreed scope, alongside the relevant inspection stages. Your project lead keeps you informed about progress and decisions."],
    ],
  },
};

export default function ServiceConfidence({ servicePath }) {
  const detail = content[servicePath];
  if (!detail) return null;
  return (
    <>
      {detail.project && <section className={`bh-wrap bh-section ${styles.project}`} aria-label="A relevant completed project">
        <Link href={`/portfolio/${detail.project.slug}`} className={styles.photo}>
          <Image src={detail.project.image} alt={detail.project.alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
        </Link>
        <div>
          <p className="bh-eyebrow">Completed work · {detail.project.location}</p>
          <h2 className="bh-heading">{detail.project.title}</h2>
          <dl className={styles.brief}>
            <div><dt>What the homeowner needed</dt><dd>{detail.project.need}</dd></div>
            <div><dt>What we delivered</dt><dd>{detail.project.work}</dd></div>
          </dl>
          <Link className="bh-text-link" href={`/portfolio/${detail.project.slug}`}>Explore the completed project →</Link>
        </div>
      </section>}
      <section className={`bh-wrap bh-section ${styles.responsibility}`} aria-label="Our construction responsibilities">
        <div className={styles.heading}>
          <p className="bh-eyebrow">What we take responsibility for</p>
          <h2 className="bh-heading">The details are ours to manage.<br />The decisions stay with you.</h2>
          <p>{detail.intro}</p>
        </div>
        <div className={styles.tasks}>
          {detail.tasks.map(([title, text], index) => <article key={title}><span className={styles.number}>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <p className={styles.boundary}>Your quotation sets out the work, exclusions and agreed coordination support. Bring your own architect or choose an independent architect we recommend; their professional appointment remains separate from our construction work.</p>
      </section>
    </>
  );
}

export function ServiceAftercare() {
  return <div className={styles.aftercare}>
    <h3>A clear route back to us after handover.</h3>
    <p>We complete a snagging review and provide the relevant handover documents. If something needs attention afterwards, raise a ticket in your client portal with the details and photographs. You can follow its status and add updates while we review the issue and coordinate the agreed next steps.</p>
    <p>{businessFacts.workmanship}</p>
    <Link href="/our-guarantee" className="bh-text-link">How our aftercare works →</Link>
  </div>;
}
