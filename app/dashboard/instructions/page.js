import { getServerSession } from "next-auth/next";
import { MessageSquareText } from "lucide-react";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import InstructionForm from "./components/InstructionForm";
import {
  ClientEmptyState,
  ClientPageHeader,
} from "@/components/client-portal/ClientPage";

export default async function InstructionsPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const instructions = await Document.find({
    user: session.user.id,
    type: "comment",
  })
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
        title="Instructions & feedback"
        description="Keep project guidance and feedback in one shared record."
        meta={{ label: "Total entries", value: instructions.length }}
      />

      <div className="mb-8">
        <InstructionForm />
      </div>

      {instructions.length ? (
        <div className="divide-y divide-[#dedbd2] border-y border-[#dedbd2] bg-[#fbfaf7]">
          {instructions.map((instruction) => (
            <div key={instruction.id} className="px-5 py-5 sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173129] text-xs font-semibold text-white">
                  {instruction.user?.name?.charAt(0) ||
                    instruction.user?.email?.charAt(0) ||
                    "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 text-xs text-[#7c8682]">
                    {new Date(instruction.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </div>
                  <div className="text-sm leading-6 text-[#17231f]">
                    {instruction.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ClientEmptyState
          icon={MessageSquareText}
          title="No instructions yet"
          description="Add an instruction above to begin the shared project record."
        />
      )}
    </div>
  );
}
