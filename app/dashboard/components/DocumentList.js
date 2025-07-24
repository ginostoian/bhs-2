"use client";

/**
 * Document List Component
 * Displays a list of documents with appropriate formatting for each type
 */
export default function DocumentList({ documents, type }) {
  // Safety check for documents prop
  if (!documents || !Array.isArray(documents)) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500">No documents available.</p>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Check if content is a PDF URL
  const isPdfUrl = (content) => {
    return (
      typeof content === "string" &&
      content.startsWith("http") &&
      content.toLowerCase().includes(".pdf")
    );
  };

  // Format content based on document type
  const formatContent = (content, docType) => {
    if (typeof content === "string") {
      if (docType === "photo") {
        // Don't display URL for photos, just return empty or a simple label
        return "Project photo";
      }
      if (docType === "invoice" && isPdfUrl(content)) {
        // Don't display PDF URL, just return a label
        return "PDF Invoice";
      }
      if (docType === "quote" && isPdfUrl(content)) {
        // Don't display PDF URL, just return a label
        return "PDF Quote";
      }
      return content;
    }

    if (docType === "quote" && typeof content === "object") {
      return `£${content.amount || "TBD"} - ${content.description || "Quote"}`;
    }

    if (docType === "invoice" && typeof content === "object") {
      return `£${content.amount || "TBD"} - ${content.description || "Invoice"}`;
    }

    return JSON.stringify(content);
  };

  // Get status badge styling
  const getStatusBadge = (status, docType) => {
    if (!status || docType === "photo") return null; // Don't show status for photos

    const styles = {
      pending: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
      paid: "bg-green-100 text-green-800 ring-1 ring-green-200",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
      >
        {status === "paid" && (
          <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {documents.map((doc) => {
        // Debug logging for photos
        if (doc.type === "photo") {
          console.log("Photo document:", {
            id: doc.id,
            content: doc.content,
            contentType: typeof doc.content,
            contentLength:
              typeof doc.content === "string" ? doc.content.length : "N/A",
          });
        }

        return (
          <div
            key={doc.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {type === "quote" && "Quote"}
                        {type === "invoice" && "Invoice"}
                        {type === "comment" && "Comment"}
                        {type === "photo" && "Photo"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created {formatDate(doc.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(doc.status, doc.type)}
                  </div>

                  <div className="mb-4 text-gray-700">
                    {formatContent(doc.content, doc.type)}
                  </div>
                </div>

                {/* Show image for photos */}
                {doc.type === "photo" && typeof doc.content === "string" && (
                  <div className="ml-6">
                    <img
                      src={doc.content}
                      alt="Document photo"
                      className="h-auto max-w-[400px] rounded-lg border border-gray-200 object-cover shadow-sm"
                      onError={(e) => {
                        console.log("Image failed to load:", doc.content);
                        console.log("Error details:", e);
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                      onLoad={(e) => {
                        console.log("Image loaded successfully:", doc.content);
                        console.log("Image element:", e.target);
                      }}
                    />
                    <div
                      className="flex hidden h-auto max-w-[400px] items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-xs text-gray-400 shadow-sm"
                      style={{ display: "none" }}
                    >
                      <span>Image unavailable</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Show embedded PDF for invoices */}
              {doc.type === "invoice" &&
                typeof doc.content === "string" &&
                isPdfUrl(doc.content) && (
                  <div className="mt-6">
                    <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">
                          PDF Invoice
                        </h4>
                        <a
                          href={doc.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                        >
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Download PDF
                        </a>
                      </div>
                      <iframe
                        src={doc.content}
                        className="h-[600px] w-full rounded-lg border border-gray-200 bg-white"
                        title="Invoice PDF"
                        onError={(e) => {
                          console.log("PDF failed to load:", doc.content);
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="flex hidden h-[600px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-sm text-gray-500"
                        style={{ display: "none" }}
                      >
                        <div className="text-center">
                          <svg
                            className="mx-auto mb-2 h-8 w-8 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p>PDF unavailable</p>
                          <a
                            href={doc.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-blue-600 hover:text-blue-800"
                          >
                            Open in new tab
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Show embedded PDF for quotes */}
              {doc.type === "quote" &&
                typeof doc.content === "string" &&
                isPdfUrl(doc.content) && (
                  <div className="mt-6">
                    <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">
                          PDF Quote
                        </h4>
                        <a
                          href={doc.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                        >
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Download PDF
                        </a>
                      </div>
                      <iframe
                        src={doc.content}
                        className="h-[600px] w-full rounded-lg border border-gray-200 bg-white"
                        title="Quote PDF"
                        onError={(e) => {
                          console.log("PDF failed to load:", doc.content);
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="flex hidden h-[600px] w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-sm text-gray-500"
                        style={{ display: "none" }}
                      >
                        <div className="text-center">
                          <svg
                            className="mx-auto mb-2 h-8 w-8 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p>PDF unavailable</p>
                          <a
                            href={doc.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-blue-600 hover:text-blue-800"
                          >
                            Open in new tab
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
