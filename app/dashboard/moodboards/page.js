import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { Paintbrush } from "lucide-react";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Moodboard from "@/models/Moodboard";
import MoodboardsList from "./components/MoodboardsList";
import {
  ClientEmptyState,
  ClientPageHeader,
} from "@/components/client-portal/ClientPage";

export default async function MoodboardsPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const selectedProjectId = cookies().get("selectedProjectId")?.value;
  const query = { user: session.user.id, isActive: true };
  if (selectedProjectId) {
    // Unassigned moodboards belong to the customer across project selections.
    // MongoDB's null match also includes older records without a project field.
    query.$or = [{ project: selectedProjectId }, { project: null }];
  }

  const moodboards = await Moodboard.find(query)
    .sort({ updatedAt: -1 })
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
        title="Moodboards"
        description="Review product selections, compare options and record your approvals."
        meta={{ label: "Total moodboards", value: moodboards.length }}
      />
      {moodboards.length ? (
        <MoodboardsList moodboards={moodboards} />
      ) : (
        <ClientEmptyState
          icon={Paintbrush}
          title="No moodboards yet"
          description="Your moodboards will appear here once they are created by our team."
        />
      )}
    </div>
  );
}
