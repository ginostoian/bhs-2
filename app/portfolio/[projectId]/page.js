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
      title: "Project Not Found | Better Homes Studio",
      canonicalUrlRelative: "/portfolio",
      extraTags: {
        robots: {
          index: false,
          follow: false,
        },
      },
    });
  }

  const title = `${project.title} | Case Study | Better Homes Studio`;
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

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedPortfolioProjects(project.slug, 3);
  const galleryImages = project.images.slice(0, 12);
  const caseStudyUrl = `${siteUrl}/portfolio/${project.slug}`;

  const caseStudySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Portfolio",
            item: `${siteUrl}/portfolio`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: caseStudyUrl,
          },
        ],
      },
      {
        "@type": "Article",
        headline: project.title,
        description: project.teaser,
        image: [`${siteUrl}${project.coverImage}`],
        author: {
          "@type": "Organization",
          name: "Better Homes Studio",
        },
        publisher: {
          "@type": "Organization",
          name: "Better Homes Studio",
          url: siteUrl,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": caseStudyUrl,
        },
      },
    ],
  };

  return (
    <main className="mx-auto my-10 max-w-[88%] px-4 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-[#d5e0f8] bg-gradient-to-br from-white via-white to-blue-50 p-6 md:p-10">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-[#266bf1]">
            Home
          </Link>
          <span>/</span>
          <Link href="/portfolio" className="hover:text-[#266bf1]">
            Portfolio
          </Link>
          <span>/</span>
          <span className="text-[#100b47]">{project.clientName}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#266bf1]">
              Case Study · {project.category}
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight text-[#100b47] md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
              {project.teaser}
            </p>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-600">
              <span className="font-semibold text-[#100b47]">Client objective:</span>{" "}
              {project.caseStudy.objective}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/contact?project=${encodeURIComponent(project.title)}`}
                className="inline-flex items-center rounded-full bg-[#266bf1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1f58c8] hover:text-white"
              >
                Discuss a Similar Project
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center rounded-full border border-[#bfd3f9] bg-white px-6 py-3 text-sm font-semibold text-[#266bf1] transition hover:bg-[#266bf1] hover:text-white"
              >
                View Other Case Studies
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dbe6fb] bg-white p-5">
            <h2 className="text-lg font-bold text-[#100b47]">Trust Snapshot</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="rounded-xl bg-[#f6f9ff] p-3">
                <dt className="font-semibold text-[#100b47]">Location</dt>
                <dd className="mt-1 text-gray-600">{project.location}</dd>
              </div>
              <div className="rounded-xl bg-[#f6f9ff] p-3">
                <dt className="font-semibold text-[#100b47]">Project Type</dt>
                <dd className="mt-1 text-gray-600">{project.caseStudy.projectType}</dd>
              </div>
              <div className="rounded-xl bg-[#f6f9ff] p-3">
                <dt className="font-semibold text-[#100b47]">Client Priority</dt>
                <dd className="mt-1 text-gray-600">
                  {project.caseStudy.homeownerPriority}
                </dd>
              </div>
              <div className="rounded-xl bg-[#f6f9ff] p-3">
                <dt className="font-semibold text-[#100b47]">Delivery Style</dt>
                <dd className="mt-1 text-gray-600">{project.caseStudy.deliveryStyle}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#dbe6fb] bg-white p-6">
          <h2 className="text-2xl font-bold text-[#100b47]">Scope Delivered</h2>
          <ul className="mt-4 space-y-3">
            {project.caseStudy.scope.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#266bf1]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-[#dbe6fb] bg-white p-6">
          <h2 className="text-2xl font-bold text-[#100b47]">
            What Needed Careful Management
          </h2>
          <ul className="mt-4 space-y-3">
            {project.caseStudy.constraints.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#266bf1]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-[#dbe6fb] bg-white p-6">
        <h2 className="text-2xl font-bold text-[#100b47]">How We De-Risked Delivery</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {project.caseStudy.riskManagement.map((item, index) => (
            <article
              key={item}
              className="rounded-xl border border-[#dbe6fb] bg-[#f8fbff] p-4"
            >
              <p className="text-sm font-semibold text-[#266bf1]">Step 0{index + 1}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[#dbe6fb] bg-white p-6">
        <h2 className="text-2xl font-bold text-[#100b47]">Photo Evidence</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Selected images from the completed project. We prioritise real build
          outcomes over staged render-style imagery.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {galleryImages.map((imageUrl, index) => (
            <div key={imageUrl} className="overflow-hidden rounded-xl">
              <Image
                src={imageUrl}
                alt={`${project.title} photo ${index + 1}`}
                width={1100}
                height={760}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-[#dbe6fb] bg-white p-6">
          <h2 className="text-2xl font-bold text-[#100b47]">Outcome</h2>
          <ul className="mt-4 space-y-3">
            {project.caseStudy.outcomes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#266bf1]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="rounded-2xl border border-[#dbe6fb] bg-gradient-to-br from-[#f8fbff] to-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#266bf1]">
            Client Feedback
          </p>
          <blockquote className="mt-3 text-base leading-relaxed text-[#100b47]">
            &ldquo;{project.caseStudy.testimonial.quote}&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-gray-600">
            {project.caseStudy.testimonial.author}
          </p>
          {project.caseStudy.testimonial.reviewUrl && (
            <a
              href={project.caseStudy.testimonial.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-[#266bf1] hover:underline"
            >
              View published review
            </a>
          )}
        </aside>
      </section>

      {relatedProjects.length > 0 && (
        <section className="mt-8 rounded-2xl border border-[#dbe6fb] bg-white p-6">
          <h2 className="text-2xl font-bold text-[#100b47]">Related Case Studies</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {relatedProjects.map((related) => (
              <Link
                key={related.slug}
                href={`/portfolio/${related.slug}`}
                className="group overflow-hidden rounded-xl border border-[#dbe6fb]"
              >
                <Image
                  src={related.coverImage}
                  alt={related.coverImageAlt}
                  width={900}
                  height={600}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#266bf1]">
                    {related.category}
                  </p>
                  <h3 className="mt-2 text-base font-bold leading-snug text-[#100b47] group-hover:text-[#266bf1]">
                    {related.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
    </main>
  );
}
