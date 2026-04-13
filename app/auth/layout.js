import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Sign In | Better Homes",
  description: "Secure account access for Better Homes clients and team members.",
  canonicalUrlRelative: "/auth/signin",
  extraTags: {
    robots: {
      index: false,
      follow: true,
    },
  },
});

export default function AuthLayout({ children }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
