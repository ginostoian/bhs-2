import CatalogueClient from "./components/CatalogueClient";
import connectMongoose from "@/libs/mongoose";
import Product from "@/models/Product";
import {
  filterAndSortCatalogueProducts,
  getCatalogueFilterOptions,
  getCategoryCounts,
  serializeCatalogueProduct,
} from "@/libs/catalogue";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export const metadata = {
  title: "Product Catalogue | Better Homes Studio",
  description:
    "Browse bathroom, lighting, tile, flooring, and home products curated for Better Homes Studio projects.",
};

export default async function CataloguePage({ searchParams }) {
  await connectMongoose();

  const rawProducts = await Product.find({
    isActive: true,
    catalogueEnabled: true,
  })
    .sort({ updatedAt: -1 })
    .lean();

  const products = rawProducts.map(serializeCatalogueProduct);
  const filters = searchParams || {};
  const filteredProducts = filterAndSortCatalogueProducts(products, filters);

  const currentPage = Math.max(1, parseInt(filters.page || "1", 10));
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <CatalogueClient
      products={pageProducts}
      totalCount={filteredProducts.length}
      page={safePage}
      totalPages={totalPages}
      pageSize={PAGE_SIZE}
      filters={filters}
      filterOptions={getCatalogueFilterOptions(products)}
      categoryCards={getCategoryCounts(products)}
    />
  );
}
