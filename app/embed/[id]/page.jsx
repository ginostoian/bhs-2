import { notFound } from "next/navigation";
import CalculatorApp from "@/components/calculators/CalculatorApp";
import { CALCULATOR_IDS, getCalculator } from "@/libs/calculators/registry";

export function generateStaticParams() {
  return CALCULATOR_IDS.map((id) => ({ id }));
}

export function generateMetadata({ params }) {
  const calc = getCalculator(params.id);
  return {
    title: calc ? `${calc.name.replace(/^./, (c) => c.toUpperCase())} | Better Homes` : "Calculator",
    robots: { index: false, follow: true },
    alternates: calc ? { canonical: `https://bhstudio.co.uk${calc.path}` } : undefined,
  };
}

// Bare calculator for other websites to embed with an iframe.
export default function EmbedPage({ params }) {
  if (!getCalculator(params.id)) notFound();
  return <CalculatorApp id={params.id} embed />;
}
