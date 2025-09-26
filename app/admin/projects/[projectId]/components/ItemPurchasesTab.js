"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-hot-toast";
// Using inline SVG icons instead of Heroicons
import StoreDropdown from "@/components/StoreDropdown";

/**
 * ItemPurchasesTab Component
 * Displays and manages project item purchases with drag-and-drop functionality
 */
export default function ItemPurchasesTab({
  projectId,
  projectName,
  userName,
  userAddress,
  itemPurchases: initialItemPurchases = [],
}) {
  const [itemPurchases, setItemPurchases] = useState(initialItemPurchases);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState({ isOpen: false });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    itemPurchase: null,
  });
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    itemPurchase: null,
  });

  // Calculate totals
  const totals = {
    totalQuotedPrice: itemPurchases.reduce(
      (sum, item) => sum + item.quotedPrice,
      0,
    ),
    totalPaidPrice: itemPurchases.reduce(
      (sum, item) => sum + item.paidPrice,
      0,
    ),
    totalTradeDiscount: itemPurchases.reduce(
      (sum, item) => sum + item.tradeDiscount,
      0,
    ),
  };

  // Load stores on component mount
  useEffect(() => {
    const loadStores = async () => {
      try {
        const response = await fetch("/api/stores", {
          credentials: "include",
        });
        if (response.ok) {
          const { stores } = await response.json();
          setStores(stores);
        }
      } catch (error) {
        console.error("Error loading stores:", error);
      }
    };

    loadStores();
  }, []);

  // Handle drag and drop reordering
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(itemPurchases);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setItemPurchases(items);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/item-purchases`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ itemPurchases: items }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reorder item purchases");
      }

      toast.success("Item purchases reordered successfully");
    } catch (error) {
      console.error("Error reordering item purchases:", error);
      toast.error("Failed to reorder item purchases");
      // Reload to restore original order
      window.location.reload();
    }
  };

  // Handle creating new item purchase
  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/item-purchases`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create item purchase");
      }

      const { itemPurchase } = await response.json();
      setItemPurchases([...itemPurchases, itemPurchase]);
      setCreateModal({ isOpen: false });
      toast.success("Item purchase created successfully");
    } catch (error) {
      console.error("Error creating item purchase:", error);
      toast.error(error.message || "Failed to create item purchase");
    } finally {
      setLoading(false);
    }
  };

  // Handle updating item purchase
  const handleUpdate = async (itemId, formData) => {
    if (!itemId) {
      toast.error("Invalid item ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/item-purchases/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update item purchase");
      }

      const { itemPurchase } = await response.json();
      setItemPurchases(
        itemPurchases.map((item) =>
          item._id === itemId ? itemPurchase : item,
        ),
      );
      setEditModal({ isOpen: false, itemPurchase: null });
      toast.success("Item purchase updated successfully");
    } catch (error) {
      console.error("Error updating item purchase:", error);
      toast.error(error.message || "Failed to update item purchase");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting item purchase
  const handleDelete = async (itemId) => {
    if (!itemId) {
      toast.error("Invalid item ID");
      return;
    }

    if (!confirm("Are you sure you want to delete this item purchase?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/item-purchases/${itemId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete item purchase");
      }

      setItemPurchases(itemPurchases.filter((item) => item._id !== itemId));
      toast.success("Item purchase deleted successfully");
    } catch (error) {
      console.error("Error deleting item purchase:", error);
      toast.error(error.message || "Failed to delete item purchase");
    } finally {
      setLoading(false);
    }
  };

  // Handle store added callback
  const handleStoreAdded = (newStore) => {
    setStores([...stores, newStore]);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Item Purchases
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Track project item purchases and trade discounts
          </p>
        </div>
        <button
          onClick={() => setCreateModal({ isOpen: true })}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            className="mr-2 h-4 w-4"
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
          Add Item Purchase
        </button>
      </div>

      {/* Item Purchases Table */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Purchase List</h3>
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop to reorder item purchases
          </p>
        </div>

        {itemPurchases.length > 0 ? (
          <div className="overflow-x-auto">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="item-purchases">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-w-[1000px] divide-y divide-gray-200"
                  >
                    {/* Table Header */}
                    <div className="grid grid-cols-8 gap-4 bg-gray-50 px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                      <div className="col-span-1">Item</div>
                      <div className="col-span-1">Store</div>
                      <div className="col-span-1 text-right">Quoted Price</div>
                      <div className="col-span-1 text-right">Paid Price</div>
                      <div className="col-span-1 text-right">
                        Trade Discount
                      </div>
                      <div className="col-span-1">Purchase Date</div>
                      <div className="col-span-1">Delivery Date</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Table Rows */}
                    {itemPurchases.map((item, index) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`grid grid-cols-8 gap-4 px-6 py-4 text-sm ${
                              snapshot.isDragging
                                ? "bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="col-span-1 flex items-center">
                              <div
                                {...provided.dragHandleProps}
                                className="mr-2 cursor-grab text-gray-400 hover:text-gray-600"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zm-6 4h2v2H8v-2zm6 0h2v2h-2v-2zm-6 4h2v2H8v-2zm6 0h2v2h-2v-2z" />
                                </svg>
                              </div>
                              <span className="font-medium text-gray-900">
                                {item.itemName}
                              </span>
                            </div>
                            <div className="col-span-1">
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                {item.store}
                              </span>
                            </div>
                            <div className="col-span-1 text-right font-medium text-gray-900">
                              {formatCurrency(item.quotedPrice)}
                            </div>
                            <div className="col-span-1 text-right font-medium text-gray-900">
                              {formatCurrency(item.paidPrice)}
                            </div>
                            <div className="col-span-1 text-right font-medium text-green-600">
                              {formatCurrency(item.tradeDiscount)}
                            </div>
                            <div className="col-span-1 text-gray-500">
                              {formatDate(item.purchaseDate)}
                            </div>
                            <div className="col-span-1 text-gray-500">
                              {item.deliveryDate
                                ? formatDate(item.deliveryDate)
                                : "-"}
                            </div>
                            <div className="col-span-1 flex justify-end space-x-2">
                              <button
                                onClick={() =>
                                  setDetailModal({
                                    isOpen: true,
                                    itemPurchase: item,
                                  })
                                }
                                className="text-gray-400 hover:text-gray-600"
                                title="View details"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  setEditModal({
                                    isOpen: true,
                                    itemPurchase: item,
                                  })
                                }
                                className="text-gray-400 hover:text-blue-600"
                                title="Edit"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="text-gray-400 hover:text-red-600"
                                title="Delete"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Totals Row */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="grid grid-cols-8 gap-4 text-sm font-semibold">
                <div className="col-span-3 text-gray-900">TOTALS</div>
                <div className="col-span-1 text-right text-gray-900">
                  {formatCurrency(totals.totalQuotedPrice)}
                </div>
                <div className="col-span-1 text-right text-gray-900">
                  {formatCurrency(totals.totalPaidPrice)}
                </div>
                <div className="col-span-1 text-right text-green-600">
                  {formatCurrency(totals.totalTradeDiscount)}
                </div>
                <div className="col-span-2"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="h-12 w-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No item purchases
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first item purchase.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setCreateModal({ isOpen: true })}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  className="mr-2 h-4 w-4"
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
                Add Item Purchase
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {createModal.isOpen && (
        <ItemPurchaseModal
          isOpen={createModal.isOpen}
          onClose={() => setCreateModal({ isOpen: false })}
          onSubmit={handleCreate}
          stores={stores}
          onStoreAdded={handleStoreAdded}
          loading={loading}
        />
      )}

      {editModal.isOpen && (
        <ItemPurchaseModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, itemPurchase: null })}
          onSubmit={(formData) =>
            editModal.itemPurchase?._id 
              ? handleUpdate(editModal.itemPurchase._id, formData)
              : toast.error("Invalid item purchase data")
          }
          itemPurchase={editModal.itemPurchase}
          stores={stores}
          onStoreAdded={handleStoreAdded}
          loading={loading}
        />
      )}

      {detailModal.isOpen && (
        <ItemPurchaseDetailModal
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal({ isOpen: false, itemPurchase: null })}
          itemPurchase={detailModal.itemPurchase}
          onEdit={() => {
            setDetailModal({ isOpen: false, itemPurchase: null });
            setEditModal({
              isOpen: true,
              itemPurchase: detailModal.itemPurchase,
            });
          }}
          onDelete={() => {
            setDetailModal({ isOpen: false, itemPurchase: null });
            handleDelete(detailModal.itemPurchase._id);
          }}
        />
      )}
    </div>
  );
}

/**
 * ItemPurchaseModal Component
 * Modal for creating/editing item purchases
 */
function ItemPurchaseModal({
  isOpen,
  onClose,
  onSubmit,
  itemPurchase,
  stores,
  onStoreAdded,
  loading,
}) {
  const [formData, setFormData] = useState({
    itemName: "",
    store: "",
    quotedPrice: "",
    paidPrice: "",
    purchaseDate: "",
    deliveryDate: "",
    notes: "",
  });

  // Initialize form data when editing
  useEffect(() => {
    if (itemPurchase) {
      setFormData({
        itemName: itemPurchase.itemName || "",
        store: itemPurchase.store || "",
        quotedPrice: itemPurchase.quotedPrice?.toString() || "",
        paidPrice: itemPurchase.paidPrice?.toString() || "",
        purchaseDate: itemPurchase.purchaseDate
          ? new Date(itemPurchase.purchaseDate).toISOString().split("T")[0]
          : "",
        deliveryDate: itemPurchase.deliveryDate
          ? new Date(itemPurchase.deliveryDate).toISOString().split("T")[0]
          : "",
        notes: itemPurchase.notes || "",
      });
    } else {
      setFormData({
        itemName: "",
        store: "",
        quotedPrice: "",
        paidPrice: "",
        purchaseDate: "",
        deliveryDate: "",
        notes: "",
      });
    }
  }, [itemPurchase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Calculate trade discount
  const tradeDiscount =
    formData.quotedPrice && formData.paidPrice
      ? parseFloat(formData.quotedPrice) - parseFloat(formData.paidPrice)
      : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {itemPurchase ? "Edit Item Purchase" : "Add Item Purchase"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {itemPurchase
                ? "Update the item purchase details below."
                : "Add a new item purchase to track project expenses."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.itemName}
                onChange={(e) =>
                  setFormData({ ...formData, itemName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., Bathroom tiles, Kitchen cabinets"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store *
              </label>
              <StoreDropdown
                value={formData.store}
                onChange={(store) => setFormData({ ...formData, store })}
                stores={stores}
                onStoreAdded={onStoreAdded}
                placeholder="Select a store..."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quoted Price (GBP) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.quotedPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, quotedPrice: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Paid Price (GBP) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.paidPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, paidPrice: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Trade Discount Display */}
            {formData.quotedPrice && formData.paidPrice && (
              <div className="rounded-md bg-green-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Trade Discount:
                  </span>
                  <span className="text-sm font-semibold text-green-900">
                    £{tradeDiscount.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Saving..." : itemPurchase ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * ItemPurchaseDetailModal Component
 * Modal for viewing item purchase details
 */
function ItemPurchaseDetailModal({
  isOpen,
  onClose,
  itemPurchase,
  onEdit,
  onDelete,
}) {
  if (!isOpen || !itemPurchase) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Item Purchase Details
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Item Name</h4>
              <p className="mt-1 text-sm text-gray-900">
                {itemPurchase.itemName}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Store</h4>
              <p className="mt-1 text-sm text-gray-900">{itemPurchase.store}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Quoted Price
                </h4>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatCurrency(itemPurchase.quotedPrice)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Paid Price
                </h4>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {formatCurrency(itemPurchase.paidPrice)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Trade Discount
              </h4>
              <p className="mt-1 text-sm font-semibold text-green-600">
                {formatCurrency(itemPurchase.tradeDiscount)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Purchase Date
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(itemPurchase.purchaseDate)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Delivery Date
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {itemPurchase.deliveryDate
                    ? formatDate(itemPurchase.deliveryDate)
                    : "Not set"}
                </p>
              </div>
            </div>

            {itemPurchase.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {itemPurchase.notes}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
