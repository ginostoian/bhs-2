import Breadcrumbs from "@/components/brand/Breadcrumbs";
import Faq from "@/components/brand/Faq";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Sign In | Better Homes",
  description:
    "Secure account access for Better Homes clients and team members.",
  canonicalUrlRelative: "/auth/signin",
  extraTags: {
    robots: {
      index: false,
      follow: true,
    },
  },
});

export default function AuthLayout({ children }) {
  return <div className="min-h-screen bg-white"><Breadcrumbs schema={false}/>{children}<Faq items={[{question:"Which email address should I use?",answer:"Use the email address connected to your Better Homes account or project invitation. If you cannot access that address, contact the team for help."},{question:"Where will I go after signing in?",answer:"Your account role determines which workspace you can access. Client, team and partner accounts retain their own project permissions."}]} /></div>;
}
