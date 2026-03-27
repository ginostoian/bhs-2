import { notFound } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import CatalogueShare from "@/models/CatalogueShare";
import { formatCurrency } from "@/libs/catalogue";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  return {
    title: `Shared Catalogue Selection | Better Homes Studio`,
    description: `Review a shared Better Homes Studio catalogue selection.`,
  };
}

export default async function CatalogueSharePage({ params }) {
  await connectMongoose();

  const share = await CatalogueShare.findOne({ token: params.token }).lean();
  if (!share) {
    notFound();
  }

  return (
    <main className="bg-[linear-gradient(180deg,#fafaf9_0%,#f5f5f4_100%)]">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-[0_32px_120px_rgba(28,25,23,0.12)] backdrop-blur sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
            Shared product basket
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">
            Saved catalogue shortlist
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
            Review the selected products, chosen finishes, sizing choices, and
            indicative totals. This is a reference list only, with no checkout.
          </p>

          <div className="mt-8 grid gap-4 rounded-[2rem] bg-stone-900 p-5 text-white sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Items</p>
              <p className="mt-2 text-3xl font-semibold">{share.itemCount}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Estimated total</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(share.totalPrice)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Created</p>
              <p className="mt-2 text-lg font-semibold">
                {new Date(share.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {share.items.map((item) => (
            <article
              key={`${item.productId}:${item.variantId}`}
              className="grid gap-4 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-[0_20px_80px_rgba(28,25,23,0.08)] sm:grid-cols-[180px_minmax(0,1fr)]"
            >
              <div className="aspect-square overflow-hidden rounded-[1.5rem] bg-stone-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                      {item.brand || item.catalogueCategory}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-stone-900">
                      {item.name}
                    </h2>
                    <p className="mt-2 text-sm text-stone-600">
                      {[item.productType, item.color, item.size, item.finish]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                      Total
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-stone-900">
                      {formatCurrency(item.linePrice)}
                    </p>
                    <p className="text-sm text-stone-500">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.sku ? (
                    <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-600">
                      SKU: {item.sku}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-600">
                    {item.stockStatus === "out_of_stock" ? "Out of stock" : "Available"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
