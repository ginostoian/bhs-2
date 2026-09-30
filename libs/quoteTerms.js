// Standard terms shown on every quote (public quote page and quote PDF).
export const DEFAULT_PAYMENT_TERMS =
  "Standard Better Homes terms and conditions apply. All work is guaranteed and insured. Payment terms: deposit required, then weekly payments until completion.";

export const DEFAULT_LEAD_TIME =
  "We typically require 2 weeks notice to start a project.";

export const quoteTermsSections = [
  {
    title: "General Terms",
    paragraphs: [
      "Any new services Building control might require are not included and will be subject to a new quote.",
      "Any extra services not mentioned in this quote will be subject to a new quote. Please read the quote carefully to see what is included.",
      "Any unexpected work or additional tasks as well as any damage to materials/items will be the responsibility of the client. We do not open packages upon delivery. We will open packages only during installation. We do not take any responsibility for any damaged items.",
      "This quote is for labour and building materials only. All items on the Client to Supply list are to be purchased by the client. In the situation that we take care of ordering materials on your behalf, the price of the materials will be invoiced before we purchase them.",
      "Parking permits if needed, to be supplied by the client.",
      "We also offer a design and supply service. If you are interested please ask us more about it and we will walk through what that entails.",
    ],
  },
  {
    title: "Bathroom Installation Standards",
    intro:
      "The quote includes standard installation of (unless otherwise specified):",
    bullets: [
      "Standard pattern tiling with standard ceramic tiles. The quote does not cover for complete mosaic tiling, complete herringbone style pattern or border patterns, cement tiles on walls and/or floor or any other tiles which require special installation or sealing as these are more time consuming and would influence the cost. If this is something you would like, please let us know.",
      "Same layout for plumbing",
      "Shower tray (not wetroom kit)",
      "Floor standing toilet",
      "4 spotlights installation as standard",
      "Taps on sink",
      "Visible shower pipes",
    ],
  },
  {
    title: "Kitchen Fitting Standards",
    intro:
      "The quote includes standard installation of (unless otherwise specified):",
    bullets: [
      "Hob/oven installation: install new hob/oven in same location and like for like as existing",
      "Sink installation: install new sink in same location overmounted on worktop",
      "Worktop installation: install 2 runs of worktop - laminate or wooden worktop (not composite, not stone)",
      "Taps on sink",
      "Tile splashback with standard tiles up to wall units",
    ],
  },
  {
    title: "Miscellaneous Standards",
    bullets: [
      "Floor levelling or repairs to subfloor if required to be assessed and calculated accordingly",
      "Painting refers to minor repairs and standard paint unless otherwise specified",
      "Installation of wooden doors - same size as existing, original frames unless quoted differently",
      "Installation of radiators - same position and approximately the same size unless quoted differently",
    ],
  },
  {
    title: "Project Scheduling & Deposits",
    paragraphs: [
      "Start date is subject to availability. We will work with you to find a suitable start date but usually we need 10 days from the agreement to be able to start.",
      "To book the start date agreed upon we require a small deposit. Depending on the size of the project this ranges between £300 - £1,000.",
      "All start dates are flexible (1 - 3 days) for both ends (the company or the client). This is so that if something unexpected happens and you need to postpone the start date for a couple of days you wouldn't lose your deposit.",
    ],
  },
  {
    title: "Quality Assurance",
    intro: "The above quote guarantees quality property care:",
    bullets: [
      "Isolating floors and furniture",
      "Clean and tidy job site",
      "Cleaning at the end of the project",
      "Project completed to a very high standard",
    ],
  },
  {
    title: "Radiator Work Disclaimer",
    paragraphs: [
      "Upon radiators removal and reinstallation (in order to paint behind them) we will bleed the radiators. We do not take any responsibility for any fault your boiler might show as removal and reinstallation of radiators should not break a boiler system. In the rare cases when boilers do show errors, remedial works are not included in the price shown above.",
    ],
  },
];

const itemTotal = (item) => item.customerTotal || item.total || 0;

export const quoteCategoryTotal = (service) =>
  service.items?.reduce((sum, item) => sum + itemTotal(item), 0) || 0;

// Customer-facing totals: sum of category items (headings excluded) plus VAT.
export const calculateQuoteTotals = (quote) => {
  const vatRate = quote.pricing?.vatRate || 20;
  const subtotal =
    quote.services?.reduce(
      (sum, service) =>
        sum +
        (service.type === "category" || !service.type
          ? quoteCategoryTotal(service)
          : 0),
      0,
    ) || 0;
  const vat = subtotal * (vatRate / 100);
  return { vatRate, subtotal, vat, total: subtotal + vat };
};
