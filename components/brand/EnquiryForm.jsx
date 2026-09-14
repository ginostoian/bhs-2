"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { currentAttribution } from "@/libs/marketingAttribution";
import {
  enquiryServices,
  enquiryStages,
  enquiryBudgets,
} from "@/libs/enquiryFields";
import { trackEnquiryEvent } from "@/libs/enquiryAnalytics";

export default function EnquiryForm({ defaultService = "Not sure yet" }) {
  const router = useRouter();
  const attempt = useRef(null);
  const submitting = useRef(false);
  const submissionPayload = useRef(null);
  function startAttempt() {
    if (!attempt.current) attempt.current = crypto.randomUUID();
    trackEnquiryEvent("enquiry_start", attempt.current);
    return attempt.current;
  }
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    const submissionEventId = startAttempt();
    const form = new FormData(event.currentTarget);
    const [firstName, ...remainingNames] = String(form.get("name") || "")
      .trim()
      .split(/\s+/);
    setPending(true);
    setError("");
    try {
      let referralCode = "";
      try {
        referralCode =
          new URLSearchParams(window.location.search).get("ref") ||
          localStorage.getItem("bhs_referral_code") ||
          "";
      } catch {}
      const payload = {
        submissionEventId,
        attribution: currentAttribution(),
        qualification: {
          service: form.get("service"),
          stage: form.get("stage"),
          budget: form.get("budget"),
        },
        firstName,
        lastName: remainingNames.join(" "),
        email: form.get("email"),
        phone: form.get("phone"),
        topic: "New Project",
        customTopic: "",
        website: form.get("website"),
        company: "",
        referralCode,
        message: `Postcode: ${form.get("postcode")}\nProject: ${form.get("service")}\nStage: ${form.get("stage")}\nInvestment: ${form.get("budget")}\n\n${form.get("brief")}`,
      };
      // An uncertain network result retries the exact same payload and ID.
      submissionPayload.current = submissionPayload.current || payload;
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...submissionPayload.current,
          attribution: currentAttribution()
            ? submissionPayload.current.attribution
            : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok && response.status >= 400 && response.status < 500) {
        submissionPayload.current = null;
      }
      if (
        !response.ok ||
        result.accepted !== true ||
        result.eventId !== submissionEventId
      )
        throw new Error(
          result.error || "We could not send your enquiry. Please try again.",
        );
      trackEnquiryEvent("enquiry_submit_success", result.eventId);
      router.push("/contact-form-submitted");
    } catch (err) {
      trackEnquiryEvent("enquiry_error", submissionEventId);
      setError(
        (err.message || "Please try again or call 07922 391591.") +
          (submissionPayload.current
            ? " Retrying sends the same brief to avoid duplicate enquiries."
            : ""),
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  return (
    <form className="bh-enquiry" onFocus={startAttempt} onSubmit={submit}>
      <p className="bh-full bh-small">
        Tell us a little about your plans. Only the fields marked (required) are
        needed to get started.
      </p>
      <label>
        Your name (required)
        <input
          name="name"
          autoComplete="name"
          required
          pattern={".*\\S.*"}
          maxLength={100}
        />
      </label>
      <label>
        Email (required)
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Phone (optional)
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label>
        Property postcode (required)
        <input
          name="postcode"
          autoComplete="postal-code"
          placeholder="e.g. N19"
          required
        />
      </label>
      <label>
        Project type (optional)
        <select name="service" defaultValue={defaultService}>
          {enquiryServices.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label className="bh-full">
        What would you like to change? (required)
        <textarea
          name="brief"
          rows={4}
          maxLength={1500}
          placeholder="What would you like to change, and when would you like to start?"
          required
        />
      </label>
      <details className="bh-full bh-enquiry-extra">
        <summary>Add your stage and budget (optional)</summary>
        <div className="bh-enquiry" style={{ marginTop: 20 }}>
          {" "}
          <label>
            Project stage (optional)
            <select name="stage">
              {enquiryStages.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Budget range (optional)
            <select name="budget">
              {enquiryBudgets.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
      </details>
      <div hidden aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="bh-full bh-small">
        We use these details to respond to your enquiry.{" "}
        <Link href="/privacy-policy">Read our privacy policy</Link>.
      </p>
      {error ? (
        <p role="alert" className="bh-full">
          {error}
        </p>
      ) : null}
      <div className="bh-full bh-actions">
        <button className="bh-button" disabled={pending}>
          {pending ? "Sending enquiry…" : "Send my brief"}
        </button>
        <span className="bh-small" role="status">
          {pending
            ? "Please wait while we send your details."
            : "We reply personally, usually within 24 hours during business days."}
        </span>
      </div>
    </form>
  );
}
