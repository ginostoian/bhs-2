import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import { rateLimitMiddleware } from "@/libs/rateLimiter";
import { sendEmailWithRetry } from "@/libs/emailService";
import { notifyAdminCalculatorLead } from "@/libs/notificationService";
import { costEngine } from "@/app/extension-calculator/lib/costEngine";
import { loadExtensionEngine } from "@/libs/extensionRates";
import { generateCostEstimatePDF } from "@/app/extension-calculator/lib/pdfGenerator";
import {
  PROPERTY_TYPES,
  EXTENSION_TYPES,
  REGIONS,
  LONDON_ZONES,
  COMPLEXITY_FACTORS,
  FINISH_LEVELS,
  SITE_ACCESS_OPTIONS,
  GLAZING_LEVELS,
  DRAWINGS_STATUS_OPTIONS,
  PLANNING_STATUS_OPTIONS,
  ADDITIONAL_FEATURE_OPTIONS,
  PLANNING_SERVICE_OPTIONS,
  VAT_TREATMENT_OPTIONS,
} from "@/app/extension-calculator/lib/config";

const CALCULATOR_SOURCE = "Extension Calculator";
const ADMIN_NOTIFICATION_EMAIL = "contact@celli.co.uk";
const MIN_SUBMIT_MS = 2500;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function deriveLeadName(inputName, email) {
  const clean = String(inputName || "").trim();
  if (clean) return clean.slice(0, 120);

  const localPart = String(email || "").split("@")[0] || "Lead";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .slice(0, 120);
}

const optionName = (options, id) =>
  options.find((option) => option.id === id)?.name || (id ? String(id) : "—");

// Builds a human-readable list of every answer the client gave, so the team can
// review exactly what was requested from /admin/extension-calculator-leads.
function buildAnswersSummary(inputs = {}) {
  const rows = [
    ["Property type", optionName(PROPERTY_TYPES, inputs.propertyType)],
    ["Extension type", optionName(EXTENSION_TYPES, inputs.extensionType)],
    ["Size", `${inputs.size || 0} m²`],
    ["Region", optionName(REGIONS, inputs.region)],
  ];

  if (inputs.region === "london") {
    rows.push(["London zone", optionName(LONDON_ZONES, inputs.londonZone)]);
  }

  rows.push(
    ["Postcode", inputs.postcode || "—"],
    ["Complexity", optionName(COMPLEXITY_FACTORS, inputs.complexity)],
    ["Finish level", optionName(FINISH_LEVELS, inputs.finishLevel)],
    ["Site access", optionName(SITE_ACCESS_OPTIONS, inputs.siteAccess)],
    ["Glazing level", optionName(GLAZING_LEVELS, inputs.glazingLevel)],
    ["Drawings status", optionName(DRAWINGS_STATUS_OPTIONS, inputs.drawingsStatus)],
    ["Planning status", optionName(PLANNING_STATUS_OPTIONS, inputs.planningStatus)],
    [
      "Fittings & finishes",
      inputs.includeFittings
        ? "Included (ballpark)"
        : "Excluded — structural build & materials only",
    ],
    ["VAT treatment", optionName(VAT_TREATMENT_OPTIONS, inputs.vatTreatment)],
  );

  const extras = Array.isArray(inputs.additionalFeatures)
    ? inputs.additionalFeatures
    : [];
  if (extras.length > 0) {
    const extrasText = extras
      .map((feature) => {
        const id = typeof feature === "string" ? feature : feature.id;
        const qty = typeof feature === "string" ? 1 : feature.quantity;
        const name = optionName(ADDITIONAL_FEATURE_OPTIONS, id);
        return qty > 1 ? `${name} x${qty}` : name;
      })
      .join(", ");
    rows.push(["Selected extras", extrasText]);
  } else {
    rows.push(["Selected extras", "None"]);
  }

  const services = Array.isArray(inputs.planningServices)
    ? inputs.planningServices
    : [];
  rows.push([
    "Planning/professional fees selected",
    services.length > 0
      ? services.map((id) => optionName(PLANNING_SERVICE_OPTIONS, id)).join(", ")
      : "None (auto allowance applied)",
  ]);

  return rows.map(([question, answer]) => ({ question, answer }));
}

function deriveBudgetBand(value) {
  if (!value || value < 30000) return "£";
  if (value < 90000) return "££";
  if (value < 200000) return "£££";
  return "££££";
}

function buildEmailContent({ estimate, formData }) {
  const subject = "Your extension budget estimate (PDF) | Better Homes";
  const extensionName =
    {
      singleStorey: "Single-storey extension",
      doubleStorey: "Double-storey extension",
      basement: "Basement extension",
      loft: "Loft conversion",
    }[formData.extensionType] || "Extension project";

  const text = [
    `Thanks for using our extension calculator.`,
    ``,
    `Project: ${extensionName}`,
    `Approx. size: ${formData.size || 0} m²`,
    ``,
    `Budget range (ballpark):`,
    `- Low: ${costEngine.formatCurrency(estimate.ranges.low)}`,
    `- Expected: ${costEngine.formatCurrency(estimate.ranges.expected)}`,
    `- High: ${costEngine.formatCurrency(estimate.ranges.high)}`,
    ``,
    `What the PDF includes:`,
    `- Transparent cost breakdown (build, extras, fees, contingency, VAT)`,
    `- Assumptions and caveats`,
    `- Practical next steps before requesting final quotes`,
    ``,
    `This estimate is for budgeting and planning. Final costs depend on site survey, drawings, structural details and specification.`,
    ``,
    `Better Homes`,
    `www.betterhomesstudio.com`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.5;max-width:640px">
      <h2 style="margin:0 0 12px;color:#0f172a;">Your Extension Budget Estimate</h2>
      <p style="margin:0 0 12px;">Thanks for using our extension calculator. We've attached your PDF estimate.</p>
      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#f8fafc;margin:16px 0;">
        <p style="margin:0 0 8px;"><strong>Project:</strong> ${extensionName}</p>
        <p style="margin:0 0 8px;"><strong>Approx. size:</strong> ${formData.size || 0} m²</p>
        <p style="margin:0 0 4px;"><strong>Ballpark budget range:</strong></p>
        <ul style="margin:6px 0 0 18px;padding:0;">
          <li>Low: ${costEngine.formatCurrency(estimate.ranges.low)}</li>
          <li>Expected: ${costEngine.formatCurrency(estimate.ranges.expected)}</li>
          <li>High: ${costEngine.formatCurrency(estimate.ranges.high)}</li>
        </ul>
      </div>
      <p style="margin:0 0 12px;">The PDF includes a line-item breakdown, assumptions, and next-step guidance so you can budget more confidently before requesting formal quotes.</p>
      <p style="margin:0;color:#6b7280;font-size:12px;">This is a budgeting estimate, not a final quote. Final costs depend on survey findings, drawings, engineering and specification.</p>
    </div>
  `;

  return { subject, text, html };
}

function buildAdminNotificationContent({ estimate, formData, leadName, email }) {
  const extensionName =
    {
      singleStorey: "Single-storey extension",
      doubleStorey: "Double-storey extension",
      basement: "Basement extension",
      loft: "Loft conversion",
    }[formData.extensionType] || "Extension project";
  const subject = `New extension calculator lead: ${leadName || email}`;

  const text = [
    "New extension calculator submission.",
    "",
    `Name: ${leadName || "Not provided"}`,
    `Email: ${email}`,
    `Project: ${extensionName}`,
    `Approx. size: ${formData.size || 0} m²`,
    `Low estimate: ${costEngine.formatCurrency(estimate.ranges.low)}`,
    `Expected estimate: ${costEngine.formatCurrency(estimate.ranges.expected)}`,
    `High estimate: ${costEngine.formatCurrency(estimate.ranges.high)}`,
    "",
    `Source: ${CALCULATOR_SOURCE}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.5;max-width:640px">
      <h2 style="margin:0 0 12px;color:#0f172a;">New Extension Calculator Lead</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${leadName || "Not provided"}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
      <p style="margin:0 0 8px;"><strong>Project:</strong> ${extensionName}</p>
      <p style="margin:0 0 8px;"><strong>Approx. size:</strong> ${formData.size || 0} m²</p>
      <p style="margin:0 0 8px;"><strong>Low estimate:</strong> ${costEngine.formatCurrency(estimate.ranges.low)}</p>
      <p style="margin:0 0 8px;"><strong>Expected estimate:</strong> ${costEngine.formatCurrency(estimate.ranges.expected)}</p>
      <p style="margin:0 0 8px;"><strong>High estimate:</strong> ${costEngine.formatCurrency(estimate.ranges.high)}</p>
      <p style="margin:16px 0 0;color:#6b7280;font-size:12px;">Source: ${CALCULATOR_SOURCE}</p>
    </div>
  `;

  return { subject, text, html };
}

async function generatePdfAttachment(estimate, formData, email) {
  const doc = generateCostEstimatePDF(estimate, formData, email);
  const arrayBuffer = doc.output("arraybuffer");
  const buffer = Buffer.from(arrayBuffer);
  return {
    filename: `extension-budget-estimate-${new Date()
      .toISOString()
      .split("T")[0]}.pdf`,
    content: buffer.toString("base64"),
  };
}

async function handleLeadPost(request) {
  try {
    const body = await request.json();
    const {
      email: rawEmail,
      name: rawName,
      formData = {},
      consent,
      honeypot,
      startedAt,
    } = body || {};

    // Bot protection: honeypot silently succeeds to avoid training bots
    if (honeypot && String(honeypot).trim()) {
      return NextResponse.json({ success: true, ignored: true }, { status: 200 });
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Consent is required to email your estimate." },
        { status: 400 },
      );
    }

    const email = normalizeEmail(rawEmail);
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    const now = Date.now();
    const startedAtMs = Number(startedAt);
    if (!Number.isFinite(startedAtMs)) {
      return NextResponse.json(
        { error: "Invalid submission metadata. Please try again." },
        { status: 400 },
      );
    }

    const elapsed = now - startedAtMs;
    if (elapsed < MIN_SUBMIT_MS) {
      return NextResponse.json(
        { error: "Submission was too fast. Please try again." },
        { status: 429 },
      );
    }
    if (elapsed > MAX_FORM_AGE_MS) {
      return NextResponse.json(
        { error: "Form expired. Please recalculate and try again." },
        { status: 400 },
      );
    }

    // Server-side recalculation to prevent tampering, using the effective price
    // book (defaults + admin overrides).
    const engine = await loadExtensionEngine();
    const estimate = engine.calculateTotalCost(formData);
    const sanitizedInputs = estimate.inputs;
    const answersSummary = buildAnswersSummary(sanitizedInputs);

    await connectMongo();

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    const leadName = deriveLeadName(rawName, email);

    const submissionRecord = {
      calculatorType: "extension",
      calculatorVersion:
        (estimate.assumptions && estimate.assumptions.calculatorVersion) ||
        "unknown",
      capturedAt: new Date(),
      input: sanitizedInputs,
      // Full human-readable list of every answer the client entered, for admin review.
      answers: answersSummary,
      estimate: {
        ranges: estimate.ranges,
        total: estimate.total,
        costPerSqm: estimate.costPerSqm,
        confidenceScore: estimate.confidenceScore,
        timeline: estimate.timeline,
        breakdown: estimate.breakdown,
      },
      meta: {
        consent: true,
        ipAddress,
        userAgent,
      },
    };

    let lead = await Lead.findOne({
      email,
      source: "Other",
      customSource: CALCULATOR_SOURCE,
    });

    if (!lead) {
      lead = new Lead({
        name: leadName,
        email,
        source: "Other",
        customSource: CALCULATOR_SOURCE,
        projectTypes: ["Extension"],
        stage: "Lead",
        value: estimate.ranges.expected,
        budget: deriveBudgetBand(estimate.ranges.expected),
        lastContactDate: new Date(),
        calculatorData: {
          latestSubmission: submissionRecord,
          submissions: [submissionRecord],
        },
        activities: [
          {
            type: "note",
            title: "Extension calculator submission",
            description: `Submitted extension calculator estimate (${sanitizedInputs.extensionType}, ${sanitizedInputs.size} m²).`,
            status: "done",
            contactMade: false,
            date: new Date(),
            createdBy: null,
            metadata: {
              source: CALCULATOR_SOURCE,
              calculatorType: "extension",
              totalEstimate: estimate.ranges.expected,
            },
          },
        ],
      });
    } else {
      lead.name = lead.name || leadName;
      lead.source = "Other";
      lead.customSource = CALCULATOR_SOURCE;
      lead.value = estimate.ranges.expected;
      lead.budget = deriveBudgetBand(estimate.ranges.expected);
      lead.lastContactDate = new Date();

      if (!Array.isArray(lead.projectTypes)) lead.projectTypes = [];
      if (!lead.projectTypes.includes("Extension")) {
        lead.projectTypes.push("Extension");
      }

      if (!lead.calculatorData) {
        lead.calculatorData = { latestSubmission: null, submissions: [] };
      }

      const existingSubmissions = Array.isArray(lead.calculatorData.submissions)
        ? lead.calculatorData.submissions
        : [];
      lead.calculatorData.latestSubmission = submissionRecord;
      lead.calculatorData.submissions = [...existingSubmissions, submissionRecord].slice(
        -25,
      );

      lead.activities = Array.isArray(lead.activities) ? lead.activities : [];
      lead.activities.push({
        type: "note",
        title: "Extension calculator submission updated",
        description: `Updated calculator estimate (${sanitizedInputs.extensionType}, ${sanitizedInputs.size} m²).`,
        status: "done",
        contactMade: false,
        date: new Date(),
        createdBy: null,
        metadata: {
          source: CALCULATOR_SOURCE,
          calculatorType: "extension",
          totalEstimate: estimate.ranges.expected,
        },
      });
      lead.activities = lead.activities.slice(-150);
    }

    let emailSent = false;
    let emailError = null;
    let adminEmailSent = false;
    let adminEmailError = null;

    try {
      const attachment = await generatePdfAttachment(estimate, sanitizedInputs, email);
      const emailContent = buildEmailContent({
        estimate,
        formData: sanitizedInputs,
      });

      const emailResult = await sendEmailWithRetry({
        to: email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
        attachments: [attachment],
        metadata: {
          type: "extension_calculator_pdf",
          source: CALCULATOR_SOURCE,
          calculatorType: "extension",
        },
      });

      emailSent = !!(emailResult && emailResult.success);
      emailError =
        emailResult && emailResult.success
          ? null
          : (emailResult && emailResult.error) || null;
    } catch (err) {
      console.error("Failed to email extension calculator PDF:", err);
      emailError = err.message;
      emailSent = false;
    }

    try {
      const adminEmail = buildAdminNotificationContent({
        estimate,
        formData: sanitizedInputs,
        leadName,
        email,
      });

      const adminEmailResult = await sendEmailWithRetry({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: adminEmail.subject,
        text: adminEmail.text,
        html: adminEmail.html,
        metadata: {
          type: "extension_calculator_admin_notification",
          source: CALCULATOR_SOURCE,
          calculatorType: "extension",
        },
      });

      adminEmailSent = !!(adminEmailResult && adminEmailResult.success);
      adminEmailError =
        adminEmailResult && adminEmailResult.success
          ? null
          : (adminEmailResult && adminEmailResult.error) || null;
    } catch (err) {
      console.error("Failed to email extension calculator admin notification:", err);
      adminEmailError = err.message;
      adminEmailSent = false;
    }

    try {
      await notifyAdminCalculatorLead({
        title: "New Extension Calculator Lead",
        message: `${leadName} requested an extension estimate${sanitizedInputs.size ? ` for ${sanitizedInputs.size} m²` : ""}.`,
        metadata: {
          calculatorType: "extension",
          source: CALCULATOR_SOURCE,
          leadId: lead._id.toString(),
          leadName,
          email,
          estimateExpected: estimate.ranges.expected,
          extensionType: sanitizedInputs.extensionType,
          size: sanitizedInputs.size,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to create internal notification for extension calculator lead:",
        notificationError,
      );
    }

    // Update latest submission delivery metadata after email attempt.
    if (lead && lead.calculatorData && lead.calculatorData.latestSubmission) {
      lead.calculatorData.latestSubmission.emailDelivery = {
        sent: emailSent,
        attemptedAt: new Date(),
        error: emailError,
      };
      lead.calculatorData.latestSubmission.adminNotificationDelivery = {
        sent: adminEmailSent,
        attemptedAt: new Date(),
        error: adminEmailError,
      };

      if (Array.isArray(lead.calculatorData.submissions) && lead.calculatorData.submissions.length > 0) {
        lead.calculatorData.submissions[lead.calculatorData.submissions.length - 1].emailDelivery = {
          sent: emailSent,
          attemptedAt: new Date(),
          error: emailError,
        };
        lead.calculatorData.submissions[lead.calculatorData.submissions.length - 1].adminNotificationDelivery = {
          sent: adminEmailSent,
          attemptedAt: new Date(),
          error: adminEmailError,
        };
      }
    }

    lead.markModified("calculatorData");
    await lead.save();

    return NextResponse.json(
      {
        success: true,
        message: "Lead captured successfully",
        emailSent,
        estimate,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error capturing extension calculator lead:", error);
    return NextResponse.json(
      { error: error.message || "Failed to capture lead" },
      { status: 500 },
    );
  }
}

export const POST = rateLimitMiddleware(handleLeadPost);
