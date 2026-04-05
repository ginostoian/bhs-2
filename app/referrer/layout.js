import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@/libs/next-auth";
import SignOutButton from "../dashboard/components/SignOutButton";

export default async function ReferrerLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?role=referrer&callbackUrl=/referrer");
  }

  if (session.user.role !== "referrer") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto min-h-screen max-w-[85%] pb-10 pt-10">
      <div className="mb-6 rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Referrer Dashboard
            </h1>
            <p className="text-gray-600">
              Track referred leads and share your personal referral link.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {session.user.name || session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}
