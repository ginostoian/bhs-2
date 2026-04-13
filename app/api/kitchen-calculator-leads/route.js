import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import { rateLimitMiddleware } from "@/libs/rateLimiter";
import { sendEmailWithRetry } from "@/libs/emailService";
import { notifyAdminCalculatorLead } from "@/libs/notificationService";
import { costEngine } from "@/app/kitchen-calculator/lib/costEngine";
import { generateKitchenEstimatePDF } from "@/app/kitchen-calculator/lib/pdfGenerator";

const CALCULATOR_SOURCE = "Kitchen Calculator";
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
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .slice(0, 120);
}

function deriveBudgetBand(value) {
  if (!value || value < 15000) return "£";
  if (value < 30000) return "££";
  if (value < 60000) return "£££";
  return "££££";
}

function buildEmailContent({ estimate, formData }) {
  const subject = "Your kitchen budget estimate (PDF) | Better Homes";
  const text = [
    "Thanks for using our kitchen calculator.",
    "",
    `Kitchen size: ${formData.kitchenSize || 0} m²`,
    `Layout: ${String(formData.layoutType || "").replace(/([A-Z])/g, " ").trim()}`,
    `Kitchen level: ${String(formData.kitchenRange || "").replace(/([A-Z])/g, " ").trim()}`,
    "",
    "Budget range (ballpark):",
    `- Low: ${costEngine.formatCurrency(estimate.ranges.low)}`,
    `- Expected: ${costEngine.formatCurrency(estimate.ranges.expected)}`,
    `- High: ${costEngine.formatCurrency(estimate.ranges.high)}`,
    "",
    "The PDF includes:",
    "- Installed-cost breakdown",
    "- Timeline and assumptions",
    "- Practical next steps before seeking final quotes",
    "",
    "This estimate is for budgeting and planning. Final costs depend on measured run length, product choice, services and structural details.",
    "",
    "Better Homes",
    "www.betterhomesstudio.com",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.5;max-width:640px">
      <h2 style="margin:0 0 12px;color:#0f172a;">Your Kitchen Budget Estimate</h2>
      <p style="margin:0 0 12px;">Thanks for using our kitchen calculator. We've attached your PDF estimate.</p>
      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#f8fafc;margin:16px 0;">
        <p style="margin:0 0 8px;"><strong>Kitchen size:</strong> ${formData.kitchenSize || 0} m²</p>
        <p style="margin:0 0 8px;"><strong>Layout:</strong> ${String(formData.layoutType || "")
          .replace(/([A-Z])/g, " ")
          .trim()}</p>
        <p style="margin:0 0 8px;"><strong>Kitchen level:</strong> ${String(formData.kitchenRange || "")
          .replace(/([A-Z])/g, " ")
          .trim()}</p>
        <ul style="margin:6px 0 0 18px;padding:0;">
          <li>Low: ${costEngine.formatCurrency(estimate.ranges.low)}</li>
          <li>Expected: ${costEngine.formatCurrency(estimate.ranges.expected)}</li>
          <li>High: ${costEngine.formatCurrency(estimate.ranges.high)}</li>
        </ul>
      </div>
      <p style="margin:0;color:#6b7280;font-size:12px;">This is a budgeting estimate, not a final quote. Final costs depend on measured site conditions, selected products, services and structural details.</p>
    </div>
  `;

  return { subject, text, html };
}

function buildAdminNotificationContent({ estimate, formData, leadName, email }) {
  const layout = String(formData.layoutType || "")
    .replace(/([A-Z])/g, " ")
    .trim();
  const range = String(formData.kitchenRange || "")
    .replace(/([A-Z])/g, " ")
    .trim();
  const subject = `New kitchen calculator lead: ${leadName || email}`;

  const text = [
    "New kitchen calculator submission.",
    "",
    `Name: ${leadName || "Not provided"}`,
    `Email: ${email}`,
    `Kitchen size: ${formData.kitchenSize || 0} m²`,
    `Layout: ${layout || "Not specified"}`,
    `Kitchen level: ${range || "Not specified"}`,
    `Low estimate: ${costEngine.formatCurrency(estimate.ranges.low)}`,
    `Expected estimate: ${costEngine.formatCurrency(estimate.ranges.expected)}`,
    `High estimate: ${costEngine.formatCurrency(estimate.ranges.high)}`,
    "",
    `Source: ${CALCULATOR_SOURCE}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.5;max-width:640px">
      <h2 style="margin:0 0 12px;color:#0f172a;">New Kitchen Calculator Lead</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${leadName || "Not provided"}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
      <p style="margin:0 0 8px;"><strong>Kitchen size:</strong> ${formData.kitchenSize || 0} m²</p>
      <p style="margin:0 0 8px;"><strong>Layout:</strong> ${layout || "Not specified"}</p>
      <p style="margin:0 0 8px;"><strong>Kitchen level:</strong> ${range || "Not specified"}</p>
      <p style="margin:0 0 8px;"><strong>Low estimate:</strong> ${costEngine.formatCurrency(estimate.ranges.low)}</p>
      <p style="margin:0 0 8px;"><strong>Expected estimate:</strong> ${costEngine.formatCurrency(estimate.ranges.expected)}</p>
      <p style="margin:0 0 8px;"><strong>High estimate:</strong> ${costEngine.formatCurrency(estimate.ranges.high)}</p>
      <p style="margin:16px 0 0;color:#6b7280;font-size:12px;">Source: ${CALCULATOR_SOURCE}</p>
    </div>
  `;

  return { subject, text, html };
}

async function generatePdfAttachment(estimate, formData, email) {
  const doc = generateKitchenEstimatePDF(estimate, formData, email);
  const arrayBuffer = doc.output("arraybuffer");
  const buffer = Buffer.from(arrayBuffer);
  return {
    filename: `kitchen-budget-estimate-${new Date().toISOString().split("T")[0]}.pdf`,
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

    const estimate = costEngine.calculateTotalCost(formData);
    const sanitizedInputs = estimate.inputs;

    await connectMongo();

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "unknown";
    const leadName = deriveLeadName(rawName, email);

    const submissionRecord = {
      calculatorType: "kitchen",
      calculatorVersion:
        (estimate.assumptions && estimate.assumptions.calculatorVersion) ||
        "unknown",
      capturedAt: new Date(),
      input: sanitizedInputs,
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
        projectTypes: ["Kitchen renovation"],
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
            title: "Kitchen calculator submission",
            description: `Submitted kitchen calculator estimate (${sanitizedInputs.kitchenSize} m², ${sanitizedInputs.kitchenRange}).`,
            status: "done",
            contactMade: false,
            date: new Date(),
            createdBy: null,
            metadata: {
              source: CALCULATOR_SOURCE,
              calculatorType: "kitchen",
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
      if (!lead.projectTypes.includes("Kitchen renovation")) {
        lead.projectTypes.push("Kitchen renovation");
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
        title: "Kitchen calculator submission updated",
        description: `Updated kitchen calculator estimate (${sanitizedInputs.kitchenSize} m², ${sanitizedInputs.kitchenRange}).`,
        status: "done",
        contactMade: false,
        date: new Date(),
        createdBy: null,
        metadata: {
          source: CALCULATOR_SOURCE,
          calculatorType: "kitchen",
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
      const emailContent = buildEmailContent({ estimate, formData: sanitizedInputs });
      const emailResult = await sendEmailWithRetry({
        to: email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
        attachments: [attachment],
        metadata: {
          type: "kitchen_calculator_pdf",
          source: CALCULATOR_SOURCE,
          calculatorType: "kitchen",
        },
      });

      emailSent = !!(emailResult && emailResult.success);
      emailError =
        emailResult && emailResult.success
          ? null
          : (emailResult && emailResult.error) || null;
    } catch (error) {
      emailError = error.message;
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
          type: "kitchen_calculator_admin_notification",
          source: CALCULATOR_SOURCE,
          calculatorType: "kitchen",
        },
      });

      adminEmailSent = !!(adminEmailResult && adminEmailResult.success);
      adminEmailError =
        adminEmailResult && adminEmailResult.success
          ? null
          : (adminEmailResult && adminEmailResult.error) || null;
    } catch (error) {
      adminEmailError = error.message;
      adminEmailSent = false;
    }

    try {
      await notifyAdminCalculatorLead({
        title: "New Kitchen Calculator Lead",
        message: `${leadName} requested a kitchen estimate${sanitizedInputs.kitchenSize ? ` for ${sanitizedInputs.kitchenSize} m²` : ""}.`,
        metadata: {
          calculatorType: "kitchen",
          source: CALCULATOR_SOURCE,
          leadId: lead._id.toString(),
          leadName,
          email,
          estimateExpected: estimate.ranges.expected,
          kitchenSize: sanitizedInputs.kitchenSize,
          kitchenRange: sanitizedInputs.kitchenRange,
          layoutType: sanitizedInputs.layoutType,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to create internal notification for kitchen calculator lead:",
        notificationError,
      );
    }

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

      if (
        Array.isArray(lead.calculatorData.submissions) &&
        lead.calculatorData.submissions.length > 0
      ) {
        lead.calculatorData.submissions[
          lead.calculatorData.submissions.length - 1
        ].emailDelivery = {
          sent: emailSent,
          attemptedAt: new Date(),
          error: emailError,
        };
        lead.calculatorData.submissions[
          lead.calculatorData.submissions.length - 1
        ].adminNotificationDelivery = {
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
    return NextResponse.json(
      { error: error.message || "Failed to capture lead" },
      { status: 500 },
    );
  }
}

export const POST = rateLimitMiddleware(handleLeadPost);
