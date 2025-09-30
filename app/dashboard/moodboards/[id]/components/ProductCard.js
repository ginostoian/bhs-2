"use client";

/**
 * Product Card Component
 * Displays a product with image, details, approval buttons, and comment functionality
 */
export default function ProductCard({
  product,
  sectionId,
  moodboardId,
  onApprovalChange,
  onCommentClick,
}) {
  // Calculate total price
  const unitPrice = product.customPrice || product.product.price;
  const totalPrice = unitPrice * product.quantity;

  // Get approval status badge styling
  const getApprovalBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Handle approval button click
  const handleApprovalClick = (status) => {
    onApprovalChange(sectionId, product.id, status);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Product Image */}
      <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.product.imageUrl}
          alt={product.product.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' /%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Product Details */}
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          <a
            href={product.product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 hover:underline"
          >
            {product.product.name}
          </a>
        </h3>

        {product.product.description && (
          <p className="mb-2 line-clamp-2 text-sm text-gray-600">
            {product.product.description}
          </p>
        )}

        <div className="mb-2 text-sm text-gray-500">
          <p>Supplier: {product.product.supplier}</p>
          <p>Category: {product.product.category}</p>
        </div>

        {/* Price Information */}
        <div className="mb-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Unit Price (VAT inc.):</span>
            <span className="font-medium">£{unitPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">{product.quantity}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-gray-900">
            <span>Total:</span>
            <span>£{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Approval Status */}
        <div className="mb-3">{getApprovalBadge(product.approvalStatus)}</div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Approval Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleApprovalClick("approved")}
            disabled={product.approvalStatus === "approved"}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              product.approvalStatus === "approved"
                ? "cursor-not-allowed bg-green-100 text-green-600"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Approve
          </button>
          <button
            onClick={() => handleApprovalClick("declined")}
            disabled={product.approvalStatus === "declined"}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              product.approvalStatus === "declined"
                ? "cursor-not-allowed bg-red-100 text-red-600"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            Decline
          </button>
        </div>

        {/* Comment Button */}
        <button
          onClick={onCommentClick}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {product.userComment ? "Edit Comment" : "Add Comment"}
        </button>
      </div>

      {/* Comments Display */}
      {(product.userComment || product.adminComment) && (
        <div className="mt-4 space-y-2 rounded-md bg-gray-50 p-3">
          {product.userComment && (
            <div>
              <p className="text-xs font-medium text-gray-500">Your Comment:</p>
              <p className="text-sm text-gray-700">{product.userComment}</p>
            </div>
          )}
          {product.adminComment && (
            <div>
              <p className="text-xs font-medium text-gray-500">
                Admin Comment:
              </p>
              <p className="text-sm text-gray-700">{product.adminComment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
