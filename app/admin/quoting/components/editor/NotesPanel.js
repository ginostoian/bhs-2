"use client";

import { Lock } from "lucide-react";
import { businessFacts } from "@/libs/businessFacts";
import { DEFAULT_LEAD_TIME, DEFAULT_PAYMENT_TERMS } from "@/libs/quoteTerms";
import { Card, Field, TextArea } from "./ui";

const ResetLink = ({ onClick, show }) =>
  show ? (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-medium text-[#4D5B4B] underline underline-offset-2"
    >
      Reset to standard
    </button>
  ) : null;

export default function NotesPanel({ quote, set }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card title="Notes & terms for the client">
        <div className="space-y-4">
          <Field
            label="Notes to the client"
            hint="Appears on the quote under “Notes” — exclusions, assumptions, next steps."
          >
            <TextArea
              rows={4}
              value={quote.specialInstructions || ""}
              onChange={(e) => set(["specialInstructions"], e.target.value)}
              placeholder="e.g. Price assumes the existing joists are sound…"
            />
          </Field>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-[#4A524D]">
                Payment terms
              </span>
              <ResetLink
                show={quote.termsAndConditions !== DEFAULT_PAYMENT_TERMS}
                onClick={() =>
                  set(["termsAndConditions"], DEFAULT_PAYMENT_TERMS)
                }
              />
            </div>
            <TextArea
              rows={3}
              value={quote.termsAndConditions}
              onChange={(e) => set(["termsAndConditions"], e.target.value)}
              aria-label="Payment terms"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-[#4A524D]">
                  Lead time
                </span>
                <ResetLink
                  show={quote.leadTime !== DEFAULT_LEAD_TIME}
                  onClick={() => set(["leadTime"], DEFAULT_LEAD_TIME)}
                />
              </div>
              <TextArea
                rows={3}
                value={quote.leadTime}
                onChange={(e) => set(["leadTime"], e.target.value)}
                aria-label="Lead time"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-[#4A524D]">
                  Warranty
                </span>
                <ResetLink
                  show={quote.warrantyInformation !== businessFacts.workmanship}
                  onClick={() =>
                    set(["warrantyInformation"], businessFacts.workmanship)
                  }
                />
              </div>
              <TextArea
                rows={3}
                value={quote.warrantyInformation}
                onChange={(e) => set(["warrantyInformation"], e.target.value)}
                aria-label="Warranty"
              />
            </div>
          </div>
          <p className="text-xs text-[#7A807B]">
            The full standard terms & conditions are always appended to the
            quote.
          </p>
        </div>
      </Card>

      <Card
        title="Internal notes"
        action={
          <span className="flex items-center gap-1 text-xs text-[#A65B43]">
            <Lock className="h-3.5 w-3.5" /> Never shown to the client
          </span>
        }
      >
        <TextArea
          rows={12}
          value={quote.internalNotes || ""}
          onChange={(e) => set(["internalNotes"], e.target.value)}
          placeholder="Site visit findings, supplier quotes, pricing assumptions, follow-ups…"
          aria-label="Internal notes"
          className="bg-[#FFFCF5]"
        />
      </Card>
    </div>
  );
}
