import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Moodboard from "@/models/Moodboard";
import MoodboardSection from "@/models/MoodboardSection";
import MoodboardView from "./components/MoodboardView";

/**
 * Individual Moodboard Page
 * Displays a specific moodboard with sections and products
 */
export default async function MoodboardPage({ params }) {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch moodboard with sections and products
  const moodboard = await Moodboard.findById(params.id)
    .populate("user", "name email")
    .lean();

  if (!moodboard) {
    redirect("/dashboard/moodboards");
  }

  // Check if user owns this moodboard
  if (moodboard.user._id.toString() !== session.user.id) {
    redirect("/dashboard/moodboards");
  }

  // Convert to plain object
  const moodboardData = {
    ...moodboard,
    id: moodboard._id.toString(),
    _id: undefined,
    user: {
      ...moodboard.user,
      id: moodboard.user._id.toString(),
      _id: undefined,
    },
  };

  // Fetch sections with products using the same approach as admin
  const sections = await MoodboardSection.aggregate([
    { $match: { moodboard: moodboard._id, isActive: true } },
    {
      $lookup: {
        from: "moodboardproducts",
        localField: "_id",
        foreignField: "section",
        as: "products",
      },
    },
    { $unwind: { path: "$products", preserveNullAndEmptyArrays: true } },
    { $match: { "products.isActive": { $ne: false } } },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "products.productData",
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        description: { $first: "$description" },
        color: { $first: "$color" },
        icon: { $first: "$icon" },
        order: { $first: "$order" },
        isCollapsed: { $first: "$isCollapsed" },
        notes: { $first: "$notes" },
        products: { $push: "$products" },
      },
    },
    { $sort: { order: 1 } },
  ]);

  // Process sections data with null safety
  const sectionsData = sections
    .filter((section) => section && section._id) // Filter out any undefined sections
    .map((section) => ({
      id: section._id?.toString() || "",
      name: section.name || "",
      description: section.description || "",
      color: section.color || "#3B82F6",
      icon: section.icon || "📋",
      order: section.order || 0,
      isCollapsed: section.isCollapsed || false,
      notes: section.notes || "",
      products: (section.products || [])
        .filter(
          (product) => product && product._id && product.isActive !== false,
        )
        .map((product) => ({
          id: product._id?.toString() || "",
          quantity: product.quantity || 1,
          approvalStatus: product.approvalStatus || "pending",
          userComment: product.userComment || "",
          adminComment: product.adminComment || "",
          order: product.order || 0,
          customPrice: product.customPrice || null,
          notes: product.notes || "",
          product: product.productData?.[0]
            ? {
                id: product.productData[0]._id?.toString() || "",
                name: product.productData[0].name || "",
                description: product.productData[0].description || "",
                imageUrl: product.productData[0].imageUrl || "",
                productUrl: product.productData[0].productUrl || "",
                price: product.productData[0].price || 0,
                supplier: product.productData[0].supplier || "",
                category: product.productData[0].category || "",
              }
            : null,
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
    }));

  return <MoodboardView moodboard={moodboardData} sections={sectionsData} />;
}
