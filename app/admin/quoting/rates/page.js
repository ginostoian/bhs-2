"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Filter, Search } from "lucide-react";
import CreateRateCardModal from "./components/CreateRateCardModal";
import EditRateCardModal from "./components/EditRateCardModal";

export default function RateCardsPage() {
  const [rateCards, setRateCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRateCard, setSelectedRateCard] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    isActive: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRateCards();
  }, [filters]);

  const fetchRateCards = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append("type", filters.type);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.isActive !== "")
        queryParams.append("isActive", filters.isActive);

      const response = await fetch(`/api/admin/quoting/rates?${queryParams}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRateCards(data);
      }
    } catch (error) {
      console.error("Error fetching rate cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRateCard = async (rateCardId) => {
    if (!confirm("Are you sure you want to delete this rate card?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/quoting/rates/${rateCardId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setRateCards(rateCards.filter((r) => r._id !== rateCardId));
      } else {
        console.error("Failed to delete rate card");
      }
    } catch (error) {
      console.error("Error deleting rate card:", error);
    }
  };

  const handleCreateSuccess = (newRateCard) => {
    setRateCards([newRateCard, ...rateCards]);
    setShowCreateModal(false);
  };

  const handleEditSuccess = (updatedRateCard) => {
    setRateCards(
      rateCards.map((r) =>
        r._id === updatedRateCard._id ? updatedRateCard : r,
      ),
    );
    setShowEditModal(false);
    setSelectedRateCard(null);
  };

  const createTestRateCards = async () => {
    try {
      const testRateCards = [
        {
          name: "Electrician",
          type: "tradesperson",
          category: "Electrical",
          unit: "day",
          price: 250,
          description: "Qualified electrician day rate",
          isActive: true,
        },
        {
          name: "Plumber",
          type: "tradesperson",
          category: "Plumbing",
          unit: "day",
          price: 220,
          description: "Qualified plumber day rate",
          isActive: true,
        },
        {
          name: "Painter",
          type: "tradesperson",
          category: "Painting",
          unit: "day",
          price: 180,
          description: "Professional painter day rate",
          isActive: true,
        },
        {
          name: "Copper Pipe",
          type: "material",
          category: "Plumbing Materials",
          unit: "linear m",
          price: 22,
          description: "15mm copper pipe per linear meter",
          isActive: true,
        },
        {
          name: "Paint",
          type: "material",
          category: "Paint & Decorating",
          unit: "sqm",
          price: 15,
          description: "Premium paint coverage per square meter",
          isActive: true,
        },
        {
          name: "Tiles",
          type: "material",
          category: "Tiles & Adhesives",
          unit: "sqm",
          price: 45,
          description: "Ceramic tiles per square meter",
          isActive: true,
        },
      ];

      const createdRateCards = [];
      for (const rateCard of testRateCards) {
        const response = await fetch("/api/admin/quoting/rates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rateCard),
        });

        if (response.ok) {
          const newRateCard = await response.json();
          createdRateCards.push(newRateCard);
        }
      }

      if (createdRateCards.length > 0) {
        setRateCards([...createdRateCards, ...rateCards]);
        alert(
          `Created ${createdRateCards.length} test rate cards successfully!`,
        );
      }
    } catch (error) {
      console.error("Error creating test rate cards:", error);
    }
  };

  const openEditModal = (rateCard) => {
    setSelectedRateCard(rateCard);
    setShowEditModal(true);
  };

  const filteredRateCards = rateCards.filter((rateCard) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        rateCard.name.toLowerCase().includes(searchLower) ||
        rateCard.description?.toLowerCase().includes(searchLower) ||
        rateCard.category.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const categories = [...new Set(rateCards.map((r) => r.category))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rate Cards</h1>
            <p className="text-gray-600">
              Manage tradespeople day rates and material costs
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
          <h1 className="text-2xl font-bold text-gray-900">Rate Cards</h1>
          <p className="text-gray-600">
            Manage tradespeople day rates and material costs
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Add Rate Card
          </button>
          <button
            onClick={createTestRateCards}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Create Test Rates
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
                placeholder="Search rate cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="tradesperson">Tradespeople</option>
              <option value="material">Materials</option>
            </select>
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

      {/* Rate Cards List */}
      {filteredRateCards.length > 0 ? (
        <div className="space-y-4">
          {filteredRateCards.map((rateCard) => (
            <div
              key={rateCard._id}
              className={`rounded-lg border p-6 transition-shadow hover:shadow-md ${
                rateCard.isActive
                  ? "border-gray-200 bg-white"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {rateCard.name}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        rateCard.type === "tradesperson"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {rateCard.type === "tradesperson"
                        ? "Tradesperson"
                        : "Material"}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        rateCard.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {rateCard.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-medium">{rateCard.category}</span>
                    <span>•</span>
                    <span className="font-medium">
                      £{rateCard.price.toFixed(2)} per {rateCard.unit}
                    </span>
                    {rateCard.description && (
                      <>
                        <span>•</span>
                        <span>{rateCard.description}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(rateCard)}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRateCard(rateCard._id)}
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
            No rate cards found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.values(filters).some((f) => f !== "")
              ? "Try adjusting your search or filters."
              : "Get started by creating your first rate card."}
          </p>
          {!searchTerm && !Object.values(filters).some((f) => f !== "") && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Rate Card
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateRateCardModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRateCard && (
        <EditRateCardModal
          rateCard={selectedRateCard}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRateCard(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
