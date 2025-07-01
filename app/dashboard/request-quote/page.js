import RequestQuoteForm from "./components/RequestQuoteForm";

/**
 * Request Quote Page
 * Allows users to request new renovation quotes
 */
export default function RequestQuotePage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Request a Quote
        </h2>
        <p className="text-gray-600">
          Tell us about your renovation project and we&apos;ll provide you with
          a detailed quote.
        </p>
      </div>

      <RequestQuoteForm />
    </div>
  );
}
