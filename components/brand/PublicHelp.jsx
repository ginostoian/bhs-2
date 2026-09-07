"use client";
import { usePathname } from "next/navigation";
import Faq from "./Faq";
import PageHelp from "./PageHelp";
const q = (question, answer) => ({ question, answer });
export default function PublicHelp() {
  const path = usePathname();
  // These templates already render their own visible, subject-specific FAQs.
  if (
    [
      "/extension-calculator",
      "/renovation-calculator",
      "/kitchen-calculator",
      "/btu-calculator",
      "/tools/bathroom-cost-calculator",
    ].includes(path)
  )
    return null;
  if (
    path === "/" ||
    path === "/house-extension" ||
    [
      "/loft-conversion",
      "/general-renovation",
      "/kitchen-renovation",
      "/bathroom-renovation",
      "/basement-conversion",
      "/faq",
      "/contact",
      "/about",
      "/our-guarantee",
    ].includes(path) ||
    path.startsWith("/locations/") ||
    path.startsWith("/portfolio/") ||
    (path.startsWith("/blog/") &&
      !path.includes("/category/") &&
      !path.includes("/author/"))
  )
    return null;
  if (
    /^\/(quotes|invoices|gantt)\//.test(path) ||
    path.startsWith("/catalogue/share/")
  )
    return (
      <div className="bh-wrap" style={{ paddingBottom: 40 }}>
        <PageHelp />
      </div>
    );
  let items;
  if (path.includes("calculator"))
    items = [
      q(
        "Is this estimate a quotation?",
        "No. The calculator gives an early planning figure from the inputs and assumptions shown. A quotation follows a review of your property, drawings, access and specification. Check the results for VAT, fees and fit-out allowances before comparing figures.",
      ),
      q(
        "What information makes the estimate more useful?",
        "Use measured floor areas and realistic choices for structure, layout and finishes. If you are unsure, compare a few scenarios and keep a record of the assumptions to discuss with us.",
      ),
      q(
        "Can you build from drawings I already have?",
        "Yes. We can review your existing drawings and price the building work. If design support is needed, we can manage your relationship with one of our trusted independent architects.",
      ),
    ];
  else if (path.includes("submitted"))
    items = [
      q(
        "What happens next?",
        "The team reviews your enquiry and contacts you using the details provided. Keep any drawings, property information and questions together so the first conversation can focus on your priorities.",
      ),
      q(
        "Can I add information to my enquiry?",
        "Yes. Contact Better Homes and mention the name and email address used in your enquiry so the team can connect the additional details with your project.",
      ),
    ];
  else if (path.includes("form"))
    items = [
      q(
        "What should I prepare before completing this form?",
        "Have the property postcode, a short description of the work, your target timing and any existing drawings ready. An approximate investment range helps us understand whether the scope is realistic.",
      ),
      q(
        "Do I need final drawings to enquire?",
        "No. You can contact us at an early stage. Tell us whether you need design support or already have an architect, and we will explain the next practical step.",
      ),
    ];
  else if (path.startsWith("/blog"))
    items = [
      q(
        "How should I use these renovation guides?",
        "Use the guides to prepare your brief, identify questions and compare scopes. Published costs are planning guidance tied to the stated date and assumptions, rather than a quotation for your property.",
      ),
      q(
        "Can you help apply a guide to my London home?",
        "Yes. Bring your postcode, drawings if available and the questions the guide raises. We can discuss feasibility, construction scope and where specialist design advice is needed.",
      ),
    ];
  else if (path.startsWith("/portfolio"))
    items = [
      q(
        "Can you deliver a similar project in my home?",
        "The photographs show completed Better Homes projects. A similar result depends on your property, structure, permissions, specification and budget. We can review those constraints with you before recommending a route.",
      ),
      q(
        "Can I use these projects to brief my architect?",
        "Yes. Note the layouts, light, materials and details you like. Your architect can then assess what is appropriate for your home, and we can contribute buildability and construction cost advice.",
      ),
    ];
  else if (path.includes("privacy") || path === "/tos")
    items = [
      q(
        "Where can I ask about these terms or my information?",
        "Contact Better Homes using the contact details on this website and explain the policy or information you want to discuss. Include only the details needed to identify your enquiry.",
      ),
      q(
        "Do these website terms replace my project contract?",
        "Your signed project documents set out the agreed building scope and commercial terms. Read them alongside the policies here and ask for clarification before committing to work.",
      ),
    ];
  else if (path.includes("catalogue"))
    items = [
      q(
        "Does a catalogue item confirm price and availability?",
        "Check the current specification, supplier price and lead time before ordering. Product choices must be coordinated with your project measurements, allowances and installation requirements.",
      ),
      q(
        "Who confirms whether a product is suitable?",
        "Discuss the selection with the project team and the relevant designer or installer. Dimensions, services, substrate and maintenance requirements can all affect suitability.",
      ),
    ];
  else if (path.includes("partner"))
    items = [
      q(
        "Which partners does Better Homes work with?",
        "We work with independent architects, designers, specialist trades and suppliers whose work supports carefully managed London home improvements. Tell us your discipline, experience and the kind of collaboration you have in mind.",
      ),
      q(
        "How are responsibilities agreed?",
        "Professional appointments, supply arrangements and building responsibilities are defined for each project. We make the scope and points of contact clear before work starts.",
      ),
    ];
  else
    items = [
      q(
        "Where in London do you work?",
        "Our focus is Central, North and East London, with selected projects in South London. Send your postcode and a short brief so we can confirm the fit for your project.",
      ),
      q(
        "What does design and build mean at Better Homes?",
        "We manage the construction and your relationship with a trusted independent architect. If you already have drawings or an architect, we can work with that team. The proposal identifies each appointment, responsibility and fee.",
      ),
      q(
        "Do you take on standalone kitchens and bathrooms?",
        "Yes. We deliver kitchen and bathroom renovations as individual projects as well as within extensions and whole-home renovations.",
      ),
    ];
  return <Faq items={items} />;
}
