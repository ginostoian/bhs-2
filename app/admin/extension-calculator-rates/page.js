import RatesEditor from "../renovation-calculator-rates/components/RatesEditor";

export const metadata = {
  title: "Extension Calculator Rates - Admin",
  description: "Edit the price book used by the house extension cost calculator",
};

export default function ExtensionCalculatorRatesPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Extension Calculator Rates
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          Edit the per-m² base build rates (labour / materials / fittings), multipliers, optional
          extras, planning &amp; professional fees, contingency and VAT used by the public
          extension calculator. Changes are saved as overrides on top of the built-in defaults and
          take effect immediately (cached for up to 5 minutes on the public page). Use{" "}
          <span className="font-semibold">Reset all to defaults</span> to clear every override.
        </p>
      </div>

      <RatesEditor calculatorType="extension" />
    </div>
  );
}
