import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { ReceiptText } from "lucide-react";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Invoice from "@/models/Invoice";
import UserInvoicesList from "./components/UserInvoicesList";
import {
  ClientEmptyState,
  ClientPageHeader,
} from "@/components/client-portal/ClientPage";

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const selectedProjectId = cookies().get("selectedProjectId")?.value;
  const query = {
    linkedUser: session.user.id,
    status: { $ne: "draft" },
  };
  if (selectedProjectId) query.project = selectedProjectId;

  const invoices = await Invoice.find(query)
    .sort({ createdAt: -1 })
    .lean()
    .then((documents) =>
      documents.map((document) => ({
        ...document,
        id: document._id.toString(),
        _id: undefined,
      })),
    );

  return (
    <div>
      <ClientPageHeader
        title="Invoices"
        description="View the invoices issued for your selected renovation project."
        meta={{ label: "Total invoices", value: invoices.length }}
      />
      {invoices.length ? (
        <UserInvoicesList invoices={invoices} />
      ) : (
        <ClientEmptyState
          icon={ReceiptText}
          title="No invoices yet"
          description="Your invoices will appear here once they are sent to you by Better Homes."
        />
      )}
    </div>
  );
}
