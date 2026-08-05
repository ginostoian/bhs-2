import TicketForm from "@/components/TicketForm";
import { ClientPageHeader } from "@/components/client-portal/ClientPage";

export default function NewTicketPage() {
  return (
    <div>
      <ClientPageHeader
        title="New support ticket"
        description="Tell us what you need help with and include any useful photos or documents."
      />
      <TicketForm />
    </div>
  );
}
