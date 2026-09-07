import ProjectGallery from "@/components/brand/ProjectGallery";
import Faq from "@/components/brand/Faq";
import { JsonLd, FaqSchema } from "@/components/brand/Schema";
import { ProjectCTA, ProjectCards } from "@/components/brand/ServicePage";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import config from "@/config";
import {
  getPortfolioProjectBySlug,
  getPortfolioProjects,
  getRelatedPortfolioProjects,
} from "@/libs/portfolio-projects";
import { getSEOTags } from "@/libs/seo";

const siteUrl = `https://${config.domainName}`;
export const dynamicParams = false;

export function generateStaticParams() {
  return getPortfolioProjects().map((project) => ({
    projectId: project.slug,
  }));
}

export function generateMetadata({ params }) {
  const project = getPortfolioProjectBySlug(params.projectId);

  if (!project) {
    return getSEOTags({
      title: "Project Not Found | Better Homes",
      canonicalUrlRelative: "/portfolio",
      extraTags: {
        robots: {
          index: false,
          follow: false,
        },
      },
    });
  }

  const title = `${project.title} | Case Study | Better Homes`;
  const description = `${project.teaser} Explore scope, constraints, delivery approach and outcomes for this ${project.location} renovation project.`;

  return getSEOTags({
    title,
    description,
    canonicalUrlRelative: `/portfolio/${project.slug}`,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/portfolio/${project.slug}`,
    },
    keywords: [
      `${project.location} renovation case study`,
      `${project.category} London`,
      "London design and build case study",
      "trusted renovation company London",
    ],
  });
}

export default function ProjectPage({ params }) {
  const project = getPortfolioProjectBySlug(params.projectId);
  if (!project) notFound();
  const related = getRelatedPortfolioProjects(project.slug, 3);
  const facts = project.caseStudy;
  const images = [...new Set([project.coverImage, ...project.images])];
  const faqs = [
    {
      question: `Could you deliver a similar project to this ${project.location} home?`,
      answer: `We can review a similar brief with you. The work shown here is ${facts.projectType.toLowerCase()}. Your existing structure, access, approvals and specification will determine the right scope and construction approach for your property.`,
    },
    {
      question: "Can I bring my own architect or drawings?",
      answer:
        "Yes. We can price and build from your existing drawings, coordinating with your architect and structural engineer. If you need design support, we can manage your relationship with a trusted independent architect.",
    },
    {
      question: "Will my project cost the same as this one?",
      answer:
        "Each quotation is based on the property and agreed scope. Photographs cannot establish structural work, access constraints, services or product allowances. Share your brief and drawings so we can discuss a realistic budget.",
    },
  ];
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: project.title,
          description: project.teaser,
          image: images.map((src) => `${siteUrl}${src}`),
          author: {
            "@type": "Organization",
            name: "Better Homes",
            url: siteUrl,
          },
          publisher: { "@id": `${siteUrl}/#organization` },
          mainEntityOfPage: `${siteUrl}/portfolio/${project.slug}`,
        }}
      />
      <FaqSchema items={faqs} path={`/portfolio/${project.slug}`} />
      <section className="bh-wrap bh-section">
        <p className="bh-eyebrow">
          {project.location} · {project.category}
        </p>
        <h1 className="bh-title" style={{ maxWidth: 920 }}>
          {project.slug === "james-n8"
            ? "A brighter rear and a kitchen the whole family lives in, N8"
            : project.title}
        </h1>
        <p className="bh-lead">{project.teaser}</p>
        <dl className="bh-facts" style={{ marginTop: 40 }}>
          <div>
            <dt>Location</dt>
            <dd>{project.location}</dd>
          </div>
          <div>
            <dt>Project type</dt>
            <dd>{facts.projectType}</dd>
          </div>
          <div>
            <dt>Client priority</dt>
            <dd>{facts.homeownerPriority}</dd>
          </div>
        </dl>
        <Image
          src={project.coverImage}
          alt={project.coverImageAlt}
          width={1600}
          height={1000}
          priority
          sizes="100vw"
          style={{
            width: "100%",
            aspectRatio: "16/9",
            objectFit: "cover",
            borderRadius: 0,
            marginTop: 40,
          }}
        />
      </section>
      <section className="bh-wrap bh-section bh-grid-two">
        <div>
          <p className="bh-eyebrow">The brief</p>
          <h2 className="bh-heading">{facts.objective}</h2>
          <p className="bh-lead">{facts.deliveryStyle}</p>
        </div>
        <div>
          <h3 style={{ fontSize: 22 }}>The work we delivered</h3>
          <ul className="bh-list">
            {facts.scope.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bh-band">
        <div className="bh-wrap bh-section bh-grid-two">
          <div>
            <p className="bh-eyebrow">What needed care</p>
            <h2 className="bh-heading">The decisions behind the finish</h2>
            <ul className="bh-list">
              {facts.constraints.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="bh-eyebrow">How we managed it</p>
            <ol className="bh-list">
              {facts.riskManagement.map((x, i) => (
                <li key={x}>
                  <span className="bh-small">0{i + 1}</span>
                  <p>{x}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="bh-wrap bh-section">
        <p className="bh-eyebrow">The finished home</p>
        <h2 className="bh-heading">Photographs from the completed project</h2>
        <ProjectGallery images={images} title={project.title} />
      </section>
      <section className="bh-wrap bh-section bh-grid-two">
        <div>
          <p className="bh-eyebrow">The outcome</p>
          <h2 className="bh-heading">What changed for the home</h2>
        </div>
        <ul className="bh-list">
          {facts.outcomes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
      {facts.testimonial?.reviewUrl ? (
        <section className="bh-wrap bh-section">
          <blockquote className="bh-lead">
            “{facts.testimonial.quote}”
          </blockquote>
          <p className="bh-small">
            {facts.testimonial.author} ·{" "}
            <a className="bh-text-link" href={facts.testimonial.reviewUrl}>
              Read the published review
            </a>
          </p>
        </section>
      ) : null}
      <Faq items={faqs} />
      <ProjectCTA title="Discuss a similar project for your home" />
      {related.length ? (
        <section className="bh-wrap bh-section">
          <p className="bh-eyebrow">More of our work</p>
          <h2 className="bh-heading">Other homes, carefully transformed</h2>
          <ProjectCards projects={related} />
        </section>
      ) : null}
    </main>
  );
}
