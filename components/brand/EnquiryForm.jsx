"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EnquiryForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
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
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
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
      <label>
        First name
        <input name="firstName" autoComplete="given-name" required />
      </label>
      <label>
        Last name
        <input name="lastName" autoComplete="family-name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Phone
        <input name="phone" type="tel" autoComplete="tel" required />
      </label>
      <label>
        Property postcode
        <input
          name="postcode"
          autoComplete="postal-code"
          placeholder="e.g. N19"
          required
        />
      </label>
      <label>
        Project type
        <select name="service">
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
      <label>
        Project stage
        <select name="stage">
          {[
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
        Investment range
        <select name="budget">
          {[
            "Not sure yet",
            "Under £75,000",
            "£75,000 to £150,000",
            "£150,000 to £300,000",
            "Over £300,000",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label className="bh-full">
        A short brief
        <textarea
          name="brief"
          rows={4}
          placeholder="What would you like to change, and when would you like to start?"
          required
        />
      </label>
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
          {pending ? "Sending enquiry…" : "Send enquiry"}
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
