/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName} Studio`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="container max-w-xl mx-auto mb-10">
      <div className="p-5">
        <Link
          href="/"
          className="btn btn-ghost mb-6"
        >
          {" "}
          Back
        </Link>

        <div className="container mockup-browser border bg-base-300">
          <div className="mockup-browser-toolbar">
            <div className="input">https://bhstudio.co.uk</div>
          </div>
          <div className="fle justify-center px-10 py-16 bg-base-100">
            <h1 className="text-3xl text-center font-bold mb-6">
              Better Homes Studio Privacy Policy
            </h1>
            <h2 className="text-xl font-bold mb-2">Introduction</h2>
            <p className="mb-4">
              Better Homes Studio ("BHS", "we", "us") values your privacy. This
              policy details how we collect, use, and protect the personal data
              you provide on our website (https://bhstudio.co.uk).
            </p>
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
