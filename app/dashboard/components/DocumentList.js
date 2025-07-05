"use client";

/**
 * Document List Component
 * Displays a list of documents with appropriate formatting for each type
 */
export default function DocumentList({ documents, type }) {
  // Safety check for documents prop
  if (!documents || !Array.isArray(documents)) {
    return (
      <div className="py-8 text-center text-gray-500">
        No documents available.
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
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
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
            className="rounded-lg border border-gray-200 bg-white p-6 shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {type === "quote" && "Quote"}
                    {type === "invoice" && "Invoice"}
                    {type === "comment" && "Comment"}
                    {type === "photo" && "Photo"}
                  </h3>
                  {getStatusBadge(doc.status, doc.type)}
                </div>

                <div className="mb-3 text-gray-600">
                  {formatContent(doc.content, doc.type)}
                </div>

                <div className="text-sm text-gray-500">
                  Created: {formatDate(doc.createdAt)}
                </div>
              </div>

              {/* Show image for photos */}
              {doc.type === "photo" && typeof doc.content === "string" && (
                <div className="ml-4">
                  <img
                    src={doc.content}
                    alt="Document photo"
                    className="h-auto max-w-[500px] rounded border border-gray-200 object-cover"
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
                    className="flex hidden h-auto max-w-[500px] items-center justify-center rounded border border-gray-200 bg-gray-100 text-xs text-gray-400"
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
                <div className="mt-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        PDF Invoice
                      </h4>
                      <a
                        href={doc.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
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
                      className="h-[600px] w-full rounded border border-gray-200"
                      title="Invoice PDF"
                      onError={(e) => {
                        console.log("PDF failed to load:", doc.content);
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="flex hidden h-[600px] w-full items-center justify-center rounded border border-gray-200 bg-gray-100 text-sm text-gray-500"
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
                <div className="mt-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        PDF Quote
                      </h4>
                      <a
                        href={doc.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
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
                      className="h-[600px] w-full rounded border border-gray-200"
                      title="Quote PDF"
                      onError={(e) => {
                        console.log("PDF failed to load:", doc.content);
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="flex hidden h-[600px] w-full items-center justify-center rounded border border-gray-200 bg-gray-100 text-sm text-gray-500"
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
        );
      })}
    </div>
  );
}
