import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { Archive, FilePlus2 } from "lucide-react";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import DocumentList from "../components/DocumentList";
import {
  ClientEmptyState,
  ClientPageHeader,
  ClientPrimaryLink,
} from "@/components/client-portal/ClientPage";

export default async function QuoteArchivePage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const selectedProjectId = cookies().get("selectedProjectId")?.value;
  const query = { user: session.user.id, type: "quote" };
  if (selectedProjectId) query.project = selectedProjectId;

  const quotes = await Document.find(query)
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .lean()
    .then((documents) =>
      documents.map((document) => ({
        ...document,
        id: document._id.toString(),
        _id: undefined,
        user: document.user
          ? {
              ...document.user,
              id: document.user._id.toString(),
              _id: undefined,
            }
          : document.user,
      })),
    );

  return (
    <div>
      <ClientPageHeader
        title="Quote archive"
        description="Your earlier quote records remain available here exactly as before."
        meta={{ label: "Archived quotes", value: quotes.length }}
      />
      {quotes.length ? (
        <DocumentList documents={quotes} type="quote" />
      ) : (
        <ClientEmptyState
          icon={Archive}
          title="No archived quotes"
          description="Older quote documents linked to this project will appear here."
          action={
            <ClientPrimaryLink href="/dashboard/request-quote">
              <FilePlus2 aria-hidden="true" className="h-4 w-4" />
              Request a quote
            </ClientPrimaryLink>
          }
        />
      )}
    </div>
  );
}
