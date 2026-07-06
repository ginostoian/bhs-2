import RatesEditor from "./components/RatesEditor";

export const metadata = {
  title: "Renovation Calculator Rates - Admin",
  description: "Edit the price book used by the home renovation cost calculator",
};

export default function RenovationCalculatorRatesPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Renovation Calculator Rates
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          Edit the labour, construction-material and fittings rates, multipliers, preliminaries,
          fees, contingency and VAT used by the public renovation calculator. Changes are saved
          as overrides on top of the built-in defaults and take effect immediately (cached for up
          to 5 minutes on the public page). Use{" "}
          <span className="font-semibold">Reset all to defaults</span> to clear every override.
        </p>
      </div>

      <RatesEditor />
    </div>
  );
}
