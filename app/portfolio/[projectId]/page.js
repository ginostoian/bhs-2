import { notFound } from "next/navigation";
import Hero from "../components/Hero";
import PhotoGallery from "../components/PhotoGallery";

async function getProjectData(projectId) {
  const projects = {
    "daniel-n19": {
      title: "Renovation & Extension in N19",
      subtitle: "A complete renovation and kitchen extension",
      description:
        "Lorem ipusm solo dorlr amet hamish unu doi 3 cinci si dupa am fost la piata si mi s-a facut foame tare de tot.",
      images: [
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-2-lateral-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-basin-oval-mirror.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-bath-concealed-tap.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-closeup.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-front-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-lateral-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bedroom.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-built-in-cupboards.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-entertainment-unit.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-exterior.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-garden-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-hallway.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-kitchen-cabinets-closeup.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-kitchen-cabinets.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-kitchen-front-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-kitchen-island.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-kitchen.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-room.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-outside-door.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-sitting-area-chimney.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-sitting-area.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-stairs-detail.webp",
        ,
      ],
    },
    "george-n16": {
      title: "Kitchen renovation in N16",
      subtitle: "A complete renovation and kitchen extension",
      description:
        "Lorem ipusm solo dorlr amet hamish unu doi 3 cinci si dupa am fost la piata si mi s-a facut foame tare de tot.",
      images: [
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-2-lateral-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-2-lateral-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-2-lateral-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-2-lateral-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-2-lateral-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-2-lateral-view.webp",
        "/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-2-lateral-view.webp",
      ],
    },
  };

  return projects[projectId] || null;
}

export async function generateStaticParams() {
  return [{ projectId: "daniel-n19" }, { projectId: "george-n16" }];
}

export default async function ProjectPage({ params }) {
  const projectData = await getProjectData(params.projectId);

  if (!projectData) {
    notFound();
  }

  return (
    <main>
      <Hero projectData={projectData} />
      <PhotoGallery projectData={projectData} />
    </main>
  );
}
