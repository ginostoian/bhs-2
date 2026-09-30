"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import QuoteEditor from "./QuoteEditor";
import { blankQuote, fromServer } from "./quoteModel";

/** Loads a quote (or starts a blank one) and mounts the editor. */
export default function QuoteEditorPage({ quoteId }) {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Built on the client only: random row keys would differ between the
    // server render and hydration otherwise
    if (!quoteId) {
      setQuote(blankQuote());
      return;
    }
    let cancelled = false;
    fetch(`/api/admin/quoting/${quoteId}`)
      .then(async (response) => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.success) {
          throw new Error(
            response.status === 404
              ? "This quote doesn't exist."
              : result.error,
          );
        }
        if (!cancelled) setQuote(fromServer(result.quote));
      })
      .catch(
        (e) => !cancelled && setError(e.message || "Couldn't load the quote."),
      );
    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  if (error) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-lg font-semibold">{error}</p>
        <Link
          href="/admin/quoting/history"
          className="mt-4 inline-block text-sm font-medium text-[#4D5B4B] underline"
        >
          Back to quotes
        </Link>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-[#7A807B]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading quote…
      </div>
    );
  }

  return <QuoteEditor key={quote._id || "new"} initialQuote={quote} />;
}
