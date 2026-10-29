export const planningTools = [
  ["Extension calculator", "/extension-calculator"],
  ["Loft calculator", "/loft-conversion-cost-calculator"],
  ["Renovation calculator", "/renovation-calculator"],
  ["Kitchen calculator", "/kitchen-calculator"],
  ["Bathroom calculator", "/tools/bathroom-cost-calculator"],
];
export const serviceResources = {
  "/house-extension": {
    name: "extension",
    tool: planningTools[0],
    guide: [
      "Extension cost guide",
      "/blog/single-storey-extension-cost-london",
    ],
    project: ["Explore a completed rear extension", "/portfolio/james-n8"],
  },
  "/general-renovation": {
    name: "renovation",
    tool: planningTools[2],
    guide: [
      "London renovation cost guide",
      "/blog/home-renovation-cost-london-2026",
    ],
    project: ["Explore a completed home renovation", "/portfolio/daniel-n19"],
  },
  "/kitchen-renovation": {
    name: "kitchen",
    tool: planningTools[3],
    guide: [
      "Compare bespoke, Howdens and IKEA kitchens",
      "/blog/bespoke-vs-howdens-vs-ikea-kitchen-london",
    ],
    project: ["See a kitchen within a completed home", "/portfolio/daniel-n19"],
  },
  "/bathroom-renovation": {
    name: "bathroom",
    tool: planningTools[4],
    guide: [
      "Bathroom renovation guide",
      "/blog/bathroom-renovation-london-trends-2026",
    ],
  },
  "/loft-conversion": {
    name: "loft conversion",
    tool: planningTools[1],
    guide: [
      "Loft conversion cost in London, 2026",
      "/blog/loft-conversion-cost-london",
    ],
  },
};
export const articleServices = {
  "home-renovation-cost-london-2026": "/general-renovation",
  "kitchen-providers-comparison-guide": "/kitchen-renovation",
  "bespoke-vs-howdens-vs-ikea-kitchen-london": "/kitchen-renovation",
  "house-extension-value-london-guide": "/house-extension",
  "loft-conversions-london-complete-guide-2026": "/loft-conversion",
  "loft-conversion-cost-london": "/loft-conversion",
  "side-return-extension-cost-london": "/house-extension",
  "kitchen-extension-cost-london": "/house-extension",
};
