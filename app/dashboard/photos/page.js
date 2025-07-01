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

  // Fetch user's photos
  const photos = await Document.find({
    user: session.user.id,
    type: "photo",
  })
    .sort({ createdAt: -1 })
    .populate("user", "name email");

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
