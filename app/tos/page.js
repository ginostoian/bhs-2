import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: "Terms and Conditions - Better Homes Studio",
  description:
    "Terms and conditions for Better Homes Studio renovation services. Read our terms of service, payment terms, and service agreements.",
  canonicalUrlRelative: "/tos",
});

export default function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-16">
      <div className="prose-lg prose max-w-none">
        <h1 className="mb-8 text-4xl font-bold">Terms and Conditions</h1>

        <p className="mb-8 text-gray-600">
          <strong>Last updated:</strong>{" "}
          {new Date().toLocaleDateString("en-GB")}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
            <p>
              These Terms and Conditions (&quot;Terms&quot;) govern your use of
              Better Homes Studio&apos;s services and website. By accessing our
              services or using our website, you agree to be bound by these
              Terms. If you disagree with any part of these terms, you may not
              access our services.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">2. Services</h2>
            <p>
              Better Homes Studio provides renovation and construction services
              including but not limited to:
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>Kitchen renovations and remodelling</li>
              <li>Bathroom renovations and installations</li>
              <li>House extensions and conversions</li>
              <li>General renovation and refurbishment</li>
              <li>Interior design services</li>
              <li>Loft conversions</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              3. Quotations and Estimates
            </h2>
            <p>
              All quotations and estimates provided by Better Homes Studio are
              valid for 30 days from the date of issue. Prices may be subject to
              change due to material cost fluctuations, design modifications, or
              unforeseen circumstances discovered during the project.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. Payment Terms</h2>
            <p>
              Payment terms will be specified in your individual contract.
              Typically, we require:
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>A deposit upon contract signing</li>
              <li>Progress payments at weekly intervals</li>
              <li>
                Final payment upon project completion and client satisfaction
              </li>
            </ul>
            <p className="mt-4">
              All payments must be made within the specified timeframe. Late
              payments may result in project delays or additional charges.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">5. Project Timeline</h2>
            <p>
              While we strive to complete projects within the estimated
              timeframe, construction timelines may be affected by factors
              beyond our control including weather conditions, material
              availability, and unforeseen structural issues. We will
              communicate any delays promptly and work to minimise disruption.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              6. Quality and Standards
            </h2>
            <p>
              Better Homes Studio is committed to delivering high-quality
              workmanship that meets or exceeds industry standards. All work
              will be completed in accordance with relevant building regulations
              and safety standards.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              7. Warranties and Guarantees
            </h2>
            <p>
              We provide warranties on our workmanship and materials as follows:
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>Workmanship warranty: 2 years from project completion</li>
              <li>Materials warranty: As provided by manufacturers</li>
              <li>Structural work: 10 years (where applicable)</li>
            </ul>
            <p className="mt-4">
              Warranties do not cover damage caused by misuse, neglect, or
              normal wear and tear.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              8. Client Responsibilities
            </h2>
            <p>Clients are responsible for:</p>
            <ul className="mt-4 list-disc pl-6">
              <li>Providing accurate information about their requirements</li>
              <li>
                Obtaining necessary planning permissions and building
                regulations approval
              </li>
              <li>
                Ensuring the work area is accessible and prepared for
                construction
              </li>
              <li>
                Making timely decisions regarding design and material choices
              </li>
              <li>Providing access to the property at agreed times</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              9. Health and Safety
            </h2>
            <p>
              We are committed to maintaining high health and safety standards.
              Our team will:
            </p>
            <ul className="mt-4 list-disc pl-6">
              <li>Follow all relevant health and safety regulations</li>
              <li>Maintain a clean and safe work environment</li>
              <li>Use appropriate safety equipment and procedures</li>
              <li>Communicate any safety concerns to clients</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              10. Insurance and Liability
            </h2>
            <p>
              Better Homes Studio maintains appropriate insurance coverage
              including public liability insurance. However, we recommend that
              clients maintain their own home insurance and consider additional
              coverage for renovation projects.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              11. Dispute Resolution
            </h2>
            <p>
              In the event of any disputes, we encourage open communication to
              resolve issues amicably. If a resolution cannot be reached,
              disputes may be referred to mediation or arbitration as specified
              in your individual contract.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              12. Privacy and Data Protection
            </h2>
            <p>
              We are committed to protecting your privacy and handling your
              personal data in accordance with applicable data protection laws.
              Please refer to our Privacy Policy for detailed information about
              how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">13. Website Terms</h2>
            <p>By using our website, you agree to:</p>
            <ul className="mt-4 list-disc pl-6">
              <li>Use the website for lawful purposes only</li>
              <li>Not attempt to gain unauthorised access to our systems</li>
              <li>Not interfere with the website&apos;s functionality</li>
              <li>Respect our intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              14. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes
              will be effective immediately upon posting on our website. Your
              continued use of our services constitutes acceptance of any
              changes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              15. Contact Information
            </h2>
            <p>
              If you have any questions about these Terms and Conditions, please
              contact us:
            </p>
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <p>
                <strong>Better Homes Studio</strong>
              </p>
              <p>
                Email:{" "}
                {config.mailgun.supportEmail || "info@betterhomesstudio.com"}
              </p>
              <p>Website: {config.domainName}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">16. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in
              accordance with the laws of the United Kingdom. Any disputes
              arising from these terms will be subject to the exclusive
              jurisdiction of the courts of the United Kingdom.
            </p>
          </section>
        </div>

        <div className="mt-12 rounded-lg bg-blue-50 p-6">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> These terms and conditions are general in
            nature and may be supplemented or modified by specific terms agreed
            upon in individual contracts. Always refer to your specific contract
            for the complete terms governing your project.
          </p>
        </div>
      </div>
    </div>
  );
}
