"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function AdminCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );

      const response = await fetch(
        `/api/calendar?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&type=all`,
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Calendar events received:", data.events);
        // Debug: Log the first few events to see their date structure
        if (data.events && data.events.length > 0) {
          console.log(
            "Sample event dates:",
            data.events.slice(0, 3).map((event) => ({
              title: event.title,
              scheduledDate: event.scheduledDate,
              createdAt: event.createdAt,
              date: event.date,
              start: event.start,
            })),
          );
        }
        setEvents(data.events || []);
      } else {
        toast.error("Failed to fetch calendar events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch calendar events");
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];

    try {
      // Use local date string to avoid timezone issues
      const dateStr = date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
      return events.filter((event) => {
        try {
          // Handle different date formats from the API
          let eventDate;
          if (event.start) {
            eventDate = new Date(event.start);
          } else if (event.date) {
            eventDate = new Date(event.date);
          } else if (event.createdAt) {
            eventDate = new Date(event.createdAt);
          } else if (event.scheduledDate) {
            eventDate = new Date(event.scheduledDate);
          } else {
            return false;
          }

          // Check if the date is valid
          if (isNaN(eventDate.getTime())) {
            return false;
          }

          // Use local date string for comparison
          const eventDateStr = eventDate.toLocaleDateString("en-CA");
          return eventDateStr === dateStr;
        } catch (error) {
          console.error("Error parsing event date:", error, event);
          return false;
        }
      });
    } catch (error) {
      console.error("Error in getEventsForDate:", error);
      return [];
    }
  };

  const formatDate = (date) => {
    try {
      // Handle null, undefined, or empty values
      if (!date || date === "" || date === "null" || date === "undefined") {
        return "No date set";
      }

      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date value:", date);
        return "Invalid Date";
      }

      return dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return "Invalid Date";
    }
  };

  const getEventColor = (event) => {
    if (event.type === "ticket") {
      switch (event.status) {
        case "New":
          return "bg-blue-100 text-blue-800";
        case "In Progress":
          return "bg-yellow-100 text-yellow-800";
        case "Resolved":
          return "bg-green-100 text-green-800";
        case "Closed":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else if (event.type === "project") {
      switch (event.status) {
        case "Planning":
          return "bg-purple-100 text-purple-800";
        case "On Going":
          return "bg-orange-100 text-orange-800";
        case "Completed":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
    return "bg-gray-100 text-gray-800";
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-100 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Calendar
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage your schedule
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h2 className="px-4 text-xl font-medium text-gray-900">
                  {monthName}
                </h2>
                <button
                  onClick={() => navigateMonth("next")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50"
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={goToToday}
                  className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Today
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
              <p className="mt-3 text-sm text-gray-500">
                Loading calendar events...
              </p>
            </div>
          ) : (
            <>
              {/* Calendar Grid */}
              <div className="p-8">
                <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-gray-200">
                  {/* Day headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="bg-gray-50 p-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600"
                      >
                        {day}
                      </div>
                    ),
                  )}

                  {/* Calendar days */}
                  {days.map((day, index) => {
                    const isToday =
                      day && day.toDateString() === new Date().toDateString();
                    const isCurrentMonth =
                      day && day.getMonth() === currentDate.getMonth();
                    return (
                      <div
                        key={index}
                        className={`min-h-[140px] bg-white p-3 ${
                          !day ? "bg-gray-50" : ""
                        }`}
                      >
                        {day && (
                          <>
                            <div
                              className={`mb-2 text-sm font-medium ${
                                isToday
                                  ? "flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white"
                                  : isCurrentMonth
                                    ? "text-gray-900"
                                    : "text-gray-400"
                              }`}
                            >
                              {day.getDate()}
                            </div>
                            <div className="space-y-1">
                              {getEventsForDate(day)
                                .slice(0, 3)
                                .map((event, eventIndex) => (
                                  <div
                                    key={eventIndex}
                                    className={`truncate rounded px-2 py-1 text-xs font-medium ${getEventColor(event)}`}
                                    title={`${event.title} - ${formatDate(event.date || event.createdAt || event.scheduledDate)}`}
                                  >
                                    {event.title}
                                  </div>
                                ))}
                              {getEventsForDate(day).length > 3 && (
                                <div className="text-xs font-medium text-gray-400">
                                  +{getEventsForDate(day).length - 3} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Events List */}
              <div className="border-t border-gray-100 px-8 py-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  All Events
                </h3>
                <div className="space-y-3">
                  {events.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">
                        No events found for this month
                      </p>
                    </div>
                  ) : (
                    events.map((event, index) => (
                      <div
                        key={index}
                        className={`rounded-lg border border-gray-100 p-4 ${getEventColor(event)} transition-shadow duration-200 hover:shadow-sm`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {event.title}
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {(() => {
                                // Try to find the best date to display
                                const eventDate =
                                  event.scheduledDate ||
                                  event.date ||
                                  event.createdAt ||
                                  event.start;
                                if (!eventDate) {
                                  return "No date set";
                                }
                                return formatDate(eventDate);
                              })()}
                            </p>
                            {event.type && (
                              <span className="mt-2 inline-block rounded-full bg-white bg-opacity-70 px-3 py-1 text-xs font-medium text-gray-700">
                                {event.type}
                              </span>
                            )}
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {event.status}
                            </p>
                            {event.type === "ticket" && event.ticketNumber && (
                              <p className="mt-1 text-xs text-gray-500">
                                {event.ticketNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
