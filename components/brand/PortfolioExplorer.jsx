"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./PortfolioExplorer.module.css";
const filters = [["all", "All projects"], ["extension", "Extensions"], ["loft", "Lofts"], ["renovation", "Renovations"], ["kitchen", "Kitchens"], ["bathroom", "Bathrooms"]];
export default function PortfolioExplorer({ projects }) {
  const [filter, setFilter] = useState("all");
  const matches = (p) => filter === "all" || p.tags.includes(filter);
  return <>
    <div className={styles.filters} role="group" aria-label="Filter projects by service">
      {filters.map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} aria-controls="portfolio-projects" onClick={() => setFilter(key)}>{label}</button>)}
    </div>
    <p className="bh-small" role="status" style={{ margin: "20px 0 32px" }}>{projects.filter(matches).length} projects · Explore the work and the details behind it.</p>
    <div id="portfolio-projects" className="bh-project-grid">
      {projects.map(p => <Link key={p.slug} hidden={!matches(p)} style={!matches(p) ? {display:"none"} : undefined} className="bh-project-card" href={`/portfolio/${p.slug}`}>
        <Image src={p.coverImage} alt={p.coverImageAlt} width={800} height={600} quality={90} sizes="(max-width:700px) 100vw, 33vw" />
        <p className="bh-small">{p.location} · {p.category}</p>
        <h3>{p.title}</h3><p>{p.teaser}</p>
        <span className="bh-text-link">Explore this project →</span>
      </Link>)}
    </div>
  </>;
}
