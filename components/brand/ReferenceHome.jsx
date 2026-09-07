/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
"use client";
import React from "react";
import Image from "next/image";
import { FaqSchema } from "./Schema";
import EnquiryForm from "./EnquiryForm";
import ProofStrip from "./ProofStrip";
import MobileTrust from "./MobileTrust";
import { HomeLiving, HomeHow, HomeAftercare } from "./HomeStory";
export default class ReferenceHome extends React.Component {
  state = {
    narrow: false,
    menuOpen: false,
    ddOpen: false,
    openFaq: 0,
    sent: false,
  };

  componentDidMount() {
    this._onResize = () => {
      const narrow = window.innerWidth < 980;
      if (narrow !== this.state.narrow)
        this.setState({
          narrow,
          ddOpen: false,
          menuOpen: narrow ? this.state.menuOpen : false,
        });
    };
    this._onResize();
    window.addEventListener("resize", this._onResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this._onResize);
  }

  renderVals() {
    const { narrow, menuOpen, ddOpen, openFaq, sent } = this.state;
    const count = Math.max(1, Math.min(3, this.props.projectCount ?? 3));
    const projects = [
      {
        href: "/portfolio/daniel-n19",
        img: "/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp",
        alt: "Kitchen-living space in a rear extension, N19",
        meta: "N19, North London · Extension and whole-home renovation",
        title: "A family home opened to the garden",
        summary:
          "A rear extension brings kitchen, dining and living together, with bathrooms and bedrooms renewed throughout the house.",
      },
      {
        href: "/portfolio/ava-e7",
        img: "/assets/portfolio/extension-ava-e7/side-return-extension-1.webp",
        alt: "Side-return kitchen extension, E7",
        meta: "E7, East London · Side-return extension",
        title: "A side return turned into the kitchen-dining room",
        summary:
          "A narrow side return makes room for cooking, eating and spending time together, with rooflights bringing daylight into the kitchen.",
      },
      {
        href: "/portfolio/james-n8",
        img: "/assets/portfolio/extension-james-n8/extension-james-1.webp",
        alt: "Kitchen extension and renovation, N8",
        meta: "N8, North London · Extension and renovation",
        title: "A brighter rear with a stronger garden connection",
        summary:
          "A kitchen extension opens the back of the house to the garden, creating a brighter place to gather.",
      },
    ].slice(0, count);

    const faqData = [
      {
        q: "How much does a project like mine cost?",
        a: "It depends on size, structure, finishes and site conditions. Extensions and loft conversions are typically the largest investments, whole-home renovations vary most with scope. Use the calculators for an early construction-cost range, then we confirm a figure against your property and drawings.",
      },
      {
        q: "Do I need an architect before I contact you?",
        a: "No. Bring your own architect or choose one we recommend. With either route, you can ask us to coordinate discussions, follow up design questions and speak on your behalf with your agreement. The architect prepares the drawings; we build. You approve the design, budget and any changes.",
      },
      {
        q: "How much will I need to organise myself?",
        a: "That is up to you. With managed coordination, we arrange discussions, follow up design questions and, with your agreement, speak to your architect on your behalf. We work through construction issues and involve the relevant professional where design input is needed. You receive clear options and approve the design, budget and changes. You can also manage the architect relationship yourself if you prefer.",
      },
      {
        q: "How do you keep the build on track once work starts?",
        a: "We agree the work and schedule before starting, then your project lead keeps you updated each week. If anything changes, we explain what it means for the cost and timing and ask for your agreement before doing the extra work.",
      },
      {
        q: "What happens if something goes wrong after completion?",
        a: "Every project is covered by a workmanship guarantee based on the scope delivered: ten years for extensions and lofts, two for kitchens and bathrooms, one for decorating. You receive a named aftercare contact at handover.",
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
      menuLabel: menuOpen ? "Close" : "Menu",
      toggleMenu: () => this.setState((s) => ({ menuOpen: !s.menuOpen })),
      closeMenu: () => this.setState({ menuOpen: false }),
      ddOpen,
      openDd: () => this.setState({ ddOpen: true }),
      closeDd: () => this.setState({ ddOpen: false }),
      toggleDd: () => this.setState((s) => ({ ddOpen: !s.ddOpen })),
      showPortal: this.props.showClientPortal ?? true,
      projects,
      faqs,
      sent,
      notSent: !sent,
      submitEnquiry: (e) => {
        e.preventDefault();
        this.setState({ sent: true });
      },
    };
  }

  render() {
    const {
      closeDd,
      closeMenu,
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
      steps,
      submitEnquiry,
      toggleDd,
      toggleMenu,
      types,
      wide,
    } = this.renderVals();
    return (
      <main id="top">
        <section
          data-screen-label="Hero"
          className="bh-mobile-hero"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding:
              "clamp(48px, 7vw, 96px) clamp(20px, 4vw, 40px) clamp(40px, 5vw, 64px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
              gap: "clamp(32px, 5vw, 72px)",
              alignItems: "end",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                maxWidth: "600px",
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
                  lineHeight: "1.45",
                }}
              >
                {"Extensions, loft conversions and renovations in London"}
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
                {"A home that works beautifully for the life you live."}
              </h1>
              <p
                style={{
                  margin: "0",
                  fontSize: "18px",
                  lineHeight: "1.6",
                  color: "#202925",
                  maxWidth: "560px",
                  textWrap: "pretty",
                }}
              >
                {
                  "More space, more daylight, a home that works for you. London extensions and renovations, with clear pricing and a team that keeps you informed."
                }
              </p>
              <MobileTrust />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  paddingTop: "4px",
                }}
              >
                <a
                  href="#home-brief"
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
                  }}
                >
                  {"Send us your brief"}
                </a>
                <a
                  href="#work"
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
                  }}
                >
                  {"Explore our work"}
                </a>
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
                  aspectRatio: "4 / 3",
                  background: "#D8D2C6",
                  overflow: "hidden",
                }}
              >
                <Image
                  width={1200}
                  height={900}
                  sizes="(max-width:700px) 100vw, 50vw"
                  src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-living-and-kitchen.webp"
                  alt="Open-plan kitchen and living space created by a rear extension in N19"
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
                <span>{"Rear extension and whole-home renovation"}</span>
                <span>{"N19, North London"}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <ProofStrip />

        <section
          id="testimonials"
          data-screen-label="Review"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "0 clamp(20px, 4vw, 40px)",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #D8D2C6",
              padding: "28px 0",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
              gap: "24px 48px",
              alignItems: "center",
            }}
          >
            <blockquote
              style={{
                margin: "0",
                gridColumn: "span 2",
                fontSize: "20px",
                lineHeight: "1.5",
                fontWeight: "400",
                textWrap: "pretty",
                maxWidth: "760px",
              }}
            >
              {
                "\u201cThe whole process was streamlined and efficient. They submitted a very detailed quote which was competitively priced, and went on to do the work very quickly to a high standard.\u201d\n      "
              }
              <footer
                style={{
                  marginTop: "10px",
                  fontSize: "15px",
                  color: "#4D5B4B",
                }}
              >
                {"Louise Thorogood \u00b7 "}
                <a
                  href="https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review"
                  style={{
                    color: "#4D5B4B",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {"Read the review on Houzz"}
                </a>
              </footer>
            </blockquote>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "15px",
                lineHeight: "1.45",
                color: "#202925",
              }}
            >
              <span style={{ fontWeight: "500" }}>
                {"Reviewed by London homeowners on"}
              </span>
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}
              >
                <a
                  href="https://g.page/r/CaGIVAg_unOVEBM/"
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {"Google"}
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
              <a
                href="https://www.houzz.co.uk/professionals/design-and-build/better-homes-pfvwgb-pf~60790866"
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "#4D5B4B",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                2× Best of Houzz winner
              </a>
            </div>
          </div>
        </section>

        <section
          id="work"
          data-screen-label="Selected work"
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
                {"Selected work"}
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
                {"Completed homes across North and East London"}
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
              {"View all projects"}
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
                        color: "#202925",
                      }}
                    >
                      {p.summary}
                    </p>
                  </div>
                </a>
              </React.Fragment>
            ))}
          </div>
        </section>

        <section
          id="services"
          data-screen-label="Services"
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
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                gap: "32px 48px",
                marginBottom: "48px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
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
                  {"Services"}
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
                  {"What would make your home work better?"}
                </h2>
              </div>
              <p
                style={{
                  margin: "0",
                  fontSize: "18px",
                  lineHeight: "1.6",
                  maxWidth: "560px",
                  alignSelf: "end",
                  textWrap: "pretty",
                }}
              >
                {
                  "Whether you need another bedroom, a kitchen everyone gravitates towards or a fresh start for the whole house, we can help you make more of the home you already love."
                }
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                gap: "24px",
              }}
            >
              <a
                href="/house-extension"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "32px 28px",
                  background: "#F4F1EA",
                  borderRadius: "6px",
                  color: "#202925",
                  border: "1px solid transparent",
                  transition: "border-color .25s ease",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#A65B43",
                    letterSpacing: "0.04em",
                  }}
                >
                  {"01"}
                </span>
                <h3
                  style={{
                    margin: "0",
                    fontSize: "24px",
                    fontWeight: "500",
                    lineHeight: "1.25",
                  }}
                >
                  {"Extensions"}
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
                    "Rear, side-return, wrap-around and double-storey extensions, including structural openings and the kitchen-living space that usually follows."
                  }
                </p>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#4D5B4B",
                  }}
                >
                  {"About extensions \u2192"}
                </span>
              </a>
              <a
                href="/loft-conversion"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "32px 28px",
                  background: "#F4F1EA",
                  borderRadius: "6px",
                  color: "#202925",
                  border: "1px solid transparent",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#A65B43",
                    letterSpacing: "0.04em",
                  }}
                >
                  {"02"}
                </span>
                <h3
                  style={{
                    margin: "0",
                    fontSize: "24px",
                    fontWeight: "500",
                    lineHeight: "1.25",
                  }}
                >
                  {"Loft conversions"}
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
                    "Rooflight, dormer and hip-to-gable conversions with the staircase, structure, insulation and bathroom resolved as one piece of work."
                  }
                </p>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#4D5B4B",
                  }}
                >
                  {"About loft conversions \u2192"}
                </span>
              </a>
              <a
                href="/general-renovation"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  padding: "32px 28px",
                  background: "#F4F1EA",
                  borderRadius: "6px",
                  color: "#202925",
                  border: "1px solid transparent",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#A65B43",
                    letterSpacing: "0.04em",
                  }}
                >
                  {"03"}
                </span>
                <h3
                  style={{
                    margin: "0",
                    fontSize: "24px",
                    fontWeight: "500",
                    lineHeight: "1.25",
                  }}
                >
                  {"Whole-home renovations"}
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
                    "Full refurbishment of a house or flat, often after purchase: layout changes, services, kitchens, bathrooms and finishes under one programme."
                  }
                </p>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#4D5B4B",
                  }}
                >
                  {"About whole-home renovations \u2192"}
                </span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="bh-wrap"
          style={{ paddingTop: 32, paddingBottom: 32 }}
        >
          <div className="bh-grid-two">
            <a className="bh-text-link" href="/kitchen-renovation">
              Standalone kitchen renovations →
            </a>
            <a className="bh-text-link" href="/bathroom-renovation">
              Standalone bathroom renovations →
            </a>
          </div>
        </section>
        <HomeLiving />
        <HomeHow />

        <section
          id="cost"
          data-screen-label="Cost planning"
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
              gap: "48px",
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
                {"Cost planning"}
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
                {"Find out what your plans could cost"}
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
                  "You do not need every detail decided to start thinking about cost. Our calculators give you an early building budget, so you can explore what might be possible before booking a conversation."
                }
              </p>
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
                  "Each calculator explains what its estimate includes. Your detailed quote will set out the work and costs for your home before you commit."
                }
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderTop: "1px solid #4D5B4B",
                alignSelf: "start",
              }}
            >
              <a
                href="/extension-calculator"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "22px 0",
                  borderBottom: "1px solid #4D5B4B",
                  color: "#F4F1EA",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {"Extension cost calculator "}
                <span aria-hidden="true">{"\u2192"}</span>
              </a>
              <a
                href="/renovation-calculator"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "22px 0",
                  borderBottom: "1px solid #4D5B4B",
                  color: "#F4F1EA",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {"Whole-home renovation calculator "}
                <span aria-hidden="true">{"\u2192"}</span>
              </a>
              <a
                href="/kitchen-calculator"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "22px 0",
                  borderBottom: "1px solid #4D5B4B",
                  color: "#F4F1EA",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {"Kitchen cost calculator "}
                <span aria-hidden="true">{"\u2192"}</span>
              </a>
              <a
                href="/tools/bathroom-cost-calculator"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "22px 0",
                  borderBottom: "1px solid #4D5B4B",
                  color: "#F4F1EA",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                {"Bathroom cost calculator "}
                <span aria-hidden="true">{"\u2192"}</span>
              </a>
              <a
                href="/tools"
                style={{
                  padding: "20px 0 0",
                  color: "#D8D2C6",
                  fontSize: "16px",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                {"All cost guides"}
              </a>
            </div>
          </div>
        </section>

        <section id="experience" className="bh-wrap bh-section">
          <HomeAftercare />

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
                {"Common questions"}
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
                {"Before you get in touch"}
              </h2>
              <a
                href="/faq"
                style={{
                  marginTop: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#4D5B4B",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                {"All questions"}
              </a>
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
          id="contact"
          data-screen-label="Enquiry"
          style={{ background: "#EDE9E0" }}
        >
          <div
            style={{
              maxWidth: "1240px",
              margin: "0 auto",
              padding: "clamp(56px, 8vw, 104px) clamp(20px, 4vw, 40px)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "48px 64px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                maxWidth: "520px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
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
                  {"Send us your brief"}
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
                  {"What would you love to come home to?"}
                </h2>
              </div>
              <p
                style={{
                  margin: "0",
                  fontSize: "18px",
                  lineHeight: "1.6",
                  textWrap: "pretty",
                }}
              >
                {
                  "Perhaps you have drawings ready. Perhaps you just know the kitchen feels cramped. Tell us where you are and what you would like to change. We will listen, talk through the possibilities and help you take the next step."
                }
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  paddingTop: "8px",
                  borderTop: "1px solid #D8D2C6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    paddingTop: "8px",
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
                    {"Where we work"}
                  </span>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "16px",
                      lineHeight: "1.55",
                    }}
                  >
                    {
                      "Central, North and East London, with selected projects in South London. Ask us about your postcode."
                    }
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
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
                    {"Prefer to talk"}
                  </span>
                  <a
                    href="tel:07922391591"
                    style={{
                      fontSize: "20px",
                      fontWeight: "500",
                      color: "#202925",
                    }}
                  >
                    {"07922 391 591"}
                  </a>
                  <a
                    href="https://cal.com/bhstudio/discovery"
                    style={{
                      fontSize: "16px",
                      color: "#4D5B4B",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {"Book a 20-minute call"}
                  </a>
                </div>
              </div>
            </div>
            {notSent ? (
              <>
                <div id="home-brief"><EnquiryForm /></div>
              </>
            ) : null}
          </div>
        </section>
        <FaqSchema
          items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
          path="/"
        />
        {this.props.relatedGuides}
      </main>
    );
  }
}
