"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calculator,
  DollarSign,
  Filter,
  Search,
} from "lucide-react";
import CreateTemplateServiceModal from "./components/CreateTemplateServiceModal";
import EditTemplateServiceModal from "./components/EditTemplateServiceModal";

export default function TemplateServicesPage() {
  const [templateServices, setTemplateServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTemplateService, setSelectedTemplateService] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    pricingType: "",
    isActive: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTemplateServices();
  }, [filters]);

  const fetchTemplateServices = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.pricingType)
        queryParams.append("pricingType", filters.pricingType);
      if (filters.isActive !== "")
        queryParams.append("isActive", filters.isActive);

      const response = await fetch(
        `/api/admin/quoting/template-services?${queryParams}`,
        {
          credentials: "include",
        },
      );
      if (response.ok) {
        const data = await response.json();
        setTemplateServices(data);
      }
    } catch (error) {
      console.error("Error fetching template services:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplateService = async (templateServiceId) => {
    if (!confirm("Are you sure you want to delete this template service?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/quoting/template-services/${templateServiceId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        setTemplateServices(
          templateServices.filter((t) => t._id !== templateServiceId),
        );
      } else {
        console.error("Failed to delete template service");
      }
    } catch (error) {
      console.error("Error deleting template service:", error);
    }
  };

  const handleCreateSuccess = (newTemplateService) => {
    setTemplateServices([newTemplateService, ...templateServices]);
    setShowCreateModal(false);
  };

  const handleEditSuccess = (updatedTemplateService) => {
    setTemplateServices(
      templateServices.map((t) =>
        t._id === updatedTemplateService._id ? updatedTemplateService : t,
      ),
    );
    setShowEditModal(false);
    setSelectedTemplateService(null);
  };

  const openEditModal = (templateService) => {
    setSelectedTemplateService(templateService);
    setShowEditModal(true);
  };

  const filteredTemplateServices = templateServices.filter(
    (templateService) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          templateService.name.toLowerCase().includes(searchLower) ||
          templateService.description?.toLowerCase().includes(searchLower) ||
          templateService.category.toLowerCase().includes(searchLower)
        );
      }
      return true;
    },
  );

  const categories = [...new Set(templateServices.map((t) => t.category))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Template Services
            </h1>
            <p className="text-gray-600">
              Manage reusable service definitions for quotes
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <div className="animate-pulse">
            <div className="mx-auto h-12 w-12 rounded bg-gray-200"></div>
            <div className="mx-auto mt-2 h-4 w-32 rounded bg-gray-200"></div>
            <div className="mx-auto mt-1 h-3 w-48 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Template Services
          </h1>
          <p className="text-gray-600">
            Manage reusable service definitions for quotes
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Add Template Service
          </button>
          <button
            onClick={createTestTemplateServices}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Create Test Services
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search template services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={filters.pricingType}
              onChange={(e) =>
                setFilters({ ...filters, pricingType: e.target.value })
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">All Pricing Types</option>
              <option value="fixed">Fixed Price</option>
              <option value="calculated">Calculated</option>
            </select>
            <select
              value={filters.isActive}
              onChange={(e) =>
                setFilters({ ...filters, isActive: e.target.value })
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Template Services List */}
      {filteredTemplateServices.length > 0 ? (
        <div className="space-y-4">
          {filteredTemplateServices.map((templateService) => (
            <div
              key={templateService._id}
              className={`rounded-lg border p-6 transition-shadow hover:shadow-md ${
                templateService.isActive
                  ? "border-gray-200 bg-white"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {templateService.name}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        templateService.pricingType === "fixed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {templateService.pricingType === "fixed" ? (
                        <DollarSign className="mr-1 h-3 w-3" />
                      ) : (
                        <Calculator className="mr-1 h-3 w-3" />
                      )}
                      {templateService.pricingType === "fixed"
                        ? "Fixed Price"
                        : "Calculated"}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        templateService.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {templateService.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-medium">
                      {templateService.category}
                    </span>
                    <span>•</span>
                    <span className="font-medium">
                      Unit: {templateService.unit}
                    </span>
                    {templateService.pricingType === "fixed" && (
                      <>
                        <span>•</span>
                        <span className="font-medium">
                          £{templateService.fixedPrice?.toFixed(2)} per{" "}
                          {templateService.unit}
                        </span>
                      </>
                    )}
                    {templateService.pricingType === "calculated" && (
                      <>
                        <span>•</span>
                        <span className="font-medium">
                          Calculated from rate cards
                        </span>
                      </>
                    )}
                  </div>
                  {templateService.description && (
                    <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                      {templateService.description}
                    </p>
                  )}
                  {templateService.pricingType === "calculated" &&
                    templateService.calculationConfig && (
                      <div className="mt-3 rounded-lg bg-blue-50 p-3">
                        <div className="text-xs text-blue-800">
                          <div className="font-medium">Calculation Setup:</div>
                          <div className="mt-1">
                            <span className="font-medium">Tradesperson:</span>{" "}
                            {templateService.calculationConfig.tradesperson
                              ?.name || "Not set"}
                            {templateService.calculationConfig.tradesperson && (
                              <span className="ml-2">
                                (£
                                {
                                  templateService.calculationConfig.tradesperson
                                    .price
                                }
                                /
                                {
                                  templateService.calculationConfig.tradesperson
                                    .unit
                                }
                                )
                              </span>
                            )}
                          </div>
                          {templateService.calculationConfig.material && (
                            <div className="mt-1">
                              <span className="font-medium">Material:</span>{" "}
                              {templateService.calculationConfig.material.name}
                              <span className="ml-2">
                                (£
                                {
                                  templateService.calculationConfig.material
                                    .price
                                }
                                /
                                {
                                  templateService.calculationConfig.material
                                    .unit
                                }
                                )
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(templateService)}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTemplateService(templateService._id)}
                    className="inline-flex items-center rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Filter className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No template services found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.values(filters).some((f) => f !== "")
              ? "Try adjusting your search or filters."
              : "Get started by creating your first template service."}
          </p>
          {!searchTerm && !Object.values(filters).some((f) => f !== "") && (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Template Service
              </button>
              <button
                onClick={createTestTemplateServices}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Test Services
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTemplateServiceModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTemplateService && (
        <EditTemplateServiceModal
          templateService={selectedTemplateService}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTemplateService(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );

  async function createTestTemplateServices() {
    try {
      const testServices = [
        {
          name: "Skirting Installation",
          description: "Install and finish skirting boards",
          category: "Installation",
          unit: "linear m",
          pricingType: "fixed",
          fixedPrice: 22,
          notes: "Includes materials and labour",
        },
        {
          name: "Wall Painting",
          description: "Paint interior walls with 2 coats",
          category: "Painting",
          unit: "sqm",
          pricingType: "calculated",
          calculationConfig: {
            tradesperson: null, // Will be set when rate cards exist
            material: null, // Will be set when rate cards exist
            defaultQuantity: 1,
            defaultMaterialQuantity: 0.1,
          },
          notes: "Calculated from painter day rate and paint materials",
        },
        {
          name: "Electrical Outlet Installation",
          description: "Install new electrical outlet",
          category: "Electrical",
          unit: "piece",
          pricingType: "fixed",
          fixedPrice: 85,
          notes: "Includes materials and labour",
        },
      ];

      const createdServices = [];
      for (const service of testServices) {
        const response = await fetch("/api/admin/quoting/template-services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(service),
        });

        if (response.ok) {
          const newService = await response.json();
          createdServices.push(newService);
        }
      }

      if (createdServices.length > 0) {
        setTemplateServices([...createdServices, ...templateServices]);
        alert(
          `Created ${createdServices.length} test template services successfully!`,
        );
      }
    } catch (error) {
      console.error("Error creating test template services:", error);
    }
  }
}
