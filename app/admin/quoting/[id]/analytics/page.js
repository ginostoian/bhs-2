"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Clock,
  Smartphone,
  Monitor,
  Globe,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function QuoteAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { id: quoteId } = params;

  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    fetchAnalytics();
  }, [quoteId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/quotes/${quoteId}/analytics?timeRange=${timeRange}`,
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log("📊 Analytics data received:", result.data);
          console.log(
            "🎯 Visitor type stats:",
            result.data.analytics.visitorTypeStats,
          );
          console.log(
            "📍 UTM source stats:",
            result.data.analytics.utmSourceStats,
          );
          console.log(
            "📱 UTM medium stats:",
            result.data.analytics.utmMediumStats,
          );
          console.log("👥 Recent views:", result.data.analytics.recentViews);
          setAnalytics(result.data);
        } else {
          toast.error(result.error || "Failed to load analytics");
        }
      } else {
        toast.error("Failed to load analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Analytics Not Available
        </h1>
        <p className="mb-6 text-gray-600">
          Unable to load analytics for this quote.
        </p>
        <Link
          href="/admin/quoting/history"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Link>
      </div>
    );
  }

  const { quote, analytics: data } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/quoting/${quoteId}/preview`}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quote
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quote Analytics
            </h1>
            <p className="text-gray-600">
              #{quote.quoteNumber} - {quote.title}
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Time Range:
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Views
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {data.overview.totalViews || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Unique Visitors
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {data.overview.uniqueVisitorCount || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Avg. Time on Page
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatDuration(
                    Math.floor(data.overview.averageTimeOnPage || 0),
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Last Viewed
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {data.overview.lastView
                    ? formatDate(data.overview.lastView)
                    : "Never"}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Device Breakdown */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Device Breakdown
            </h3>
            <div className="mt-4 space-y-3">
              {data.deviceStats.map((device, index) => {
                const percentage = (
                  (device.count / data.overview.totalViews) *
                  100
                ).toFixed(1);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {device._id === "mobile" ? (
                        <Smartphone className="mr-2 h-4 w-4 text-gray-400" />
                      ) : (
                        <Monitor className="mr-2 h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium capitalize text-gray-900">
                        {device._id}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {device.count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Browser Breakdown
            </h3>
            <div className="mt-4 space-y-3">
              {data.browserStats.slice(0, 5).map((browser, index) => {
                const percentage = (
                  (browser.count / data.overview.totalViews) *
                  100
                ).toFixed(1);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {browser._id}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {browser.count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Visitor Type Breakdown */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Visitor Types
            </h3>
            <div className="mt-4 space-y-3">
              {data.visitorTypeStats?.map((type, index) => {
                const percentage = (
                  (type.count / data.overview.totalViews) *
                  100
                ).toFixed(1);

                // Visitor type badge colors
                const getTypeColor = (visitorType) => {
                  switch (visitorType) {
                    case "client":
                      return "bg-green-100 text-green-800";
                    case "internal":
                      return "bg-blue-100 text-blue-800";
                    case "partner":
                      return "bg-purple-100 text-purple-800";
                    default:
                      return "bg-gray-100 text-gray-800";
                  }
                };

                const getProgressColor = (visitorType) => {
                  switch (visitorType) {
                    case "client":
                      return "bg-green-600";
                    case "internal":
                      return "bg-blue-600";
                    case "partner":
                      return "bg-purple-600";
                    default:
                      return "bg-gray-600";
                  }
                };

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(type._id)}`}
                      >
                        {type._id || "unknown"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-24 rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(type._id)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {type.count} ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* UTM Tracking Row */}
      {(data.utmSourceStats?.length > 0 || data.utmMediumStats?.length > 0) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* UTM Source */}
          {data.utmSourceStats?.length > 0 && (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Traffic Sources (UTM)
                </h3>
                <div className="mt-4 space-y-3">
                  {data.utmSourceStats.map((source, index) => {
                    const percentage = (
                      (source.count / data.overview.totalViews) *
                      100
                    ).toFixed(1);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {source._id}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-24 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-orange-600"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {source.count} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* UTM Medium */}
          {data.utmMediumStats?.length > 0 && (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Traffic Medium (UTM)
                </h3>
                <div className="mt-4 space-y-3">
                  {data.utmMediumStats.map((medium, index) => {
                    const percentage = (
                      (medium.count / data.overview.totalViews) *
                      100
                    ).toFixed(1);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {medium._id}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-24 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-pink-600"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {medium.count} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Views */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Views
          </h3>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Visitor Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Time on Page
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.recentViews.map((view, index) => {
                      // Helper function for visitor type badge
                      const getVisitorTypeBadge = (visitorType) => {
                        const colors = {
                          client: "bg-green-100 text-green-800",
                          internal: "bg-blue-100 text-blue-800",
                          partner: "bg-purple-100 text-purple-800",
                          unknown: "bg-gray-100 text-gray-800",
                        };
                        return (
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colors[visitorType] || colors.unknown}`}
                          >
                            {visitorType || "unknown"}
                          </span>
                        );
                      };

                      return (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {formatDate(view.createdAt)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {getVisitorTypeBadge(view.visitorType)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            <div>
                              {view.utmSource && (
                                <div className="text-xs text-blue-600">
                                  {view.utmSource}
                                  {view.utmMedium && ` / ${view.utmMedium}`}
                                </div>
                              )}
                              {view.utmCampaign && (
                                <div className="text-xs text-gray-500">
                                  {view.utmCampaign}
                                </div>
                              )}
                              {!view.utmSource &&
                                !view.utmMedium &&
                                !view.utmCampaign && (
                                  <span className="text-gray-400">Direct</span>
                                )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-900">
                            {view.deviceType} / {view.browser}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                            {formatDuration(view.timeOnPage)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
