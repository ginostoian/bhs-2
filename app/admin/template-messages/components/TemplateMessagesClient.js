"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import CreateTemplateForm from "./CreateTemplateForm";
import EditTemplateForm from "./EditTemplateForm";
import TemplateCard from "./TemplateCard";
import TemplatePreviewModal from "./TemplatePreviewModal";

const PAGE_SIZE = 12;
const CATEGORIES = [
  "All",
  "Email Templates",
  "SMS Templates",
  "General Messages",
  "Project Communications",
  "Support Responses",
  "Quote Templates",
  "Bank Information",
];

/**
 * Template Messages Client Component
 * Main interface for managing template messages with search, filter, and CRUD operations
 */
export default function TemplateMessagesClient({ initialTemplates }) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState(initialTemplates);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialTemplates.length);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [editTemplate, setEditTemplate] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
    templateId: null,
  });

  // Fetch templates from API with pagination and search
  const fetchTemplates = async (
    pageNum = 1,
    search = "",
    category = categoryFilter,
    sort = sortBy,
    order = sortOrder,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: PAGE_SIZE,
        sortBy: sort,
        sortOrder: order,
      });
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);

      const res = await fetch(
        `/api/admin/template-messages?${params.toString()}`,
      );
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setTemplates(data.templates || []);
      setFilteredTemplates(data.templates || []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to fetch templates. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch templates when filters change
  useEffect(() => {
    if (
      searchTerm ||
      page > 1 ||
      categoryFilter !== "All" ||
      sortBy !== "createdAt" ||
      sortOrder !== "desc"
    ) {
      fetchTemplates(page, searchTerm, categoryFilter, sortBy, sortOrder);
    } else {
      // Use initial data and apply filters locally
      let filtered = initialTemplates;
      if (categoryFilter !== "All") {
        filtered = initialTemplates.filter(
          (template) => template.category === categoryFilter,
        );
      }
      if (searchTerm) {
        filtered = filtered.filter(
          (template) =>
            template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        );
      }
      setFilteredTemplates(filtered);
      setTotalCount(filtered.length);
    }
  }, [page, searchTerm, categoryFilter, sortBy, sortOrder]);

  // Handle category filter change
  const handleCategoryFilterChange = (category) => {
    setCategoryFilter(category);
    setPage(1);
  };

  // Handle search term change
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(1);
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
    setPage(1);
  };

  // Handle template creation
  const handleTemplateCreated = (newTemplate) => {
    setTemplates((prev) => [newTemplate, ...prev]);
    setFilteredTemplates((prev) => [newTemplate, ...prev]);
    setTotalCount((prev) => prev + 1);
    setShowCreateForm(false);
  };

  // Handle template update
  const handleTemplateUpdated = (updatedTemplate) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === updatedTemplate.id ? updatedTemplate : template,
      ),
    );
    setFilteredTemplates((prev) =>
      prev.map((template) =>
        template.id === updatedTemplate.id ? updatedTemplate : template,
      ),
    );

    // Show success message
    setModalState({
      isOpen: true,
      title: "Success",
      message: "Template updated successfully!",
      type: "alert",
      confirmText: "OK",
    });
  };

  // Handle template deletion
  const handleTemplateDeleted = (templateId) => {
    setTemplates((prev) =>
      prev.filter((template) => template.id !== templateId),
    );
    setFilteredTemplates((prev) =>
      prev.filter((template) => template.id !== templateId),
    );
    setTotalCount((prev) => prev - 1);
  };

  // Handle template usage tracking
  const handleTemplateUsed = async (templateId) => {
    try {
      await fetch(`/api/admin/template-messages/${templateId}/use`, {
        method: "POST",
      });

      // Update usage count in state
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === templateId
            ? {
                ...template,
                usageCount: (template.usageCount || 0) + 1,
                lastUsed: new Date().toISOString(),
              }
            : template,
        ),
      );
      setFilteredTemplates((prev) =>
        prev.map((template) =>
          template.id === templateId
            ? {
                ...template,
                usageCount: (template.usageCount || 0) + 1,
                lastUsed: new Date().toISOString(),
              }
            : template,
        ),
      );
    } catch (error) {
      console.error("Error tracking template usage:", error);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (templateId, templateTitle) => {
    setModalState({
      isOpen: true,
      title: "Delete Template",
      message: `Are you sure you want to delete "${templateTitle}"? This action cannot be undone.`,
      type: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
      templateId,
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!modalState.templateId) return;

    try {
      const response = await fetch(
        `/api/admin/template-messages/${modalState.templateId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      handleTemplateDeleted(modalState.templateId);
      setModalState({
        isOpen: false,
        title: "",
        message: "",
        type: "alert",
        confirmText: "OK",
        templateId: null,
      });
    } catch (error) {
      console.error("Error deleting template:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete template. Please try again.",
        type: "alert",
        confirmText: "OK",
        templateId: null,
      });
    }
  };

  // Pagination controls
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div>
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Template Messages
          </h2>
          <p className="text-gray-600">Manage your reusable text templates</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Template
        </button>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Category
              </label>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilterChange(category)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      categoryFilter === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search templates..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-64"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sort by
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="title">Title</option>
                  <option value="category">Category</option>
                  <option value="usageCount">Usage Count</option>
                  <option value="lastUsed">Last Used</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="rounded-md border border-gray-300 p-2 hover:bg-gray-50"
                  title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredTemplates.length} of {totalCount} templates
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 && !loading ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📝</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {totalCount === 0
              ? "No templates found"
              : "No templates match your filters"}
          </h3>
          <p className="text-gray-600">
            {totalCount === 0
              ? "Create your first template to get started."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : loading ? (
        <div className="py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading templates...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={(template) => setEditTemplate(template)}
                onDelete={(templateId, templateTitle) =>
                  openDeleteModal(templateId, templateTitle)
                }
                onUse={handleTemplateUsed}
                onPreview={(template) => setPreviewTemplate(template)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
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

      {/* Create Template Form Modal */}
      {showCreateForm && (
        <CreateTemplateForm
          onClose={() => setShowCreateForm(false)}
          onTemplateCreated={handleTemplateCreated}
        />
      )}

      {/* Edit Template Form Modal */}
      {editTemplate && (
        <EditTemplateForm
          template={editTemplate}
          onClose={() => setEditTemplate(null)}
          onTemplateUpdated={handleTemplateUpdated}
        />
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onEdit={(template) => {
            setPreviewTemplate(null);
            setEditTemplate(template);
          }}
          onDelete={(templateId, templateTitle) => {
            setPreviewTemplate(null);
            openDeleteModal(templateId, templateTitle);
          }}
          onUse={handleTemplateUsed}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
            templateId: null,
          })
        }
        onConfirm={handleDeleteConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </div>
  );
}
