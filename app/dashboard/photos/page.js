import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import DocumentList from "../components/DocumentList";

/**
 * Photos Dashboard Page
 * Displays user's project photos
 */
export default async function PhotosPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch user's photos and convert to plain objects
  const photos = await Document.find({
    user: session.user.id,
    type: "photo",
  })
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        _id: undefined,
        user: doc.user
          ? {
              ...doc.user,
              id: doc.user._id.toString(),
              _id: undefined,
            }
          : doc.user,
      })),
    );

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Project Photos
        </h2>
        <p className="text-gray-600">
          View photos from your renovation project
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📸</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No photos yet
          </h3>
          <p className="text-gray-600">
            Project photos will be added here by our team as work progresses.
          </p>
        </div>
      ) : (
        <DocumentList documents={photos} type="photo" />
      )}
    </div>
  );
}
