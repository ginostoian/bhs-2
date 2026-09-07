"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EnquiryForm({ defaultService = "Not sure yet" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "We could not send your enquiry. Please try again.",
        );
      router.push("/contact-form-submitted");
    } catch (err) {
      setError(err.message || "Please try again or call 07922 391591.");
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="bh-enquiry" onSubmit={submit}>
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
          {[
            "Extension",
            "Loft conversion",
            "Whole-home renovation",
            "Kitchen renovation",
            "Bathroom renovation",
            "Basement conversion",
            "Not sure yet",
          ].map((x) => (
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
              {[
                "Not sure yet",
                "Early idea",
                "Buying or just bought",
                "Drawings in progress",
                "Drawings and approvals in place",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Budget range (optional)
            <select name="budget">
              {[
                "Not sure yet",
                "Under £25,000",
                "£25,000 to £75,000",
                "£75,000 to £150,000",
                "£150,000 to £300,000",
                "Over £300,000",
              ].map((x) => (
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
