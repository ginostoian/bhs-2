"use client";

/**
 * Document List Component
 * Displays a list of documents with appropriate formatting for each type
 */
export default function DocumentList({ documents, type }) {
  // Convert Google Drive sharing URL to direct image URL
  const convertGoogleDriveUrl = (url) => {
    console.log("Converting URL:", url);

    if (url.includes("drive.google.com/file/d/")) {
      // Extract file ID from Google Drive sharing URL
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      console.log("Extracted file ID:", fileId);

      if (fileId) {
        const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        console.log("Converted to direct URL:", directUrl);
        return directUrl;
      }
    }

    console.log("No conversion needed, returning original URL:", url);
    return url;
  };

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
      if (docType === "photo") {
        // Don't display URL for photos, just return empty or a simple label
        return "Project photo";
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

              {doc.type === "photo" && typeof doc.content === "string" && (
                <div className="ml-4">
                  {doc.content.includes("drive.google.com/file/d/") ? (
                    // Use iframe for Google Drive images to avoid CORS issues
                    <div className="h-[500px] w-[500px] overflow-hidden rounded border border-gray-200">
                      <iframe
                        src={doc.content}
                        title="Document photo"
                        className="h-full w-full"
                        frameBorder="0"
                        onError={(e) => {
                          console.log("Iframe failed to load:", doc.content);
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="flex hidden h-[500px] w-[500px] items-center justify-center rounded border border-gray-200 bg-gray-100 text-xs text-gray-400"
                        style={{ display: "none" }}
                      >
                        <span>Image unavailable</span>
                      </div>
                    </div>
                  ) : (
                    // Use regular img tag for other URLs
                    <>
                      <img
                        src={convertGoogleDriveUrl(doc.content)}
                        alt="Document photo"
                        className="h-auto max-w-[500px] rounded border border-gray-200 object-cover"
                        onError={(e) => {
                          console.log("Image failed to load:", doc.content);
                          console.log(
                            "Converted URL:",
                            convertGoogleDriveUrl(doc.content),
                          );
                          console.log("Error details:", e);
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                        onLoad={(e) => {
                          console.log(
                            "Image loaded successfully:",
                            doc.content,
                          );
                          console.log("Image element:", e.target);
                        }}
                      />
                      <div
                        className="flex hidden h-auto max-w-[500px] items-center justify-center rounded border border-gray-200 bg-gray-100 text-xs text-gray-400"
                        style={{ display: "none" }}
                      >
                        <span>Image unavailable</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
