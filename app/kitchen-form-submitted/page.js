import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
export const metadata = getSEOTags({
  title: "Kitchen Enquiry Submitted | Better Homes",
  description: "Your kitchen renovation enquiry has been submitted successfully.",
  canonicalUrlRelative: "/kitchen-form-submitted",
  extraTags: {
    robots: {
      index: false,
      follow: true,
    },
  },
});

export default function Page(){return <main className="bh-wrap bh-section"><p className="bh-eyebrow">Your enquiry</p><h1 className="bh-title">Thank you. We will be in touch.</h1><p className="bh-lead">Your enquiry has been submitted. Our team will review the details and contact you using the information provided.</p><div className="bh-grid-two" style={{marginTop:56,paddingTop:32,borderTop:"1px solid #D8D2C6"}}><div><h2 className="bh-heading">Prepare for the conversation</h2><p>Keep your drawings, property postcode, target investment and priorities together. We will discuss the construction scope and the next practical step.</p></div><div><h2 className="bh-heading">Explore completed homes</h2><p>Our case studies can help you identify the spaces, finishes and details that matter to you.</p><div className="bh-actions"><Link href="/portfolio" className="bh-button">View our work</Link><Link href="/" className="bh-text-link">Back to home</Link></div></div></div></main>;}
