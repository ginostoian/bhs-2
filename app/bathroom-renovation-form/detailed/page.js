import DetailedBathroomForm from "./components/DetailedBathroomForm";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Detailed Bathroom Renovation Quote - Better Homes",
  description:
    "Provide detailed information about your bathroom renovation project for a more accurate quote.",
};

export default function DetailedBathroomFormPage() {
  return <DetailedBathroomForm />;
}
