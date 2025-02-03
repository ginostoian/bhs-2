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
      title: "Kitchen renovation and installation in N16",
      subtitle: "Kitchen renovation and installation in N16",
      description:
        "Lorem ipusm solo dorlr amet hamish unu doi 3 cinci si dupa am fost la piata si mi s-a facut foame tare de tot.",
      images: [
        "/assets/portfolio/kitchen-george-n16/kitchen-renovation-n16-1.webp",
        "/assets/portfolio/kitchen-george-n16/kitchen-renovation-n16-2.webp",
        "/assets/portfolio/kitchen-george-n16/kitchen-renovation-n16-3.webp",
        "/assets/portfolio/kitchen-george-n16/kitchen-renovation-n16-4.webp",
        "/assets/portfolio/kitchen-george-n16/kitchen-renovation-n16-5.webp",
      ],
    },
    "alice-e4": {
      title: "Kitchen renovation and installation in E4",
      subtitle: "Kitchen renovation and installation in E4",
      description:
        "Lorem ipusm solo dorlr amet hamish unu doi 3 cinci si dupa am fost la piata si mi s-a facut foame tare de tot.",
      images: [
        "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-2.webp",
        "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-3.webp",
        "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-4.webp",
        "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-5.webp",
        "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-6.webp",
        "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-7.webp",
        "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-8.webp",
        "/assets/portfolio/kitchen-alice-e4/kitchen-renovation-e4-9.webp",
      ],
    },
    "lawrence-e3": {
      title: "Kitchen renovation and installation in E3",
      subtitle: "Kitchen renovation and installation in E3",
      description:
        "Lorem ipusm solo dorlr amet hamish unu doi 3 cinci si dupa am fost la piata si mi s-a facut foame tare de tot.",
      images: [
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-1.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-3.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-5.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-7.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-8.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-9.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-10.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-11.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-12.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-13.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-14.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-15.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-16.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-17.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-2.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-4.webp",
        "/assets/portfolio/kitchen-lawrence-e3/kitchen-renovation-e3-6.webp",
      ],
    },
    "ava-e7": {
      title: "Side return kitchen extension in E7",
      subtitle: "Kitchen extension, renovation and installation in E7",
      description:
        "Lorem ipusm solo dorlr amet hamish unu doi 3 cinci si dupa am fost la piata si mi s-a facut foame tare de tot.",
      images: [
        "/assets/portfolio/extension-ava-e7/side-return-extension-1.webp",
        "/assets/portfolio/extension-ava-e7/side-return-extension-2.webp",
        "/assets/portfolio/extension-ava-e7/side-return-extension-3.webp",
        "/assets/portfolio/extension-ava-e7/side-return-extension-4.webp",
        "/assets/portfolio/extension-ava-e7/side-return-extension-5.webp",
        "/assets/portfolio/extension-ava-e7/side-return-extension-6.webp",
        "/assets/portfolio/extension-ava-e7/side-return-extension-7.webp",
        "/assets/portfolio/extension-ava-e7/side-return-extension-8.webp",
      ],
    },
    "phil-e10": {
      title: "Kitchen renovation in E10",
      subtitle: "Kitchen renovation and installation in E10",
      description:
        "Lorem ipusm solo dorlr amet hamish unu doi 3 cinci si dupa am fost la piata si mi s-a facut foame tare de tot.",
      images: [
        "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-1.webp",
        "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-2.webp",
        "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-3.webp",
        "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-4.webp",
        "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-5.webp",
        "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-6.webp",
        "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-7.webp",
        "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-8.webp",
        "/assets/portfolio/kitchen-phil-e10/phil-kitchen-e10-9.webp",
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
