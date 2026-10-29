import { jsPDF } from "jspdf";
import { formatGBP } from "./common.js";

const INK = [32, 41, 37];
const OLIVE = [77, 91, 75];
const MUTED = [95, 106, 99];
const LINE = [227, 221, 209];

// One branded PDF layout for every calculator: headline range, breakdown, inclusions,
// notes and the answers the client gave.
export function generateCalculatorPdf({ calc, result, summary, email, priceBookDate }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const M = 18;
  let y = 0;

  const ensure = (h) => {
    if (y + h > 280) {
      doc.addPage();
      y = 20;
    }
  };
  const text = (str, x, size = 10, color = INK, style = "normal", opts = {}) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(str, x, y, opts);
  };
  const wrapped = (str, size = 10, color = INK, width = W - 2 * M) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(str, width);
    ensure(lines.length * size * 0.45 + 2);
    doc.setTextColor(...color);
    doc.text(lines, M, y);
    y += lines.length * size * 0.45 + 2;
  };
  const heading = (str) => {
    ensure(14);
    y += 6;
    text(str, M, 13, INK, "bold");
    y += 6;
  };

  // Header band
  doc.setFillColor(...INK);
  doc.rect(0, 0, W, 46, "F");
  y = 16;
  text("Better Homes", M, 11, [255, 255, 255], "bold");
  text("bhstudio.co.uk", W - M, 11, [216, 210, 198], "normal", { align: "right" });
  y = 30;
  text(calc.name.replace(/^./, (c) => c.toUpperCase()), M, 18, [255, 255, 255], "bold");
  y = 39;
  text(`Prepared ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}${email ? ` for ${email}` : ""}`, M, 9, [216, 210, 198]);

  // Headline
  y = 62;
  text("Expected budget", M, 10, MUTED);
  y += 11;
  text(formatGBP(result.expected), M, 28, INK, "bold");
  y += 8;
  text(`Likely range ${formatGBP(result.low)} – ${formatGBP(result.high)}`, M, 11, MUTED);
  const facts = [
    result.perM2 ? ["Per m²", formatGBP(result.perM2)] : null,
    result.timeline ? ["Build time", result.timeline] : result.weeks ? ["Build time", `${result.weeks[0]}–${result.weeks[1]} weeks`] : result.days ? ["Build time", `${result.days[0]}–${result.days[1]} working days`] : null,
    result.area ? ["Floor area", `${result.area} m²`] : null,
    priceBookDate ? ["Price book", priceBookDate] : null,
  ].filter(Boolean);
  y += 10;
  const colW = (W - 2 * M) / Math.max(1, facts.length);
  facts.forEach(([k, v], i) => {
    const x = M + i * colW;
    doc.setFillColor(244, 241, 234);
    doc.roundedRect(x, y, colW - 4, 18, 2, 2, "F");
    const yy = y;
    y = yy + 7;
    text(k, x + 4, 8.5, MUTED);
    y = yy + 13.5;
    text(v, x + 4, 11, INK, "bold");
    y = yy;
  });
  y += 26;

  heading("Where the money goes");
  const max = Math.max(...result.breakdown.map((b) => b.amount));
  for (const b of result.breakdown) {
    ensure(10);
    text(b.label, M, 10);
    text(formatGBP(b.amount), W - M, 10, INK, "bold", { align: "right" });
    y += 2.5;
    doc.setFillColor(...LINE);
    doc.rect(M, y, W - 2 * M, 1.6, "F");
    doc.setFillColor(...OLIVE);
    doc.rect(M, y, Math.max(1, ((W - 2 * M) * b.amount) / max), 1.6, "F");
    y += 7;
  }
  ensure(10);
  doc.setDrawColor(...INK);
  doc.line(M, y - 2, W - M, y - 2);
  y += 4;
  text("Expected total", M, 11, INK, "bold");
  text(formatGBP(result.expected), W - M, 11, INK, "bold", { align: "right" });
  y += 4;

  heading("Included");
  result.included.forEach((x) => wrapped(`•  ${x}`));
  heading("Not included");
  result.excluded.forEach((x) => wrapped(`•  ${x}`));
  heading("Worth knowing");
  result.notes.forEach((x) => wrapped(x, 10, MUTED));

  heading("Questions to ask builders");
  [
    "Is VAT included, and is the price fixed or an estimate?",
    "Which professional and council fees are in the price?",
    "What contingency do you recommend, and how are changes priced?",
    "Who manages the site day to day, and how often will I get updates?",
    "What workmanship guarantee and insurance do you provide?",
  ].forEach((x) => wrapped(`•  ${x}`));

  heading("Your answers");
  summary.forEach((a) => wrapped(`${a.question}: ${a.answer}`, 9.5, MUTED));

  ensure(30);
  y += 8;
  doc.setFillColor(...OLIVE);
  doc.roundedRect(M, y, W - 2 * M, 24, 3, 3, "F");
  y += 9;
  text("Want a fixed price for your home?", M + 6, 12, [255, 255, 255], "bold");
  y += 7;
  text("Book a free 20-minute call: cal.com/bhstudio/discovery  ·  bhstudio.co.uk/contact", M + 6, 9.5, [244, 241, 234]);
  y += 16;
  wrapped(
    "This is a budget estimate for planning, not a quotation. Final prices depend on a survey, drawings, structural design and the products you choose.",
    8.5,
    MUTED,
  );
  return doc;
}
