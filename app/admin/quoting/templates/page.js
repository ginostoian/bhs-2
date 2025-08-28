"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, FileText, Edit, Trash2, Eye } from "lucide-react";

export default function QuoteTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/quoting/templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (templateId) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/quoting/templates/${templateId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setTemplates(templates.filter((t) => t._id !== templateId));
      } else {
        console.error("Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const createTestTemplate = async () => {
    try {
      const testTemplate = {
        name: "Standard Bathroom Renovation",
        description:
          "Complete bathroom renovation including demolition, installation, and finishing",
        projectType: "bathroom-renovation",
        baseServices: [
          {
            category: "Demolition & Preparation",
            items: [
              {
                name: "Remove existing bathroom fixtures",
                description: "Remove bath, toilet, sink, tiles, etc.",
                unit: "job",
                basePrice: 150,
                notes: "Includes disposal of old materials",
              },
              {
                name: "Strip walls and ceiling",
                description: "Remove old plaster and prepare surfaces",
                unit: "sqm",
                basePrice: 25,
                notes: "Average bathroom size",
              },
            ],
          },
          {
            category: "Installation",
            items: [
              {
                name: "Install new bath/shower",
                description: "Supply and fit new bath or shower enclosure",
                unit: "piece",
                basePrice: 300,
                notes: "Basic white suite included",
              },
              {
                name: "Install new toilet",
                description: "Supply and fit new toilet",
                unit: "piece",
                basePrice: 200,
                notes: "Basic white suite included",
              },
              {
                name: "Install new sink",
                description: "Supply and fit new bathroom sink",
                unit: "piece",
                basePrice: 150,
                notes: "Basic white suite included",
              },
            ],
          },
          {
            category: "Finishing",
            items: [
              {
                name: "Wall tiling",
                description: "Tile walls around bath/shower area",
                unit: "sqm",
                basePrice: 45,
                notes: "Basic white tiles included",
              },
              {
                name: "Floor tiling",
                description: "Tile bathroom floor",
                unit: "sqm",
                basePrice: 35,
                notes: "Basic white tiles included",
              },
              {
                name: "Painting",
                description: "Paint ceiling and walls",
                unit: "sqm",
                basePrice: 15,
                notes: "2 coats of bathroom paint",
              },
            ],
          },
        ],
        defaultPricing: {
          vatRate: 20,
        },
      };

      const response = await fetch("/api/admin/quoting/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testTemplate),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setTemplates([newTemplate, ...templates]);
        alert("Test template created successfully!");
      } else {
        console.error("Failed to create test template");
      }
    } catch (error) {
      console.error("Error creating test template:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quote Templates
            </h1>
            <p className="text-gray-600">
              Manage project templates for different renovation types
            </p>
          </div>
          <Link
            href="/admin/quoting/templates/create"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Create Template
          </Link>
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
          <h1 className="text-2xl font-bold text-gray-900">Quote Templates</h1>
          <p className="text-gray-600">
            Manage project templates for different renovation types
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/quoting/templates/create"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Create Template
          </Link>
          <button
            onClick={createTestTemplate}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FileText className="-ml-1 mr-2 h-4 w-4" />
            Create Test Template
          </button>
        </div>
      </div>

      {/* Templates List */}
      {templates.length > 0 ? (
        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template._id}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {template.name}
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {template.projectType}
                    </span>
                  </div>
                  {template.description && (
                    <p className="mt-1 text-sm text-gray-600">
                      {template.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      {template.baseServices?.length || 0} service categories
                    </span>
                    <span>
                      Created{" "}
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/quoting/templates/${template._id}/view`}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                  <Link
                    href={`/admin/quoting/templates/${template._id}/edit`}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteTemplate(template._id)}
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
        /* Empty State */
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No templates yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first quote template.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/admin/quoting/templates/create"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Link>
            <button
              onClick={createTestTemplate}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Test Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
