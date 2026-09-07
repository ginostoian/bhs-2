import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
export const metadata = getSEOTags({
  title: "Enquiry Submitted | Better Homes",
  description: "Your enquiry has been submitted successfully.",
  canonicalUrlRelative: "/contact-form-submitted",
  extraTags: {
    robots: {
      index: false,
      follow: true,
    },
  },
});

export default function Page(){return <main className="bh-wrap bh-section"><p className="bh-eyebrow">Your enquiry</p><h1 className="bh-title">Thank you. We will be in touch.</h1><p className="bh-lead">Your enquiry has been submitted. We will review your brief and reply personally, usually within one working day. There is no need to book a call as well.</p><div className="bh-grid-two" style={{marginTop:56,paddingTop:32,borderTop:"1px solid #D8D2C6"}}><div><h2 className="bh-heading">Prepare for the conversation</h2><p>If you have drawings or inspiration, keep them handy for when we speak. If you are still exploring ideas, that is fine too. We will help you work out the next step.</p></div><div><h2 className="bh-heading">Explore completed homes</h2><p>Our case studies can help you identify the spaces, finishes and details that matter to you.</p><div className="bh-actions"><Link href="/portfolio" className="bh-button">View our work</Link><Link href="/" className="bh-text-link">Back to home</Link></div></div></div></main>;}
