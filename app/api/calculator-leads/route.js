import { NextResponse } from "next/server";
import { withPublicForm } from "@/libs/publicForm";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import { sendEmailWithRetry } from "@/libs/emailService";
import { notifyAdminCalculatorLead } from "@/libs/notificationService";
import { getCalculator, runEstimate, sanitizeAnswers, summarizeAnswers } from "@/libs/calculators/registry";
import { loadCalculatorConfig } from "@/libs/calculators/rates";
import { encodeAnswers, formatGBP } from "@/libs/calculators/common";
import { generateCalculatorPdf } from "@/libs/calculators/pdf";

const ADMIN_NOTIFICATION_EMAIL = "contact@celli.co.uk";
const MIN_SUBMIT_MS = 2500;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const PROJECT_TYPES = {
  extension: "Extension",
  loft: "Loft Conversion",
  renovation: "Home renovation",
  kitchen: "Kitchen renovation",
  bathroom: "Bathroom renovation",
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const escapeHtml = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const budgetBand = (v) => (v < 40000 ? "£" : v < 100000 ? "££" : v < 220000 ? "£££" : "££££");

function clientEmail({ calc, result, link }) {
  const range = `${formatGBP(result.low)} – ${formatGBP(result.high)}`;
  return {
    subject: `Your ${calc.short.toLowerCase()} estimate: ${formatGBP(result.expected)} | Better Homes`,
    text: [
      `Thanks for using our ${calc.name.toLowerCase()}.`,
      "",
      `Expected budget: ${formatGBP(result.expected)}`,
      `Likely range: ${range}`,
      "",
      "Your PDF breakdown is attached. You can reopen or share your estimate here:",
      link,
      "",
      "Want a fixed price? Book a free 20-minute call: https://cal.com/bhstudio/discovery",
      "",
      "Better Homes, London builders",
    ].join("\n"),
    html: `<div style="font-family:Arial,sans-serif;color:#202925;line-height:1.55;max-width:600px">
<h2 style="margin:0 0 8px">Your ${escapeHtml(calc.short.toLowerCase())} estimate</h2>
<p style="margin:0 0 16px">Thanks for using our ${escapeHtml(calc.name.toLowerCase())}. Your PDF breakdown is attached.</p>
<div style="background:#f4f1ea;border-radius:12px;padding:18px;margin:0 0 16px">
<div style="font-size:13px;color:#5f6a63">Expected budget</div>
<div style="font-size:30px;font-weight:bold">${formatGBP(result.expected)}</div>
<div style="color:#5f6a63">Likely range ${range}</div>
</div>
<p><a href="${link}" style="color:#4d5b4b">Reopen or share your estimate</a></p>
<p style="margin:20px 0"><a href="https://cal.com/bhstudio/discovery" style="background:#202925;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Book a free 20-minute call</a></p>
<p style="font-size:12px;color:#5f6a63">This is a budget estimate for planning, not a quotation.</p>
</div>`,
  };
}

async function handle(request) {
  try {
    const body = await request.json();
    const { calculator, answers: rawAnswers, email: rawEmail, name: rawName, consent, honeypot, startedAt } = body || {};
    if (honeypot && String(honeypot).trim()) return NextResponse.json({ success: true }, { status: 200 });
    const calc = getCalculator(calculator);
    if (!calc || !calc.rateType) return NextResponse.json({ error: "Unknown calculator." }, { status: 400 });
    if (!consent) return NextResponse.json({ error: "Please tick the box so we can email you." }, { status: 400 });
    const email = String(rawEmail || "").trim().toLowerCase();
    if (!isEmail(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    const elapsed = Date.now() - Number(startedAt);
    if (!Number.isFinite(elapsed) || elapsed < MIN_SUBMIT_MS) return NextResponse.json({ error: "That was quick. Please try again." }, { status: 429 });
    if (elapsed > MAX_FORM_AGE_MS) return NextResponse.json({ error: "This page has expired. Please refresh and try again." }, { status: 400 });

    // Recalculate on the server with the live price book; never trust client totals.
    const config = await loadCalculatorConfig(calc.rateType);
    const answers = sanitizeAnswers(calc, rawAnswers || {});
    const result = runEstimate(calc, answers, config);
    const summary = summarizeAnswers(calc, answers, config);
    const link = `https://bhstudio.co.uk${calc.path}?a=${encodeAnswers(answers)}`;
    const name = String(rawName || "").trim().slice(0, 120) || email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const priceBookDate = config?.priceBookDate ? new Date(`${config.priceBookDate}-01`).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : null;

    await connectMongo();
    const submission = {
      calculatorType: calc.id,
      calculatorVersion: config?.version || "unknown",
      capturedAt: new Date(),
      input: answers,
      answers: summary,
      estimate: { ranges: { low: result.low, expected: result.expected, high: result.high }, perM2: result.perM2, breakdown: result.breakdown },
      shareLink: link,
      meta: { consent: true, userAgent: request.headers.get("user-agent") || "unknown" },
    };
    let lead = await Lead.findOne({ email, source: "Other", customSource: calc.source });
    const activity = {
      type: "note",
      title: `${calc.short} calculator estimate`,
      description: `${calc.name}: ${formatGBP(result.expected)} (${formatGBP(result.low)} – ${formatGBP(result.high)}).`,
      status: "done",
      contactMade: false,
      date: new Date(),
      createdBy: null,
      metadata: { source: calc.source, calculatorType: calc.id, totalEstimate: result.expected },
    };
    if (!lead) {
      lead = new Lead({
        name,
        email,
        source: "Other",
        customSource: calc.source,
        projectTypes: [PROJECT_TYPES[calc.id]],
        stage: "Lead",
        value: result.expected,
        budget: budgetBand(result.expected),
        lastContactDate: new Date(),
        calculatorData: { latestSubmission: submission, submissions: [submission] },
        activities: [activity],
      });
    } else {
      lead.value = result.expected;
      lead.budget = budgetBand(result.expected);
      lead.lastContactDate = new Date();
      if (!lead.projectTypes?.includes(PROJECT_TYPES[calc.id])) lead.projectTypes = [...(lead.projectTypes || []), PROJECT_TYPES[calc.id]];
      const previous = Array.isArray(lead.calculatorData?.submissions) ? lead.calculatorData.submissions : [];
      lead.calculatorData = { latestSubmission: submission, submissions: [...previous, submission].slice(-25) };
      lead.activities = [...(lead.activities || []), activity].slice(-150);
    }

    let emailSent = false;
    try {
      const pdf = generateCalculatorPdf({ calc, result, summary, email, priceBookDate });
      const content = clientEmail({ calc, result, link });
      const sent = await sendEmailWithRetry({
        to: email,
        ...content,
        attachments: [{ filename: `better-homes-${calc.id}-estimate.pdf`, content: Buffer.from(pdf.output("arraybuffer")).toString("base64") }],
        metadata: { type: `${calc.id}_calculator_pdf`, source: calc.source, calculatorType: calc.id },
      });
      emailSent = Boolean(sent?.success);
    } catch (error) {
      console.error("Calculator PDF email failed:", error.message);
    }

    try {
      const lines = summary.map((a) => `${a.question}: ${a.answer}`).join("\n");
      await sendEmailWithRetry({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `New ${calc.short.toLowerCase()} calculator lead: ${name} (${formatGBP(result.expected)})`,
        text: `${name} <${email}>\n${calc.name}\nExpected ${formatGBP(result.expected)} (${formatGBP(result.low)} – ${formatGBP(result.high)})\n\n${lines}\n\nEstimate: ${link}`,
        html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;<br>${escapeHtml(calc.name)}<br>Expected <strong>${formatGBP(result.expected)}</strong> (${formatGBP(result.low)} – ${formatGBP(result.high)})</p><ul>${summary.map((a) => `<li>${escapeHtml(a.question)}: ${escapeHtml(a.answer)}</li>`).join("")}</ul><p><a href="${link}">Open the estimate</a></p>`,
        metadata: { type: `${calc.id}_calculator_admin_notification`, source: calc.source, calculatorType: calc.id },
      });
    } catch (error) {
      console.error("Calculator admin email failed:", error.message);
    }

    lead.calculatorData.latestSubmission.emailDelivery = { sent: emailSent, attemptedAt: new Date() };
    lead.markModified("calculatorData");
    await lead.save();

    try {
      await notifyAdminCalculatorLead({
        title: `New ${calc.short} Calculator Lead`,
        message: `${name} requested a ${calc.short.toLowerCase()} estimate of ${formatGBP(result.expected)}.`,
        metadata: { calculatorType: calc.id, source: calc.source, leadId: lead._id.toString(), leadName: name, email, estimateExpected: result.expected },
      });
    } catch (error) {
      console.error("Calculator lead notification failed:", error.message);
    }

    return NextResponse.json({ success: true, emailSent }, { status: 200 });
  } catch (error) {
    console.error("Calculator lead error:", error);
    return NextResponse.json({ error: "We couldn't send your estimate. Please try again." }, { status: 500 });
  }
}

export const POST = withPublicForm(handle, "calculator-leads");
