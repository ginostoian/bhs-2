import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Product from "@/models/Product";
import DesignerProductsClient from "./components/DesignerProductsClient";

/**
 * Designer Products Page
 * Manages the global product catalog
 */
export default async function DesignerProductsPage() {
  // Get designer session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all products and convert to plain objects
  const products = await Product.find({})
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
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Product Database
        </h2>
        <p className="text-gray-600">
          Manage the global product catalog for moodboards
        </p>
      </div>

      <DesignerProductsClient
        products={products}
        categories={categories}
        suppliers={suppliers}
      />
    </div>
  );
}
