import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import PhotoSlideshow from "../components/PhotoSlideshow";

/**
 * Photos Dashboard Page
 * Displays user's project photos in a slideshow format
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
          View photos from your renovation project in a slideshow format
        </p>
      </div>

      <PhotoSlideshow photos={photos} />
    </div>
  );
}
