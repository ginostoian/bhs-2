import TicketForm from "@/components/TicketForm";

export default function NewTicketPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Submit a New Ticket
            </h1>
            <p className="mt-2 text-gray-600">
              Create a support ticket for warranty claims, technical issues, or
              general inquiries.
            </p>
          </div>

          <TicketForm />
        </div>
      </div>
    </div>
  );
}
