/**
 * Document List Component
 * Displays a list of documents with appropriate formatting for each type
 */
export default function DocumentList({ documents, type }) {
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format content based on document type
  const formatContent = (content, docType) => {
    if (typeof content === "string") {
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
  const getStatusBadge = (status) => {
    if (!status) return null;

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
      {documents.map((doc) => (
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
                {getStatusBadge(doc.status)}
              </div>

              <div className="mb-3 text-gray-600">
                {formatContent(doc.content, doc.type)}
              </div>

              <div className="text-sm text-gray-500">
                Created: {formatDate(doc.createdAt)}
              </div>
            </div>

            {doc.type === "photo" && typeof doc.content === "string" && (
              <div className="ml-4">
                <img
                  src={doc.content}
                  alt="Document photo"
                  className="h-16 w-16 rounded object-cover"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
