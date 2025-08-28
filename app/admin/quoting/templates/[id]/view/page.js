"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, FileText, Tag, Calendar, User } from "lucide-react";
import { formatProjectType } from "@/libs/formatProjectType";

export default function ViewTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchTemplate();
    }
  }, [params.id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/quoting/templates/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
      } else if (response.status === 404) {
        setError("Template not found");
      } else {
        setError("Failed to load template");
      }
    } catch (error) {
      console.error("Error fetching template:", error);
      setError("Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/quoting/templates"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-red-900">Error</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return null;
  }

  // Calculate total services count
  const totalServices = template.baseServices.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/quoting/templates"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {template.name}
            </h1>
            <p className="text-sm text-gray-500">Template Details</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/quoting/templates/${template._id}/edit`}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Template
          </Link>
        </div>
      </div>

      {/* Template Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                Template Information
              </h2>
            </div>
            <div className="space-y-4 px-6 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{template.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-1 whitespace-pre-line text-sm text-gray-900">
                  {template.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Type
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {formatProjectType(template.projectType)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Version
                </label>
                <p className="mt-1 text-sm text-gray-900">{template.version}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  VAT Rate
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {template.defaultPricing?.vatRate || 20}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900">Statistics</h3>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-sm text-gray-500">Service Categories</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {template.baseServices.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Total Services</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {totalServices}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Status</dt>
                  <dd>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        template.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900">Metadata</h3>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    Created
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    Last Updated
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
                {template.createdBy && (
                  <div>
                    <dt className="flex items-center text-sm text-gray-500">
                      <User className="mr-2 h-4 w-4" />
                      Created By
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {template.createdBy.name || template.createdBy.email}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Services Details */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">Base Services</h2>
          <p className="mt-1 text-sm text-gray-500">
            Services included in this template
          </p>
        </div>
        <div className="px-6 py-4">
          {template.baseServices.length > 0 ? (
            <div className="space-y-6">
              {template.baseServices.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            {item.description && (
                              <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
                                {item.description}
                              </p>
                            )}
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                              <span>Unit: {item.unit}</span>
                              <span className="font-medium text-green-600">
                                Base Price: £{item.basePrice.toFixed(2)}
                              </span>
                            </div>
                            {item.notes && (
                              <p className="mt-2 whitespace-pre-line text-sm italic text-gray-500">
                                Notes: {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                No services defined in this template
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
