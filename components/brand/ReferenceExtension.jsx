/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
"use client";
import ServiceConfidence, { ServiceAftercare } from "./ServiceConfidence";
import PlanningLinks from "./PlanningLinks";
import { businessFacts } from "@/libs/businessFacts";
import React from "react";
import ExtensionCosts from "./ExtensionCosts";
import Image from "next/image";
import { FaqSchema } from "./Schema";
import EnquiryForm from "./EnquiryForm";
import ProofStrip from "./ProofStrip";
import MobileTrust from "./MobileTrust";
export default class ReferenceExtension extends React.Component {
  state = {
    narrow: false,
    menuOpen: false,
    ddOpen: false,
    type: 0,
    step: 0,
    openFaq: -1,
  };

  componentDidMount() {
    this._onResize = () => {
      const narrow = window.innerWidth < 980;
      if (narrow !== this.state.narrow)
        this.setState({ narrow, ddOpen: false, menuOpen: false });
    };
    this._onResize();
    window.addEventListener("resize", this._onResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this._onResize);
  }

  handleTabKeyDown = (event, index, count, stateKey) => {
    let next;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = (index + 1) % count;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = (index - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.setState({ [stateKey]: next });
    event.currentTarget
      .closest('[role="tablist"]')
      .querySelectorAll('[role="tab"]')
      [next]?.focus();
  };

  renderVals() {
    const { narrow, menuOpen, ddOpen, type, step, openFaq } = this.state;

    const typeData = [
      {
        name: "Rear extension",
        summary:
          "Extends the back of the house into the garden, usually to create one open kitchen, dining and living room with a direct connection to outside.",
        bestFor:
          "Terraces and semis with a generous garden where the kitchen is currently cut off from the rest of the house.",
        planning:
          "Many single-storey rear extensions fall within permitted development. Depth, height and boundary distances decide it; we confirm with your architect before anything is priced.",
        care: "Steel spans and foundations, glazing specification and solar gain, party wall notices, and keeping the garden usable after the build.",
      },
      {
        name: "Side-return extension",
        summary:
          "Fills the narrow strip beside a Victorian or Edwardian kitchen. A small footprint, but the change in width and daylight is transformative.",
        bestFor:
          "Period terraces with an unused side passage and a kitchen that feels like a corridor.",
        planning:
          "Often permitted development if kept within the height and width limits. Party wall notices or agreements may be required, depending on the work and neighbouring structures.",
        care: "Restricted access, so materials and spoil often move through the house. Rooflights along the boundary wall, drainage rerouting and neighbour relations.",
      },
      {
        name: "Wrap-around extension",
        summary:
          "Combines the rear and side return in an L-shape for the largest single-storey gain, typically a kitchen-living room across the full width of the plot.",
        bestFor:
          "Homeowners who want one substantial project rather than two smaller ones, and have the garden to spare.",
        planning:
          "Usually requires a planning application rather than permitted development. Allow for this in the programme.",
        care: "Structural complexity at the corner, drainage and manhole positions, a longer programme, and phasing so you can keep living in the house.",
      },
      {
        name: "Double-storey extension",
        summary:
          "Adds space on two floors at once: often a larger kitchen below and a bedroom or bathroom above, with a new roof tied into the existing one.",
        bestFor:
          "Growing families who need a bedroom as much as a kitchen, or homes where the value gain justifies the larger investment.",
        planning:
          "The planning route needs to be checked for the particular property, with attention to overlooking, daylight to neighbours and matching materials.",
        care: "Foundations designed for the added load, matching brickwork and roof details, weathering the house during structural work, and upstairs services.",
      },
    ];
    const types = typeData.map((t, i) => ({
      ...t,
      n: "0" + (i + 1),
      selected: type === i,
      color: type === i ? "#202925" : "#7A837A",
      select: () => this.setState({ type: i }),
    }));

    const projects = [
      {
        href: "/portfolio/james-n8",
        img: "/assets/portfolio/extension-james-n8/extension-james-1.webp",
        alt: "Kitchen extension and renovation, N8",
        meta: "N8, North London · Rear extension and renovation",
        title: "A brighter rear with a stronger garden connection",
        summary:
          "A brighter kitchen and living space, with a closer connection to the garden.",
      },
      {
        href: "/portfolio/ava-e7",
        img: "/assets/portfolio/extension-ava-e7/side-return-extension-1.webp",
        alt: "Side-return kitchen extension, E7",
        meta: "E7, East London · Side-return extension",
        title: "A side return turned into the kitchen-dining room",
        summary:
          "A narrow side return becomes a kitchen and dining room with space to gather.",
      },
      {
        href: "/portfolio/daniel-n19",
        img: "/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp",
        alt: "Kitchen-living space in a rear extension, N19",
        meta: "N19, North London · Rear extension and whole-home renovation",
        title: "A family home opened to the garden",
        summary:
          "A kitchen, dining and living space brought together, with the rest of the house renewed around it.",
      },
    ];

    const included = [
      "Demolition, excavation and foundations to the engineer’s design",
      "Steelwork, structural openings and temporary works",
      "Walls, roof, insulation, rooflights and installation of glazed doors",
      "Drainage alterations, plumbing, heating and electrics",
      "Plastering, flooring preparation and decoration",
      "Kitchen fitting and second-fix joinery where within scope",
      "Building control coordination and party wall access arrangements",
      "Snagging, handover documents and the 10-year extension workmanship guarantee",
    ];
    const excluded = [
      "Architect, structural engineer and party wall surveyor fees",
      "Planning and building control application fees",
      "Kitchen units, appliances, sanitaryware and tiles, unless supplied against an agreed allowance",
      "Glazing systems where you prefer to order direct from a supplier",
      "Landscaping beyond making good the area around the build",
      "VAT, shown separately on every quotation",
    ];

    const stepData = [
      {
        name: "Your home and your ideas",
        happens:
          "A call, then a visit. We look at the house, the garden, access and what you want the space to do, and give an honest early view on route and budget.",
        decide:
          "Whether the project is worth pursuing and, if you need one, whether to meet an architect we recommend.",
        receive:
          "A written summary of the conversation with early budget assumptions and suggested next steps.",
      },
      {
        name: "Shape the plans",
        happens:
          "Your architect develops the drawings and agreed planning submissions. With managed support, we coordinate discussions and follow up questions, adding construction cost and buildability advice. You approve the design and budget.",
        decide:
          "Layout, glazing, roof form and the level of finish. The bigger cost decisions are made here, not on site.",
        receive:
          "Approved drawings from your architect and cost feedback from us against each option.",
      },
      {
        name: "Agree the work and price",
        happens:
          "We work through the drawings, your kitchen choices and finishes, then explain the quote and agree when the work will happen.",
        decide:
          "The final scope, allowances, start date and how you will live during the build.",
        receive:
          "A detailed quote showing what is covered, an agreed schedule and a contract naming your project lead.",
      },
      {
        name: "Watch your home take shape",
        happens:
          "Your project lead looks after the build and keeps you updated each week. If a change is needed, we explain the options, cost and timing so you can agree it in writing before work goes ahead.",
        decide:
          "Finish selections on the agreed decision schedule, and any changes you choose to make.",
        receive:
          "A weekly update: work completed, what is next, decisions needed, risks and any cost movement, each with an owner and date.",
      },
      {
        name: "Settle into your new space",
        happens:
          "We walk the finished space with you, record snags and close them out, then hand over documents, certificates and warranties.",
        decide: "Sign-off, and how you want to be contacted for aftercare.",
        receive:
          "A snagging record, building control completion, product warranties and a named aftercare contact under the 10-year extension workmanship guarantee.",
      },
    ];
    const steps = stepData.map((s, i) => ({
      ...s,
      n: "0" + (i + 1),
      selected: step === i,
      color: step === i ? "#202925" : "#7A837A",
      line: step === i ? "#4D5B4B" : "transparent",
      select: () => this.setState({ step: i }),
    }));

    const costDrivers = [
      {
        n: "01",
        name: "Footprint and structure",
        text: "Floor area, steel spans, and whether the existing rear wall comes out entirely.",
      },
      {
        n: "02",
        name: "Glazing",
        text: "Sliding or bifold doors, rooflights and their size, frame material and performance.",
      },
      {
        n: "03",
        name: "Ground and access",
        text: "Soil, drains, trees and how close neighbours are. Side returns often mean carrying everything through the house.",
      },
      {
        n: "04",
        name: "Kitchen and finishes",
        text: "Joinery, worktops, flooring and underfloor heating vary more than any structural item.",
      },
      {
        n: "05",
        name: "Scope beyond the extension",
        text: "Rewiring, a new boiler, a downstairs WC or reworking the rest of the ground floor at the same time.",
      },
    ];

    const faqData = [
      {
        q: "Do I need planning permission for an extension?",
        a: "Not always. Many single-storey rear and side-return extensions fall within permitted development, subject to depth, height and boundary rules. Wrap-around and double-storey extensions usually need a planning application. Your architect confirms the route; we build in time for it.",
      },
      {
        q: "How long does an extension take on site?",
        a: "It depends on structure, glazing lead times and what else is happening in the house. We set a programme in the quotation and report against it every week rather than quoting a generic figure here.",
      },
      {
        q: "Can we live in the house during the build?",
        a: "It may be possible, depending on the work and safe separation of the site. We agree a temporary kitchen arrangement, dust separation and working hours before the start date, and phase the work so the rest of the house stays usable.",
      },
      {
        q: "Who deals with the neighbours and the party wall?",
        a: "Party wall matters are handled by an independent surveyor appointed for your project. We help you understand the notices, keep neighbours informed of noisy phases, and manage access agreements on site.",
      },
      {
        q: "What does the 10-year extension guarantee cover?",
        a: businessFacts.workmanship,
      },
    ];
    const faqs = faqData.map((f, i) => ({
      ...f,
      open: openFaq === i,
      glyph: openFaq === i ? "–" : "+",
      toggle: () => this.setState({ openFaq: openFaq === i ? -1 : i }),
    }));

    return {
      wide: !narrow,
      narrow,
      menuOpen,
      ddOpen,
      menuLabel: menuOpen ? "Close" : "Menu",
      toggleMenu: () => this.setState((s) => ({ menuOpen: !s.menuOpen })),
      openDd: () => this.setState({ ddOpen: true }),
      closeDd: () => this.setState({ ddOpen: false }),
      toggleDd: () => this.setState((s) => ({ ddOpen: !s.ddOpen })),
      types,
      projects,
      included,
      excluded,
      steps,
      costDrivers,
      faqs,
    };
  }

  render() {
    const {
      closeDd,
      costDrivers,
      ddOpen,
      excluded,
      faqs,
      included,
      menuLabel,
      menuOpen,
      narrow,
      notSent,
      openDd,
      projects,
      sent,
      showPortal,
      stages,
      steps,
      toggleDd,
      toggleMenu,
      touchpoints,
      types,
      wide,
    } = this.renderVals();
    return (
      <main>
        <section
          data-screen-label="Service hero"
          className="bh-mobile-hero"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 40px) 0",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
              gap: "32px 64px",
              alignItems: "end",
              marginBottom: "clamp(40px, 5vw, 64px)",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#4D5B4B",
                }}
              >
                {"House extensions in London"}
              </p>
              <h1
                style={{
                  margin: "0",
                  fontSize: "clamp(40px, 5vw, 64px)",
                  fontWeight: "500",
                  lineHeight: "1.06",
                  letterSpacing: "-0.02em",
                  textWrap: "pretty",
                }}
              >
                {
                  "More room, more light, and a house that finally works as one."
                }
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                maxWidth: "520px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "18px",
                  lineHeight: "1.6",
                  textWrap: "pretty",
                }}
              >
                {
                  "Room to cook together, gather around the table and open the doors to the garden. We build London extensions around the way you want to live, with clear pricing and a project lead who keeps you informed."
                }
              </p>
              <MobileTrust />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <a
                  href="#extension-brief"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "15px 24px",
                    background: "#4D5B4B",
                    color: "#FFFFFF",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontWeight: "500",
                    lineHeight: "1.25",
                    transition: "background-color .2s ease",
                  }}
                >
                  {"Send us your brief"}
                </a>
                <a
                  href="/extension-calculator"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "14px 24px",
                    border: "1px solid #202925",
                    color: "#202925",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontWeight: "500",
                    lineHeight: "1.25",
                    transition: "background-color .2s ease",
                  }}
                >
                  {"Estimate the cost"}
                </a>
              </div>
            </div>
          </div>
          <figure
            style={{
              margin: "0",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                aspectRatio: "16 / 8",
                background: "#D8D2C6",
                overflow: "hidden",
              }}
            >
              <Image
                width={1200}
                height={900}
                sizes="(max-width:700px) 100vw, 50vw"
                src="/assets/portfolio/extension-ava-e7/side-return-extension-2.webp"
                alt="Side-return kitchen extension in E7 with rooflights along the boundary wall"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                priority
              />
            </div>
            <figcaption
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                fontSize: "14px",
                lineHeight: "1.45",
                color: "#4D5B4B",
              }}
            >
              <span>{"Side-return extension and kitchen"}</span>
              <a
                href="/portfolio/ava-e7"
                style={{
                  color: "#4D5B4B",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                {"E7, East London"}
              </a>
            </figcaption>
          </figure>
        </section>
        <ProofStrip servicePath="/house-extension" />

        <section
          id="types"
          data-screen-label="Extension types"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              maxWidth: "640px",
              marginBottom: "40px",
            }}
          >
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                fontWeight: "500",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#4D5B4B",
              }}
            >
              {"Which extension"}
            </p>
            <h2
              style={{
                margin: "0",
                fontSize: "clamp(30px, 3.4vw, 40px)",
                fontWeight: "500",
                lineHeight: "1.15",
                letterSpacing: "-0.01em",
                textWrap: "pretty",
              }}
            >
              {"Find the extra space your home is missing"}
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "40px 64px",
            }}
          >
            <div
              role="tablist"
              aria-label="Extension types"
              aria-orientation="vertical"
              style={{
                display: "flex",
                flexDirection: "column",
                borderTop: "1px solid #D8D2C6",
              }}
            >
              {types.map((t, index) => (
                <React.Fragment key={index}>
                  <button
                    type="button"
                    role="tab"
                    tabIndex={t.selected ? 0 : -1}
                    id={`extension-type-tab-${index}`}
                    aria-controls={`extension-type-panel-${index}`}
                    onKeyDown={(event) =>
                      this.handleTabKeyDown(event, index, types.length, "type")
                    }
                    aria-selected={t.selected}
                    onClick={t.select}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                      width: "100%",
                      padding: "20px 0",
                      background: "none",
                      border: "0",
                      borderBottom: "1px solid #D8D2C6",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "22px",
                      fontWeight: "500",
                      lineHeight: "1.25",
                      color: t.color,
                      transition: "color .2s ease",
                    }}
                  >
                    <span>{t.name}</span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#A65B43",
                      }}
                    >
                      {t.n}
                    </span>
                  </button>
                </React.Fragment>
              ))}
            </div>
            {types.map((t, index) => (
              <React.Fragment key={index}>
                <div
                  role="tabpanel"
                  id={`extension-type-panel-${index}`}
                  aria-labelledby={`extension-type-tab-${index}`}
                  tabIndex={0}
                  hidden={!t.selected}
                  style={{
                    display: t.selected ? "flex" : "none",
                    flexDirection: "column",
                    gap: "24px",
                    animation: "bhFade .32s cubic-bezier(.2,.7,.2,1) both",
                  }}
                >
                  <p
                    style={{
                      margin: "0",
                      fontSize: "22px",
                      lineHeight: "1.45",
                      fontWeight: "400",
                      textWrap: "pretty",
                    }}
                  >
                    {t.summary}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                      gap: "20px 32px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        paddingTop: "14px",
                        borderTop: "1px solid #D8D2C6",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#4D5B4B",
                        }}
                      >
                        {"Best for"}
                      </span>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "16px",
                          lineHeight: "1.55",
                        }}
                      >
                        {t.bestFor}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        paddingTop: "14px",
                        borderTop: "1px solid #D8D2C6",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#4D5B4B",
                        }}
                      >
                        {"Planning"}
                      </span>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "16px",
                          lineHeight: "1.55",
                        }}
                      >
                        {t.planning}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        paddingTop: "14px",
                        borderTop: "1px solid #D8D2C6",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "#4D5B4B",
                        }}
                      >
                        {"What we manage carefully"}
                      </span>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "16px",
                          lineHeight: "1.55",
                        }}
                      >
                        {t.care}
                      </p>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        <span id="projects" />
        <section
          id="work"
          data-screen-label="Extension work"
          style={{ background: "#EDE9E0" }}
        >
          <div
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              padding: "clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "end",
                gap: "16px 32px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  maxWidth: "640px",
                }}
              >
                <p
                  style={{
                    margin: "0",
                    fontSize: "14px",
                    fontWeight: "500",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#4D5B4B",
                  }}
                >
                  {"Completed extensions"}
                </p>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px, 3.4vw, 40px)",
                    fontWeight: "500",
                    lineHeight: "1.15",
                    letterSpacing: "-0.01em",
                    textWrap: "pretty",
                  }}
                >
                  {"See how other homes opened up"}
                </h2>
              </div>
              <a
                href="/portfolio"
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#4D5B4B",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                {"All projects"}
              </a>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                gap: "32px 24px",
              }}
            >
              {projects.map((p, index) => (
                <React.Fragment key={index}>
                  <a
                    href={p.href}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                      color: "#202925",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "4 / 3",
                        background: "#D8D2C6",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        width={1200}
                        height={900}
                        sizes="(max-width:700px) 100vw, 50vw"
                        src={p.img}
                        alt={p.alt}
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform .8s cubic-bezier(.2,.7,.2,1)",
                        }}
                        loading="lazy"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.45",
                          color: "#4D5B4B",
                        }}
                      >
                        {p.meta}
                      </span>
                      <h3
                        style={{
                          margin: "0",
                          fontSize: "24px",
                          fontWeight: "500",
                          lineHeight: "1.25",
                          textWrap: "pretty",
                        }}
                      >
                        {p.title}
                      </h3>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "16px",
                          lineHeight: "1.55",
                        }}
                      >
                        {p.summary}
                      </p>
                    </div>
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section
          id="scope"
          data-screen-label="Scope"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "40px 64px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#4D5B4B",
                }}
              >
                {"Scope"}
              </p>
              <h2
                style={{
                  margin: "0",
                  fontSize: "clamp(30px, 3.4vw, 40px)",
                  fontWeight: "500",
                  lineHeight: "1.15",
                  letterSpacing: "-0.01em",
                  textWrap: "pretty",
                }}
              >
                {"Know what your extension price includes"}
              </h2>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: "18px",
                  lineHeight: "1.6",
                  textWrap: "pretty",
                }}
              >
                {
                  "We explain your quote in detail, including what is covered and what you still need to choose. Here is a typical starting point. Your own quote will reflect your home and drawings."
                }
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#4D5B4B",
                  paddingBottom: "10px",
                }}
              >
                {"Typically included"}
              </span>
              {included.map((i, index) => (
                <React.Fragment key={index}>
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      padding: "12px 0",
                      borderTop: "1px solid #D8D2C6",
                      fontSize: "16px",
                      lineHeight: "1.5",
                    }}
                  >
                    <span
                      style={{
                        flex: "none",
                        width: "8px",
                        height: "8px",
                        marginTop: "8px",
                        background: "#4D5B4B",
                      }}
                    ></span>
                    <span>{i}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#4D5B4B",
                  paddingBottom: "10px",
                }}
              >
                {"Priced separately or by others"}
              </span>
              {excluded.map((i, index) => (
                <React.Fragment key={index}>
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      padding: "12px 0",
                      borderTop: "1px solid #D8D2C6",
                      fontSize: "16px",
                      lineHeight: "1.5",
                    }}
                  >
                    <span
                      style={{
                        flex: "none",
                        width: "8px",
                        height: "8px",
                        marginTop: "8px",
                        border: "1px solid #4D5B4B",
                      }}
                    ></span>
                    <span>{i}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section
          id="architect"
          data-screen-label="Architect route"
          style={{ background: "#EDE9E0" }}
        >
          <div
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              padding: "clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "40px 64px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#4D5B4B",
                }}
              >
                {"Design"}
              </p>
              <h2
                style={{
                  margin: "0",
                  fontSize: "clamp(30px, 3.4vw, 40px)",
                  fontWeight: "500",
                  lineHeight: "1.15",
                  letterSpacing: "-0.01em",
                  textWrap: "pretty",
                }}
              >
                {"Your choice of architect. Support either way."}
              </h2>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: "16px",
                  lineHeight: "1.55",
                  color: "#4D5B4B",
                  textWrap: "pretty",
                }}
              >
                {
                  "Choose your architect and how much you want us to coordinate. We build; your architect prepares the drawings. With managed support, you have less to organise and clear decisions to approve. Your proposal sets out the support, professional appointments and fees."
                }
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "32px 28px",
                background: "#F4F1EA",
                borderRadius: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#A65B43",
                }}
              >
                {"Route A"}
              </span>
              <h3
                style={{
                  margin: "0",
                  fontSize: "24px",
                  fontWeight: "500",
                  lineHeight: "1.25",
                }}
              >
                {"You need an architect"}
              </h3>
              <p
                style={{
                  margin: "0",
                  fontSize: "16px",
                  lineHeight: "1.55",
                  flex: "1",
                }}
              >
                {
                  "We introduce a recommended architect to develop the drawings and agreed submissions. If you want managed support, we arrange discussions, bring your priorities to the architect and follow up questions. We contribute construction cost and buildability advice as the design develops."
                }
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "32px 28px",
                background: "#F4F1EA",
                borderRadius: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#A65B43",
                }}
              >
                {"Route B"}
              </span>
              <h3
                style={{
                  margin: "0",
                  fontSize: "24px",
                  fontWeight: "500",
                  lineHeight: "1.25",
                }}
              >
                {"You have your own architect"}
              </h3>
              <p
                style={{
                  margin: "0",
                  fontSize: "16px",
                  lineHeight: "1.55",
                  flex: "1",
                }}
              >
                {
                  "We are happy to work with your chosen architect, whether drawings are underway or complete. The same managed support is available: we can coordinate discussions and speak on your behalf with your agreement, keeping you informed and bringing decisions back to you. Planning approval is not required before we talk."
                }
              </p>
            </div>
          </div>
        </section>

        <section
          id="process"
          data-screen-label="Process"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              maxWidth: "640px",
              marginBottom: "40px",
            }}
          >
            <p
              style={{
                margin: "0",
                fontSize: "14px",
                fontWeight: "500",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#4D5B4B",
              }}
            >
              {"From first ideas to moving in"}
            </p>
            <h2
              style={{
                margin: "0",
                fontSize: "clamp(30px, 3.4vw, 40px)",
                fontWeight: "500",
                lineHeight: "1.15",
                letterSpacing: "-0.01em",
                textWrap: "pretty",
              }}
            >
              {"Feel clear about what happens next"}
            </h2>
          </div>
          <div
            role="tablist"
            aria-label="Extension process"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
              gap: "0 16px",
              borderTop: "1px solid #D8D2C6",
            }}
          >
            {steps.map((s, index) => (
              <React.Fragment key={index}>
                <button
                  type="button"
                  onClick={s.select}
                  role="tab"
                  id={`extension-step-tab-${index}`}
                  aria-controls={`extension-step-panel-${index}`}
                  aria-selected={s.selected}
                  tabIndex={s.selected ? 0 : -1}
                  onKeyDown={(event) =>
                    this.handleTabKeyDown(event, index, steps.length, "step")
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "20px 0 24px",
                    background: "none",
                    border: "0",
                    borderTop: `2px solid ${s.line}`,
                    marginTop: "-1px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: s.color,
                    transition: "color .2s ease, border-color .3s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#A65B43",
                    }}
                  >
                    {s.n}
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "500",
                      lineHeight: "1.25",
                    }}
                  >
                    {s.name}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>
          {steps.map((s, index) => (
            <React.Fragment key={index}>
              <div
                role="tabpanel"
                id={`extension-step-panel-${index}`}
                aria-labelledby={`extension-step-tab-${index}`}
                tabIndex={0}
                hidden={!s.selected}
                style={{
                  display: s.selected ? "grid" : "none",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                  gap: "24px 48px",
                  padding: "32px 0 0",
                  animation: "bhFade .32s cubic-bezier(.2,.7,.2,1) both",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#4D5B4B",
                    }}
                  >
                    {"What happens"}
                  </span>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "17px",
                      lineHeight: "1.6",
                    }}
                  >
                    {s.happens}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#4D5B4B",
                    }}
                  >
                    {"What you decide"}
                  </span>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "17px",
                      lineHeight: "1.6",
                    }}
                  >
                    {s.decide}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#4D5B4B",
                    }}
                  >
                    {"What you receive"}
                  </span>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "17px",
                      lineHeight: "1.6",
                    }}
                  >
                    {s.receive}
                  </p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </section>

        <PlanningLinks servicePath="/house-extension" />
        <ExtensionCosts />
        <section
          id="cost"
          data-screen-label="Cost"
          style={{ background: "#202925", color: "#F4F1EA" }}
        >
          <div
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              padding: "clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "48px 64px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                maxWidth: "560px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#D8D2C6",
                }}
              >
                {"Cost"}
              </p>
              <h2
                style={{
                  margin: "0",
                  fontSize: "clamp(30px, 3.4vw, 40px)",
                  fontWeight: "500",
                  lineHeight: "1.15",
                  letterSpacing: "-0.01em",
                  color: "#F4F1EA",
                  textWrap: "pretty",
                }}
              >
                {"What moves the price of an extension"}
              </h2>
              <p
                style={{
                  margin: "0",
                  fontSize: "18px",
                  lineHeight: "1.6",
                  color: "#F4F1EA",
                  textWrap: "pretty",
                }}
              >
                {
                  "Your budget goes further when you know where to spend it. The size of the space is only part of the picture. Here are the choices we will help you think through."
                }
              </p>
              <a
                href="/extension-calculator"
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  alignItems: "center",
                  padding: "15px 24px",
                  background: "#F4F1EA",
                  color: "#202925",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "500",
                  lineHeight: "1.25",
                  transition: "background-color .2s ease",
                }}
              >
                {"Open the extension cost calculator"}
              </a>
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  color: "#D8D2C6",
                }}
              >
                {
                  "The calculator gives an early construction-cost range. It excludes professional fees, VAT, most finishes and contingency, and assumes straightforward access and ground conditions."
                }
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderTop: "1px solid #4D5B4B",
              }}
            >
              {costDrivers.map((c, index) => (
                <React.Fragment key={index}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr",
                      gap: "8px 16px",
                      padding: "20px 0",
                      borderBottom: "1px solid #4D5B4B",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#D8D2C6",
                        paddingTop: "4px",
                      }}
                    >
                      {c.n}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "500",
                          lineHeight: "1.3",
                          color: "#F4F1EA",
                        }}
                      >
                        {c.name}
                      </span>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "16px",
                          lineHeight: "1.55",
                          color: "#D8D2C6",
                        }}
                      >
                        {c.text}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <ServiceConfidence servicePath="/house-extension" />
        <section className="bh-wrap bh-section" aria-label="Aftercare for your extension"><ServiceAftercare /></section>
        <span id="why-us" />
        <span id="guarantees" />
        <section
          id="proof"
          data-screen-label="Proof"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "40px 64px",
              alignItems: "start",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#4D5B4B",
                }}
              >
                {"What clients say"}
              </p>
              <h2
                style={{
                  margin: "0",
                  fontSize: "clamp(30px, 3.4vw, 40px)",
                  fontWeight: "500",
                  lineHeight: "1.15",
                  letterSpacing: "-0.01em",
                  textWrap: "pretty",
                }}
              >
                {"In their words"}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 20px",
                  marginTop: "8px",
                  fontSize: "15px",
                }}
              >
                <a
                  href="https://g.page/r/CaGIVAg_unOVEBM/"
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {"Google reviews"}
                </a>
                <a
                  href="https://www.houzz.co.uk/pro/betterhomeslondon/better-homes"
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {"Houzz"}
                </a>
                <a
                  href="https://www.mybuilder.com/profile/view/celli/feedback"
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {"MyBuilder"}
                </a>
              </div>
            </div>
            <blockquote
              style={{
                margin: "0",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingTop: "20px",
                borderTop: "1px solid #D8D2C6",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "20px",
                  lineHeight: "1.5",
                  textWrap: "pretty",
                }}
              >
                {
                  "\u201cThe quality of workmanship is extremely high and they have managed to translate loose ideas put together on PowerPoint by me into reality.\u201d"
                }
              </p>
              <footer style={{ fontSize: "15px", color: "#4D5B4B" }}>
                {"Shyra Muthusamy \u00b7 "}
                <a
                  href="https://www.houzz.co.uk/viewReview/1863607/better-homes-studio-review"
                  style={{
                    color: "#4D5B4B",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {"Houzz"}
                </a>
              </footer>
            </blockquote>
            <blockquote
              style={{
                margin: "0",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingTop: "20px",
                borderTop: "1px solid #D8D2C6",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "20px",
                  lineHeight: "1.5",
                  textWrap: "pretty",
                }}
              >
                {
                  "\u201cI could not recommend them more highly. They submitted a very detailed quote which was competitively priced, and went on to do the work very quickly to a high standard.\u201d"
                }
              </p>
              <footer style={{ fontSize: "15px", color: "#4D5B4B" }}>
                {"Louise Thorogood \u00b7 "}
                <a
                  href="https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review"
                  style={{
                    color: "#4D5B4B",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {"Houzz"}
                </a>
              </footer>
            </blockquote>
          </div>

          <div
            id="faq"
            style={{
              marginTop: "clamp(56px, 7vw, 88px)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "32px 64px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                alignSelf: "start",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#4D5B4B",
                }}
              >
                {"Extension questions"}
              </p>
              <h2
                style={{
                  margin: "0",
                  fontSize: "clamp(30px, 3.4vw, 40px)",
                  fontWeight: "500",
                  lineHeight: "1.15",
                  letterSpacing: "-0.01em",
                  textWrap: "pretty",
                }}
              >
                {"Asked on most first calls"}
              </h2>
            </div>
            <div
              style={{ borderTop: "1px solid #D8D2C6", gridColumn: "span 2" }}
            >
              {faqs.map((f, index) => (
                <React.Fragment key={index}>
                  <div style={{ borderBottom: "1px solid #D8D2C6" }}>
                    <button
                      type="button"
                      onClick={f.toggle}
                      aria-expanded={f.open}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "24px",
                        padding: "22px 0",
                        background: "none",
                        border: "0",
                        textAlign: "left",
                        cursor: "pointer",
                        color: "#202925",
                        fontSize: "20px",
                        fontWeight: "500",
                        lineHeight: "1.3",
                        minHeight: "44px",
                        transition: "color .2s ease",
                      }}
                    >
                      <span>{f.q}</span>
                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: "24px",
                          fontWeight: "400",
                          color: "#4D5B4B",
                          lineHeight: "1",
                          flex: "none",
                        }}
                      >
                        {f.glyph}
                      </span>
                    </button>
                    <div hidden={!f.open}>
                      <p
                        style={{
                          margin: "0",
                          padding: "0 48px 24px 0",
                          fontSize: "17px",
                          lineHeight: "1.6",
                          maxWidth: "720px",
                          textWrap: "pretty",
                          animation: "bhFade .28s ease both",
                        }}
                      >
                        {f.a}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section
          id="enquire"
          data-screen-label="Next step"
          style={{ background: "#EDE9E0" }}
        >
          <div
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              padding: "clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "40px 64px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                maxWidth: "560px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#4D5B4B",
                }}
              >
                {"Next step"}
              </p>
              <h2
                style={{
                  margin: "0",
                  fontSize: "clamp(30px, 3.4vw, 40px)",
                  fontWeight: "500",
                  lineHeight: "1.15",
                  letterSpacing: "-0.01em",
                  textWrap: "pretty",
                }}
              >
                {"Send us your brief"}
              </h2>
              <p
                style={{
                  margin: "0",
                  fontSize: "18px",
                  lineHeight: "1.6",
                  textWrap: "pretty",
                }}
              >
                {
                  "Tell us what you would love the extra space to make possible. We will talk through your ideas, your budget and where to begin. Bring drawings if you have them, or simply tell us what is missing at home."
                }
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  paddingTop: "4px",
                }}
              >
                <a
                  href="/#contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "15px 24px",
                    background: "#4D5B4B",
                    color: "#FFFFFF",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontWeight: "500",
                    lineHeight: "1.25",
                    transition: "background-color .2s ease",
                  }}
                >
                  {"Send a project enquiry"}
                </a>
                <a
                  href="https://cal.com/bhstudio/discovery"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "14px 24px",
                    border: "1px solid #202925",
                    color: "#202925",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontWeight: "500",
                    lineHeight: "1.25",
                    transition: "background-color .2s ease",
                  }}
                >
                  {"Book a 20-minute call"}
                </a>
              </div>
            </div>
            <div id="extension-brief">
              <EnquiryForm defaultService="Extension" />
            </div>
          </div>
        </section>
        <FaqSchema
          items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
          path="/house-extension"
        />
        {this.props.relatedGuides}
      </main>
    );
  }
}
