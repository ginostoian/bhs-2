import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import AddDocumentForm from "./components/AddDocumentForm";

/**
 * Add Document Page
 * Allows admins to create documents for users
 */
export default async function AddDocumentPage() {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all users for the dropdown and convert to plain objects
  const users = await User.find(
    {},
    {
      email: 1,
      name: 1,
      role: 1,
      projectStatus: 1,
    },
  )
    .sort({ name: 1 })
    .lean()
    .then((users) =>
      users.map((user) => ({
        ...user,
        id: user._id.toString(),
        _id: undefined,
      })),
    );

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Add Document</h2>
        <p className="text-gray-600">
          Create quotes, invoices, comments, or photos for users
        </p>
      </div>

      <AddDocumentForm users={users} />
    </div>
  );
}
