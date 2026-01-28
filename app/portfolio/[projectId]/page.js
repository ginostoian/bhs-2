import { notFound } from "next/navigation";
import Hero from "../components/Hero";
import PhotoGallery from "../components/PhotoGallery";

const PROJECTS = {
  "daniel-n19": {
    title: "Renovation & Extension in N19",
    subtitle: "A complete renovation and kitchen extension",
    description:
      "This stunning N19 property underwent a complete transformation, featuring a modern kitchen extension that seamlessly blends indoor and outdoor living. The renovation includes beautifully designed bathrooms, bespoke built-in storage, and carefully curated living spaces throughout.",
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
    ],
  },
  "george-n16": {
    title: "Kitchen renovation and installation in N16",
    subtitle: "Kitchen renovation and installation in N16",
    description:
      "A sleek and contemporary kitchen renovation in Stoke Newington, featuring handleless cabinetry, premium worktops, and integrated appliances. This design maximises both functionality and aesthetic appeal in a compact urban space.",
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
      "A bright and airy kitchen transformation in East London, combining classic design elements with modern convenience. The renovation features quality timber units, stone worktops, and thoughtful layouts for everyday family living.",
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
      "An extensive kitchen renovation featuring bespoke cabinetry, premium fixtures, and a layout designed for both cooking and entertaining. This E3 project showcases attention to detail with quality materials throughout.",
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
      "A side return extension that dramatically increased this E7 home's living space and natural light. The new kitchen area flows seamlessly into the dining space, creating an open-plan layout perfect for modern family life.",
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
      "A complete kitchen overhaul in E10, transforming an outdated space into a modern culinary haven. Features include custom cabinetry, contemporary finishes, and clever storage solutions that maximise every inch of available space.",
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
  "melina-e7": {
    title: "Bathroom design & renovation in E7",
    subtitle: "Bathroom design & renovation in E7",
    description:
      "A luxurious bathroom redesign featuring elegant tiling, modern fixtures, and spa-like finishes. This E7 project transformed a tired bathroom into a serene retreat with attention to both style and functionality.",
    images: [
      "/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-1.webp",
      "/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-2.webp",
      "/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-3.webp",
      "/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-4.webp",
      "/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-5.webp",
      "/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-6.webp",
      "/assets/portfolio/bathroom-melina-e7/melina-bathroom-e7-7.webp",
    ],
  },
  "james-n8": {
    title: "Kitchen extension and renovation in N8",
    subtitle: "Kitchen extension and renovation in N8",
    description:
      "A striking kitchen extension in N8 that opens the home to the garden with large glazed doors. The project combines structural work with a high-spec kitchen installation, creating a light-filled space ideal for cooking and entertaining.",
    images: [
      "/assets/portfolio/extension-james-n8/extension-james-1.webp",
      "/assets/portfolio/extension-james-n8/extension-james-2.webp",
      "/assets/portfolio/extension-james-n8/extension-james-3.webp",
      "/assets/portfolio/extension-james-n8/extension-james-4.webp",
      "/assets/portfolio/extension-james-n8/extension-james-5.webp",
      "/assets/portfolio/extension-james-n8/extension-james-6.webp",
      "/assets/portfolio/extension-james-n8/extension-james-7.webp",
      "/assets/portfolio/extension-james-n8/extension-james-8.webp",
      "/assets/portfolio/extension-james-n8/extension-james-9.webp",
      "/assets/portfolio/extension-james-n8/extension-james-10.webp",
      "/assets/portfolio/extension-james-n8/extension-james-11.webp",
      "/assets/portfolio/extension-james-n8/extension-james-12.webp",
    ],
  },
  "karim-e9": {
    title: "Two bathroom renovations in E9",
    subtitle: "Two bathroom renovations in E9",
    description:
      "Two distinctive bathroom renovations in the same E9 property, each with its own character. Featuring bold tile choices, quality sanitaryware, and thoughtful design, these spaces demonstrate versatility in bathroom styling.",
    images: [
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-blue-1.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-blue-2.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-blue-3.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-blue-4.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-blue-5.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-blue-6.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-blue-7.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-blue-8.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-blue-9.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-1.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-2.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-3.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-4.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-5.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-6.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-7.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-8.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-9.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-10.webp",
      "/assets/portfolio/textile-building-bathrooms/bathroom-renovation-green-11.webp",
    ],
  },
};

async function getProjectData(projectId) {
  return PROJECTS[projectId] || null;
}

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map((projectId) => ({ projectId }));
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
