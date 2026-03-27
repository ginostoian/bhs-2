import { notFound } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import Product from "@/models/Product";
import { serializeCatalogueProduct } from "@/libs/catalogue";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  await connectMongoose();

  const product =
    (await Product.findOne({
      slug: params.slug,
      isActive: true,
      catalogueEnabled: true,
    }).lean()) ||
    (await Product.findOne({
      _id: params.slug,
      isActive: true,
      catalogueEnabled: true,
    }).lean().catch(() => null));

  if (!product) {
    return {
      title: "Product Not Found | Better Homes Studio",
    };
  }

  return {
    title: `${product.name} | Better Homes Studio Catalogue`,
    description:
      product.description ||
      `Browse details, finishes, and pricing for ${product.name}.`,
  };
}

export default async function CatalogueProductPage({ params }) {
  await connectMongoose();

  const rawProduct =
    (await Product.findOne({
      slug: params.slug,
      isActive: true,
      catalogueEnabled: true,
    }).lean()) ||
    (await Product.findOne({
      _id: params.slug,
      isActive: true,
      catalogueEnabled: true,
    }).lean().catch(() => null));

  if (!rawProduct) {
    notFound();
  }

  const product = serializeCatalogueProduct(rawProduct);

  return <ProductDetailClient product={product} />;
}
