import RatesEditor from "../renovation-calculator-rates/components/RatesEditor";

export const metadata = {
  title: "Kitchen Calculator Rates - Admin",
  description: "Edit the price book used by the kitchen cost calculator",
};

export default function KitchenCalculatorRatesPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Kitchen Calculator Rates</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          Edit the rates used by the kitchen renovation calculator: cabinetry per linear metre, appliance packages, worktops, labour and fees. Changes are saved as overrides on top of the built-in
          defaults and reach the public calculator within 5 minutes. Use{" "}
          <span className="font-semibold">Reset all to defaults</span> to clear every override.
        </p>
      </div>

      <RatesEditor calculatorType="kitchen" />
    </div>
  );
}
