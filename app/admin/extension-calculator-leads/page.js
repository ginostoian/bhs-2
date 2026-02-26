import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";

export const metadata = {
  title: "Extension Calculator Leads - Admin",
  description: "View leads captured through the extension cost calculator",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ExtensionCalculatorLeadsPage() {
  await connectMongoose();

  const leads = await Lead.find({
    source: "Other",
    customSource: "Extension Calculator",
    isActive: true,
    isArchived: false,
  })
    .select("name email stage value budget createdAt updatedAt calculatorData")
    .sort({ updatedAt: -1 })
    .limit(200)
    .lean();

  const rows = leads.map((lead) => {
    const latest = lead.calculatorData?.latestSubmission || {};
    const input = latest.input || {};
    const estimate = latest.estimate || {};
    const emailDelivery = latest.emailDelivery || {};

    return {
      ...lead,
      latest,
      input,
      estimate,
      emailDelivery,
    };
  });

  const total = rows.length;
  const emailed = rows.filter((row) => row.emailDelivery?.sent).length;
  const london = rows.filter((row) => row.input?.region === "london").length;
  const avgExpected =
    rows
      .map((row) => row.estimate?.ranges?.expected || row.estimate?.total || 0)
      .filter(Boolean)
      .reduce((a, b) => a + b, 0) / (rows.filter((row) => row.estimate?.ranges?.expected || row.estimate?.total).length || 1);

  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Extension Calculator Leads
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Leads captured from the extension cost calculator, including the latest
          estimate, key inputs, and PDF email delivery status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Stat label="Leads shown" value={String(total)} />
        <Stat label="PDF emailed" value={`${emailed}/${total || 0}`} />
        <Stat label="London leads" value={`${london}/${total || 0}`} />
        <Stat
          label="Avg expected budget"
          value={total > 0 ? formatCurrency(avgExpected) : "—"}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <HeaderCell>Lead</HeaderCell>
                <HeaderCell>Project</HeaderCell>
                <HeaderCell>Region</HeaderCell>
                <HeaderCell>Expected</HeaderCell>
                <HeaderCell>Range</HeaderCell>
                <HeaderCell>PDF Email</HeaderCell>
                <HeaderCell>Updated</HeaderCell>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {rows.map((row) => {
                const expected =
                  row.estimate?.ranges?.expected || row.estimate?.total || 0;
                const low = row.estimate?.ranges?.low || 0;
                const high = row.estimate?.ranges?.high || 0;

                return (
                  <tr key={String(row._id)} className="align-top hover:bg-gray-50/70">
                    <Cell>
                      <div className="font-semibold text-gray-900">
                        {row.name || "Unnamed lead"}
                      </div>
                      <a
                        href={`mailto:${row.email}`}
                        className="mt-1 block text-sm text-blue-600 hover:text-blue-700"
                      >
                        {row.email}
                      </a>
                      <div className="mt-1 text-xs text-gray-500">
                        CRM stage: {row.stage} • Budget band: {row.budget || "—"}
                      </div>
                    </Cell>

                    <Cell>
                      <div className="text-sm font-medium text-gray-900">
                        {prettyExtensionType(row.input?.extensionType)}
                      </div>
                      <div className="mt-1 text-xs text-gray-600">
                        {row.input?.size ? `${row.input.size} m²` : "—"} •{" "}
                        {prettyValue(row.input?.propertyType)}
                      </div>
                      <details className="mt-2 text-xs">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                          View inputs
                        </summary>
                        <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2 text-gray-700">
                          <div>Complexity: {prettyValue(row.input?.complexity)}</div>
                          <div>Finish: {prettyValue(row.input?.finishLevel)}</div>
                          <div>Access: {prettyValue(row.input?.siteAccess)}</div>
                          <div>Glazing: {prettyValue(row.input?.glazingLevel)}</div>
                          <div>Drawings: {prettyValue(row.input?.drawingsStatus)}</div>
                          <div>Planning: {prettyValue(row.input?.planningStatus)}</div>
                        </div>
                      </details>
                    </Cell>

                    <Cell>
                      <div className="text-sm text-gray-900">
                        {prettyRegion(row.input?.region)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {row.input?.region === "london"
                          ? `Zone: ${prettyValue(row.input?.londonZone)}`
                          : "Non-London"}
                      </div>
                      {row.input?.postcode && (
                        <div className="mt-1 text-xs text-gray-500">
                          {row.input.postcode}
                        </div>
                      )}
                    </Cell>

                    <Cell>
                      <div className="font-semibold text-gray-900">
                        {expected ? formatCurrency(expected) : "—"}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Confidence: {row.estimate?.confidenceScore || "—"}
                      </div>
                    </Cell>

                    <Cell>
                      {low && high ? (
                        <>
                          <div className="text-sm text-gray-900">
                            {formatCurrency(low)} - {formatCurrency(high)}
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {row.estimate?.costPerSqm
                              ? `${formatCurrency(row.estimate.costPerSqm)}/m²`
                              : ""}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </Cell>

                    <Cell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          row.emailDelivery?.sent
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {row.emailDelivery?.sent ? "Sent" : "Not confirmed"}
                      </span>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatDate(row.emailDelivery?.attemptedAt)}
                      </div>
                      {row.emailDelivery?.error && (
                        <details className="mt-1 text-xs">
                          <summary className="cursor-pointer text-red-600">
                            Error
                          </summary>
                          <div className="mt-1 rounded bg-red-50 p-2 text-red-700">
                            {row.emailDelivery.error}
                          </div>
                        </details>
                      )}
                    </Cell>

                    <Cell>
                      <div className="text-sm text-gray-900">{formatDate(row.updatedAt)}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        Created: {formatDate(row.createdAt)}
                      </div>
                    </Cell>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No extension calculator leads found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
        {label}
      </div>
      <div className="mt-2 text-xl font-bold tracking-tight text-gray-900">
        {value}
      </div>
    </div>
  );
}

function HeaderCell({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
      {children}
    </th>
  );
}

function Cell({ children }) {
  return <td className="px-4 py-4">{children}</td>;
}

function prettyValue(value) {
  if (!value) return "—";
  return String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function prettyExtensionType(value) {
  return (
    {
      singleStorey: "Single-storey extension",
      doubleStorey: "Double-storey extension",
      basement: "Basement extension",
      loft: "Loft conversion",
    }[value] || prettyValue(value)
  );
}

function prettyRegion(value) {
  return (
    {
      london: "London",
      southEast: "South East",
      eastEngland: "East of England",
      southWest: "South West",
      midlands: "Midlands",
      northEngland: "North of England",
      scotlandWales: "Scotland / Wales",
    }[value] || prettyValue(value)
  );
}
