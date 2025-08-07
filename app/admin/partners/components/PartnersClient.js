"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import PartnerForm from "./PartnerForm";
import PartnerDetailsModal from "./PartnerDetailsModal";

const PAGE_SIZE = 12;

export default function PartnersClient({
  partners: initialPartners,
  occupations: initialOccupations,
  experiences,
}) {
  const [partners, setPartners] = useState(initialPartners);
  const [occupations, setOccupations] = useState(initialOccupations);
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
    partner: null,
    mode: "create",
  });
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    partnerId: null,
  });

  const [filterOccupation, setFilterOccupation] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialPartners.length);
  const [loading, setLoading] = useState(false);

  const fetchPartners = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: String(PAGE_SIZE),
      });
      if (searchTerm) params.set("search", searchTerm);
      if (filterOccupation) params.set("occupation", filterOccupation);
      if (filterExperience) params.set("experience", filterExperience);
      if (filterActive !== "all")
        params.set("active", filterActive === "active" ? "true" : "false");
      const res = await fetch(`/api/partners?${params.toString()}`);
      const data = await res.json();
      setPartners(data.partners || []);
      setTotalCount(data.totalCount || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, filterOccupation, filterExperience, filterActive]);

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      const matchesOccupation =
        !filterOccupation || p.occupation === filterOccupation;
      const matchesExperience =
        !filterExperience || p.experience === filterExperience;
      const matchesActive =
        filterActive === "all" ||
        (filterActive === "active" && p.isActive) ||
        (filterActive === "inactive" && !p.isActive);
      const matchesSearch =
        !searchTerm ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.occupation?.toLowerCase().includes(searchTerm.toLowerCase());
      return (
        matchesOccupation && matchesExperience && matchesActive && matchesSearch
      );
    });
  }, [partners, filterOccupation, filterExperience, filterActive, searchTerm]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const url =
        formModal.mode === "create"
          ? "/api/partners"
          : `/api/partners/${formModal.partner.id}`;
      const method = formModal.mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save partner");
      const { partner } = await res.json();
      if (formModal.mode === "create") {
        setPartners((prev) => [...prev, partner]);
        if (partner.occupation) {
          setOccupations((prev) =>
            Array.from(new Set([...(prev || []), partner.occupation])).sort(),
          );
        }
      } else {
        setPartners((prev) =>
          prev.map((p) => (p.id === partner.id ? partner : p)),
        );
      }
      setFormModal({ isOpen: false, partner: null, mode: "create" });
    } catch (e) {
      console.error(e);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to save partner. Please try again.",
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
      const res = await fetch(`/api/partners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete partner");
      setPartners((prev) => prev.filter((p) => p.id !== id));
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
        message: "Failed to delete partner. Please try again.",
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Partners ({totalCount})
          </h3>
          <p className="text-sm text-gray-600">
            Total partners in database: {totalCount}
          </p>
        </div>
        <button
          onClick={() =>
            setFormModal({ isOpen: true, partner: null, mode: "create" })
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
          Add Partner
        </button>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Occupation
            </label>
            <select
              value={filterOccupation}
              onChange={(e) => {
                setFilterOccupation(e.target.value);
                setPage(1);
              }}
              className="mt-1 block w-44 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">All</option>
              {occupations?.map((o) => (
                <option key={o} value={o}>
                  {o}
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

      {loading ? (
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading partners...</p>
        </div>
      ) : partners.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🤝</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No partners found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPartners.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {p.name}
                    </h3>
                    {p.occupation && (
                      <p className="text-sm text-gray-600">{p.occupation}</p>
                    )}
                    {p.email && (
                      <p className="text-sm text-gray-600">{p.email}</p>
                    )}
                    {p.phone && (
                      <p className="text-sm text-gray-600">{p.phone}</p>
                    )}
                  </div>
                  <span
                    className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${p.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="mb-3 space-y-1 text-sm text-gray-500">
                  <p>
                    <strong>Experience:</strong> {p.experience || "—"}
                  </p>
                  <p>
                    <strong>Total referrals:</strong> {p.referrals?.length || 0}
                  </p>
                </div>
                {p.notes && (
                  <p className="mb-3 text-sm text-gray-600">{p.notes}</p>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setDetailsModal({ isOpen: true, partnerId: p.id })
                    }
                    className="flex-1 rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
                  >
                    Details
                  </button>
                  <button
                    onClick={() =>
                      setFormModal({ isOpen: true, partner: p, mode: "edit" })
                    }
                    className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setModalState({
                        isOpen: true,
                        title: "Delete Partner",
                        message: `Are you sure you want to delete \"${p.name}\"? This action cannot be undone.`,
                        type: "confirm",
                        confirmText: "Delete",
                        cancelText: "Cancel",
                        onConfirm: () => handleDelete(p.id),
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

      <PartnerForm
        isOpen={formModal.isOpen}
        onClose={() =>
          setFormModal({ isOpen: false, partner: null, mode: "create" })
        }
        onSubmit={handleSubmit}
        partner={formModal.partner}
        mode={formModal.mode}
        isSubmitting={isSubmitting}
        occupations={occupations}
        experiences={experiences}
      />

      <PartnerDetailsModal
        isOpen={detailsModal.isOpen}
        partnerId={detailsModal.partnerId}
        onClose={() => setDetailsModal({ isOpen: false, partnerId: null })}
        onPartnerUpdate={(updated) => {
          setPartners((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p)),
          );
        }}
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
