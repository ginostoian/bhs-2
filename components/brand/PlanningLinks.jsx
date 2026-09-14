import Link from "next/link";
import { serviceResources } from "@/libs/serviceResources";

export default function PlanningLinks({ servicePath, article = false }) {
  const resource = serviceResources[servicePath];
  if (!resource) return null;
  return (
    <section
      className={article ? "bh-editorial-planning" : "bh-wrap bh-section"}
      aria-label="Plan your project"
    >
      <p className="bh-eyebrow">Plan your project</p>
      <h2 className="bh-heading" style={{ fontSize: "clamp(24px, 3vw, 32px)" }}>
        Apply the guidance to your home.
      </h2>
      <p>
        Explore the scope and investment for your {resource.name}, then discuss
        the work your home needs. See our <Link href="/locations">London service areas</Link> for local project information.
      </p>
      <div className="bh-actions">
        {resource.tool ? (
          <Link className="bh-text-link" href={resource.tool[1]}>
            {resource.tool[0]} →
          </Link>
        ) : null}
        <Link
          className="bh-text-link"
          href={article ? servicePath : resource.guide[1]}
        >
          {article
            ? `Discuss your ${resource.name} project`
            : resource.guide[0]}{" "}
          →
        </Link>
        {resource.project ? (
          <Link className="bh-text-link" href={resource.project[1]}>
            {resource.project[0]} →
          </Link>
        ) : null}
      </div>
    </section>
  );
}
