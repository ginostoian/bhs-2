import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import PhotoSlideshow from "../components/PhotoSlideshow";
import { ClientPageHeader } from "@/components/client-portal/ClientPage";

export default async function PhotosPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();

  const selectedProjectId = cookies().get("selectedProjectId")?.value;
  const query = { user: session.user.id, type: "photo" };
  if (selectedProjectId) query.project = selectedProjectId;

  const photos = await Document.find(query)
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
        title="Project photos"
        description="Follow the work through the photos shared for your selected project."
        meta={{ label: "Total photos", value: photos.length }}
      />
      <PhotoSlideshow photos={photos} />
    </div>
  );
}
