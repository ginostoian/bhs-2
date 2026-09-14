/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="bh-wrap bh-section">
      <div className="prose" style={{maxWidth:840}}>
        <div>
          <div>
            <h1 className="bh-title">
              Better Homes Privacy Policy
            </h1>
            <h2 className="text-xl font-bold mb-2">Introduction</h2>
            <p className="mb-4">
              Better Homes ("BHS", "we", "us") values your privacy. This
              policy details how we collect, use, and protect the personal data
              you provide on our website (https://bhstudio.co.uk).
            </p>
            <p>With analytics consent, we record the first public page you visited and a limited acquisition source (such as organic search) for the current browser session. If you enquire, these details and your optional project type, stage and budget can be linked to your enquiry in our CRM. We exclude search queries, arbitrary URL parameters and your message or contact details from these analytics events. Rejecting analytics does not prevent you from sending an enquiry.</p>
            <h2 className="text-xl font-bold mb-2">Information We Collect</h2>
            <p className="mb-4">
              Personal Data: Name, email, phone number, address.
            </p>{" "}
            <p className="mb-4">
              Non-Personal Data: Data collected via web cookies (e.g., browsing
              behavior)
            </p>{" "}
            <h2 className="text-xl font-bold mb-2">Purpose of Collection</h2>
            <p className="mb-4">
              Quotes: Processing your requests and creating accurate quotes for
              our renovation services.
            </p>{" "}
            <p className="mb-4">
              Marketing: Sending promotional materials about our services, with
              your consent.
            </p>{" "}
            <h2 className="text-xl font-bold mb-2">Data Sharing</h2>
            <p className="mb-4">
              We do not share your personal data with any third parties.
            </p>
            <h2 className="text-xl font-bold mb-2">Children's Privacy</h2>
            <p className="mb-4">
              Our services are not intended for children. We do not knowingly
              collect data from individuals under 18.
            </p>
            <h2 className="text-xl font-bold mb-2">Updates</h2>
            <p className="mb-4">
              Any changes to this Privacy Policy will be communicated to you via
              email.
            </p>
            <h2 className="text-xl font-bold mb-2">Your Rights</h2>
            <p className="mb-4">
              You have rights under relevant data protection laws, which may
              include the right to:
            </p>
            <ul className="mb-4">
              <li>Access your personal data</li>
              <li>Request corrections to your information</li>
              <li>
                Request that we delete or restrict the processing of your data
              </li>
              <li>Withdraw your consent for marketing communications</li>
            </ul>
            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p className="mb-4">
              For questions or to exercise your rights, please email:
              contact@celli.co.uk
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
