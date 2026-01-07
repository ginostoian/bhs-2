import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import PhotoSlideshow from "../components/PhotoSlideshow";
import { cookies } from "next/headers";

/**
 * Photos Dashboard Page
 * Displays user's project photos in a slideshow format
 */
export default async function PhotosPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Get selected project from cookies
  const cookieStore = cookies();
  const selectedProjectId = cookieStore.get("selectedProjectId")?.value;

  // Fetch user's photos and convert to plain objects
  const query = {
    user: session.user.id,
    type: "photo",
  };

  if (selectedProjectId) {
    query.project = selectedProjectId;
  }

  const photos = await Document.find(query)
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
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Project Photos
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              View photos from your renovation project in a slideshow format
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-gradient-to-r from-orange-50 to-red-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-600">
                    Total Photos
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {photos.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <PhotoSlideshow photos={photos} />
      </div>
    </div>
  );
}
