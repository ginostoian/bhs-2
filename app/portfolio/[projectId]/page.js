import RelatedGuides from "@/components/brand/RelatedGuides";
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
  const description = `${project.teaser} Explore the work delivered, room details and photographs for this ${project.location} renovation project.`;

  return getSEOTags({
    title,
    description,
    canonicalUrlRelative: `/portfolio/${project.slug}`,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/portfolio/${project.slug}`,
      images: [{ url: project.coverImage, alt: project.coverImageAlt }],
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
        "Bring your own architect or choose one we recommend. Either way, Better Homes builds your home and can manage the coordination for you: arranging discussions, following up questions and speaking on your behalf with your agreement. You stay in control of the design, budget and approvals. Your architect prepares the drawings and agreed professional submissions; we manage construction. Our proposal sets out the coordination support you want, each appointment and the fees before you commit.",
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
        {project.servicePath && <div className="bh-actions">
          <Link className="bh-button" href={`/contact?service=${encodeURIComponent(project.serviceName)}#brief`}>Discuss a similar project</Link>
          <Link className="bh-text-link" href={project.servicePath}>Explore {project.serviceName.toLowerCase()} →</Link>
        </div>}
        <dl className="bh-facts" style={{ marginTop: 40 }}>
          <div>
            <dt>Location</dt>
            <dd>{project.location}</dd>
          </div>
          <div>
            <dt>Project type</dt>
            <dd>{facts.projectType}</dd>
          </div>
          {facts.completionPeriod && <div>
            <dt>Completion period</dt>
            <dd>{facts.completionPeriod}</dd>
          </div>}
        </dl>
        <Image
          src={project.coverImage}
          alt={project.coverImageAlt}
          width={1600}
          height={1000}
          priority
          quality={90}
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
          <p className="bh-lead">
            Construction and installation by Better Homes.
          </p>
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
      <section id="project-details" className="bh-band">
        <div className="bh-wrap bh-section">
          <p className="bh-eyebrow">A closer look</p>
          <h2 className="bh-heading">
            The details that make this home its own
          </h2>
          {facts.details.map((detail) => (
            <article
              key={detail.title}
              className="bh-grid-two"
              style={{ marginTop: 48, alignItems: "center" }}
            >
              <figure style={{ margin: 0 }}>
                <Image
                  src={detail.image}
                  alt={detail.caption}
                  width={1200}
                  quality={90}
                  height={900}
                  sizes="(max-width: 800px) 100vw, 50vw"
                  style={{ width: "100%", height: "auto" }}
                />
                <figcaption className="bh-small" style={{ marginTop: 12 }}>
                  {detail.caption}
                </figcaption>
              </figure>
              <div>
                <h3 className="bh-heading">{detail.title}</h3>
                <p className="bh-lead">{detail.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="bh-wrap bh-section">
        <p className="bh-eyebrow">Project gallery</p>
        <h2 className="bh-heading">{project.slug === "anthony-e14" ? "The finished home and the work behind it" : "Photographs from the completed project"}</h2>
        <ProjectGallery images={images} title={project.title} captions={project.imageCaptions} />
      </section>
      <section className="bh-wrap bh-section bh-grid-two">
        <div>
          <p className="bh-eyebrow">The outcome</p>
          <h2 className="bh-heading">What the finished home offers</h2>
        </div>
        <ul className="bh-list">
          {facts.outcomes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>
      {facts.testimonial?.verified === true && facts.testimonial?.reviewUrl ? (
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
      <ProjectCTA title="Discuss a similar project for your home" service={project.serviceName} />
      {related.length ? (
        <section className="bh-wrap bh-section">
          <p className="bh-eyebrow">More of our work</p>
          <h2 className="bh-heading">Other homes, carefully transformed</h2>
          <ProjectCards projects={related} />
        </section>
      ) : null}
      <RelatedGuides context={project.serviceTags?.includes("loft") ? "loft" : project.category.includes("Extension") ? "extension" : project.category.includes("Kitchen") ? "kitchen" : project.category.includes("Bathroom") ? "bathroom" : "renovation"} />
    </main>
  );
}
