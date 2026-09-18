import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/libs/next-auth";
import { formCollections } from "@/libs/formStore";
export const dynamic = "force-dynamic";
export default async function FormReviewPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") redirect("/auth/signin");
  const { reviews } = await formCollections();
  const rows = await reviews
    .find({ expiresAt: { $gt: new Date() } })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Form review</h1>
      <p>
        These submissions were held before account creation, lead creation or
        email sending. Review genuine enquiries and follow up manually; for
        genuine sign-ups, ask the person to resubmit without links in their
        name. Entries expire after 30 days. Passwords are never retained.
      </p>
      {!rows.length && <p>No submissions awaiting review.</p>}
      {rows.map((row) => (
        <article
          key={row._id}
          className="space-y-2 rounded border bg-white p-4"
        >
          <h2 className="font-semibold">
            {row.purpose} — {row.reason}
          </h2>
          <p className="text-sm">{row.createdAt.toISOString()}</p>
          <dl>
            {Object.entries(row.payload).map(([key, value]) => (
              <div
                key={key}
                className="grid gap-2 border-t py-2 sm:grid-cols-[160px_1fr]"
              >
                <dt className="font-medium">{key}</dt>
                <dd className="whitespace-pre-wrap break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </main>
  );
}
