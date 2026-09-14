"use client";
import useSWR from "swr";
import apiClient from "@/libs/api";
export default function OrganicAttribution({ days }) {
  const { data, error, isLoading } = useSWR(
    `/crm/organic-attribution?dateRange=${days}`,
    (url) => apiClient.get(url),
  );
  return (
    <section className="m-4 rounded-xl border border-slate-200 bg-white p-5 sm:m-6">
      <h2 className="text-lg font-semibold">
        Organic landing pages and enquiries
      </h2>
      <p className="my-2 text-sm text-slate-600">
        All website enquiries in the selected period, independent of the
        agent/source filters above. Sessions and qualified-enquiry conversion
        rate are unavailable until analytics is connected. Search Console clicks
        are a separate measure.
      </p>
      {error ? (
        <p role="alert">Attribution report unavailable.</p>
      ) : isLoading ? (
        <p>Loading attribution…</p>
      ) : (
        <>
          <p className="my-3 text-sm">
            Accepted enquiries: {data?.acceptedEnquiries ?? 0} · Organic:{" "}
            {data?.organicEnquiries ?? 0} · Direct/unknown:{" "}
            {data?.directOrUnknownEnquiries ?? 0} · Confirmed bookings:{" "}
            {data?.confirmedBookings ?? 0}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  {[
                    "Landing page",
                    "Enquiries",
                    "Leads",
                    "Qualified",
                    "Quoted",
                    "Bookings",
                    "Won",
                    "Won value",
                  ].map((x) => (
                    <th key={x} className="p-2">
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data?.rows || []).map((row) => (
                  <tr key={row.path}>
                    {[
                      row.path,
                      row.enquiries,
                      row.leads,
                      row.qualifiedLeads,
                      row.quotes,
                      row.confirmedBookings,
                      row.wonProjects,
                      `£${row.wonValue.toLocaleString("en-GB")}`,
                    ].map((value, i) => (
                      <td key={i} className="border-t p-2">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!data?.rows?.length ? (
            <p className="my-3 text-sm">
              No attributed organic enquiries in this period. Historical
              attribution is not inferred.
            </p>
          ) : null}
          <p className="mt-3 text-xs text-slate-500">{data?.basis}</p>
        </>
      )}
    </section>
  );
}
