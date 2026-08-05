import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { ProjectChange } from "@/models/index.js";
import UserChangesClient from "./components/UserChangesClient";
import { ClientPageHeader } from "@/components/client-portal/ClientPage";

export default async function UserChangesPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const changes = await ProjectChange.find({ user: session.user.id })
    .sort({ order: 1 })
    .populate("project", "name")
    .populate("decidedBy", "name")
    .lean()
    .then((documents) =>
      documents.map((document) => ({
        id: document._id.toString(),
        project: document.project
          ? {
              id: document.project._id.toString(),
              name: document.project.name,
            }
          : null,
        changeNumber: document.changeNumber,
        name: document.name,
        description: document.description,
        cost: document.cost,
        status: document.status,
        includedInPaymentPlan: document.includedInPaymentPlan,
        type: document.type,
        order: document.order,
        adminNotes: document.adminNotes,
        requestedDate: document.requestedDate,
        decisionDate: document.decisionDate,
        decidedBy: document.decidedBy
          ? {
              id: document.decidedBy._id.toString(),
              name: document.decidedBy.name,
            }
          : null,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      })),
    );

  return (
    <div>
      <ClientPageHeader
        title="Project changes"
        description="Review the scope and cost of requested changes, then record your decision."
        meta={{ label: "Total changes", value: changes.length }}
      />
      <UserChangesClient changes={changes} />
    </div>
  );
}
