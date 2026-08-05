import RequestQuoteForm from "./components/RequestQuoteForm";
import { ClientPageHeader } from "@/components/client-portal/ClientPage";

export default function RequestQuotePage() {
  return (
    <div>
      <ClientPageHeader
        title="Request a quote"
        description="Tell us about the work you have in mind and our team will prepare a detailed response."
      />
      <RequestQuoteForm />
    </div>
  );
}
