import { redirect } from "next/navigation";

// Old "coming soon" page: send straight to the generated PDF.
export default function PDFExportPage({ params }) {
  redirect(`/api/quotes/${params.id}/pdf`);
}
