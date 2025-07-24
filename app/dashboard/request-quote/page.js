import RequestQuoteForm from "./components/RequestQuoteForm";

/**
 * Request Quote Page
 * Allows users to request new renovation quotes
 */
export default function RequestQuotePage() {
  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Request a Quote
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Tell us about your renovation project and we&apos;ll provide you
              with a detailed quote.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-teal-600">New Quote</p>
                  <p className="text-2xl font-bold text-teal-900">Request</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <RequestQuoteForm />
      </div>
    </div>
  );
}
