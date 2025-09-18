import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import mongoose from "mongoose";
import Moodboard from "@/models/Moodboard";
import MoodboardSection from "@/models/MoodboardSection";
import MoodboardProduct from "@/models/MoodboardProduct";
import Product from "@/models/Product";
import DesignerMoodboardManager from "./components/DesignerMoodboardManager";

/**
 * Designer Individual Moodboard Page
 * Manages a specific moodboard with sections and products
 */
export default async function DesignerMoodboardPage({ params }) {
  // Get designer session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch moodboard with user data
  const moodboard = await Moodboard.findById(params.id)
    .populate("user", "name email projectStatus")
    .lean();

  if (!moodboard) {
    redirect("/designer/moodboards");
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

  // Fetch sections with products using aggregation
  let sections = [];
  try {
    sections = await MoodboardSection.aggregate([
      { $match: { moodboard: new mongoose.Types.ObjectId(params.id) } },
      {
        $lookup: {
          from: "moodboardproducts",
          localField: "_id",
          foreignField: "section",
          as: "products",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $addFields: {
          products: {
            $map: {
              input: "$products",
              as: "product",
              in: {
                $mergeObjects: [
                  "$$product",
                  {
                    product: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$productDetails",
                            cond: { $eq: ["$$this._id", "$$product.product"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $sort: { order: 1 } },
    ]);
  } catch (error) {
    console.error("Error fetching sections:", error);
  }

  // Convert sections to plain objects
  const sectionsData = sections.map((section) => ({
    ...section,
    id: section._id.toString(),
    _id: undefined,
    products: section.products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: undefined,
      product: product.product
        ? {
            ...product.product,
            id: product.product._id.toString(),
            _id: undefined,
          }
        : null,
    })),
  }));

  // Fetch all products for the product selector
  const allProducts = await Product.find({ isActive: true })
    .sort({ name: 1 })
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        _id: undefined,
      })),
    );

  // Get categories and suppliers for filters
  const categories = await Product.getCategories();
  const suppliers = await Product.getSuppliers();

  return (
    <DesignerMoodboardManager
      moodboard={moodboardData}
      sections={sectionsData}
      allProducts={allProducts}
      categories={categories}
      suppliers={suppliers}
    />
  );
}
