"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import ContractorForm from "./ContractorForm";

const PAGE_SIZE = 12;

export default function ContractorsClient({
  contractors: initialContractors,
  trades: initialTrades,
  priceTiers,
  experiences,
}) {
  const [contractors, setContractors] = useState(initialContractors);
  const [trades, setTrades] = useState(initialTrades);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });
  const [formModal, setFormModal] = useState({
    isOpen: false,
    contractor: null,
    mode: "create",
  });

  // Filters/search
  const [filterTrade, setFilterTrade] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialContractors.length);
  const [loading, setLoading] = useState(false);

  const fetchContractors = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(PAGE_SIZE),
      });
      if (searchTerm) params.set("search", searchTerm);
      if (filterTrade) params.set("trade", filterTrade);
      if (filterPrice) params.set("priceTier", filterPrice);
      if (filterExperience) params.set("experience", filterExperience);
      if (filterActive !== "all")
        params.set("active", filterActive === "active" ? "true" : "false");
      const res = await fetch(`/api/contractors?${params.toString()}`);
      const data = await res.json();
      setContractors(data.contractors || []);
      setTotalCount(data.totalCount || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    searchTerm,
    filterTrade,
    filterPrice,
    filterExperience,
    filterActive,
  ]);

  const filteredContractors = useMemo(() => {
    return contractors.filter((c) => {
      const matchesTrade = !filterTrade || c.trades?.includes(filterTrade);
      const matchesPrice = !filterPrice || c.priceTier === filterPrice;
      const matchesExperience =
        !filterExperience || c.experience === filterExperience;
      const matchesActive =
        filterActive === "all" ||
        (filterActive === "active" && c.isActive) ||
        (filterActive === "inactive" && !c.isActive);
      const matchesSearch =
        !searchTerm ||
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.address?.toLowerCase().includes(searchTerm.toLowerCase());
      return (
        matchesTrade &&
        matchesPrice &&
        matchesExperience &&
        matchesActive &&
        matchesSearch
      );
    });
  }, [
    contractors,
    filterTrade,
    filterPrice,
    filterExperience,
    filterActive,
    searchTerm,
  ]);

  // CRUD handlers
  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const url =
        formModal.mode === "create"
          ? "/api/contractors"
          : `/api/contractors/${formModal.contractor.id}`;
      const method = formModal.mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save contractor");
      const { contractor } = await res.json();
      if (formModal.mode === "create") {
        setContractors((prev) => [...prev, contractor]);
        // update trades list with custom/new tags
        if (Array.isArray(contractor.trades)) {
          setTrades((prev) =>
            Array.from(new Set([...(prev || []), ...contractor.trades])).sort(),
          );
        }
      } else {
        setContractors((prev) =>
          prev.map((c) => (c.id === contractor.id ? contractor : c)),
        );
      }
      setFormModal({ isOpen: false, contractor: null, mode: "create" });
    } catch (e) {
      console.error(e);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to save contractor. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/contractors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete contractor");
      setContractors((prev) => prev.filter((c) => c.id !== id));
      setModalState({
        isOpen: false,
        title: "",
        message: "",
        type: "alert",
        confirmText: "OK",
      });
    } catch (e) {
      console.error(e);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete contractor. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Contractors ({totalCount})
          </h3>
          <p className="text-sm text-gray-600">
            Total contractors in database: {totalCount}
          </p>
        </div>
        <button
          onClick={() =>
            setFormModal({ isOpen: true, contractor: null, mode: "create" })
          }
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
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
          Add Contractor
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Trade
            </label>
            <select
              value={filterTrade}
              onChange={(e) => {
                setFilterTrade(e.target.value);
                setPage(1);
              }}
              className="mt-1 block w-40 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">All</option>
              {trades?.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Price
            </label>
            <select
              value={filterPrice}
              onChange={(e) => {
                setFilterPrice(e.target.value);
                setPage(1);
              }}
              className="mt-1 block w-28 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">All</option>
              {priceTiers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Past Experience
            </label>
            <select
              value={filterExperience}
              onChange={(e) => {
                setFilterExperience(e.target.value);
                setPage(1);
              }}
              className="mt-1 block w-40 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">All</option>
              {experiences.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Active
            </label>
            <select
              value={filterActive}
              onChange={(e) => {
                setFilterActive(e.target.value);
                setPage(1);
              }}
              className="mt-1 block w-28 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, phone, address..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading contractors...</p>
        </div>
      ) : contractors.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🧰</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No contractors found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredContractors.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {c.name}
                    </h3>
                    {c.email && (
                      <p className="text-sm text-gray-600">{c.email}</p>
                    )}
                    {c.phone && (
                      <p className="text-sm text-gray-600">{c.phone}</p>
                    )}
                    {c.address && (
                      <p className="text-sm text-gray-600">{c.address}</p>
                    )}
                  </div>
                  <span
                    className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mb-3 space-y-1 text-sm text-gray-500">
                  <p>
                    <strong>Trades:</strong>{" "}
                    {c.trades?.length ? c.trades.join(", ") : "—"}
                  </p>
                  <p>
                    <strong>Price:</strong> {c.priceTier || "—"}
                  </p>
                  <p>
                    <strong>Experience:</strong> {c.experience || "—"}
                  </p>
                </div>
                {c.notes && (
                  <p className="mb-3 text-sm text-gray-600">{c.notes}</p>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setFormModal({
                        isOpen: true,
                        contractor: c,
                        mode: "edit",
                      })
                    }
                    className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setModalState({
                        isOpen: true,
                        title: "Delete Contractor",
                        message: `Are you sure you want to delete \"${c.name}\"? This action cannot be undone.`,
                        type: "confirm",
                        confirmText: "Delete",
                        cancelText: "Cancel",
                        onConfirm: () => handleDelete(c.id),
                      })
                    }
                    className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => canPrev && setPage(page - 1)}
                disabled={!canPrev}
                className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-2 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => canNext && setPage(page + 1)}
                disabled={!canNext}
                className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Forms and Modals */}
      <ContractorForm
        isOpen={formModal.isOpen}
        onClose={() =>
          setFormModal({ isOpen: false, contractor: null, mode: "create" })
        }
        onSubmit={handleSubmit}
        contractor={formModal.contractor}
        mode={formModal.mode}
        isSubmitting={isSubmitting}
        trades={trades}
        priceTiers={priceTiers}
        experiences={experiences}
      />

      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          })
        }
        onConfirm={() => {
          if (modalState.onConfirm) modalState.onConfirm();
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          });
        }}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </div>
  );
}
