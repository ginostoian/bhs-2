import { getServerSession } from "next-auth/next";
import { FileText } from "lucide-react";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Quote from "@/models/Quote";
import UserQuotesList from "./components/UserQuotesList";
import {
  ClientEmptyState,
  ClientPageHeader,
} from "@/components/client-portal/ClientPage";

export default async function QuotesPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const quotes = await Quote.find({
    linkedUser: session.user.id,
    status: { $ne: "draft" },
  })
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
        title="Quotes"
        description="Review, track and download the quotes Better Homes has shared with you."
        meta={{ label: "Available quotes", value: quotes.length }}
      />
      {quotes.length ? (
        <UserQuotesList quotes={quotes} />
      ) : (
        <ClientEmptyState
          icon={FileText}
          title="No quotes yet"
          description="Your project quotes will appear here once they are created by Better Homes."
        />
      )}
    </div>
  );
}
