import Link from "next/link";
import Image from "next/image";

import Approach from "@/components/Approach";
import CustomCTA from "@/components/CustomCTA";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Guarantee from "@/components/Guarantee";
import PortfolioCardContainer from "@/components/PortfolioCardContainer";
import Stats from "@/components/Stats";
import Testimonials11 from "@/components/Testimonials11";
import Testimonials3 from "@/components/Testimonials3";
import BlogHighlight from "@/components/blog/BlogHighlight";
import ContentRow from "@/components/contentRow/ContentRow";
import Hero from "@/components/hero/Hero";
import SectionTitle from "@/components/sectionTitle/SectionTitle";
import SocialProof from "@/components/socialProof/SocialProof";
import TextBlockDark from "@/components/textBlockDark/TextBlockDark";
import TextGrid from "@/components/textGrid/TextGrid";
import config from "@/config";
import { getPageFaqs } from "@/libs/pageFaqs";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Renovation Cost Calculators | Better Homes Studio",
  description:
    "Use our free London-focused renovation calculators for kitchens, bathrooms, home refurbishments, extensions and BTU heating estimates.",
  canonicalUrlRelative: "/tools",
  openGraph: {
    title: "Renovation Cost Calculators | Better Homes Studio",
    description:
      "Free calculators to estimate London renovation, extension, kitchen, bathroom and heating project costs.",
    url: `https://${config.domainName}/tools`,
  },
  keywords: [
    "renovation cost calculator London",
    "bathroom cost calculator",
    "kitchen renovation calculator",
    "extension cost calculator London",
  ],
});

export default function ToolsPage() {
  const calculators = [
    {
      title: "Kitchen Renovation Calculator",
      description:
        "Get an accurate estimate for your kitchen renovation project. Our calculator considers your kitchen size, materials, and specific requirements.",
      image: "/assets/img/kitchen/contemporary-kitchen.webp",
      link: "/kitchen-calculator",
      features: [
        "Kitchen size calculation",
        "Material selection",
        "Electrics & plumbing",
        "PDF download",
      ],
      estimatedTime: "5-10 minutes",
      accuracy: "95% accurate",
    },
    {
      title: "Bathroom Renovation Calculator",
      description:
        "Calculate the cost of your bathroom renovation with our comprehensive tool. Includes tiling, fixtures, and underfloor heating options.",
      image: "/assets/img/bathroom/industrial-bathroom.webp",
      link: "/tools/bathroom-cost-calculator",
      features: [
        "Bathroom size options",
        "Layout changes",
        "Tiling levels",
        "Fixture selection",
      ],
      estimatedTime: "3-5 minutes",
      accuracy: "90% accurate",
    },
    {
      title: "House Extension Calculator",
      description:
        "Plan your house extension with our detailed cost calculator. Covers single and double-storey extensions with various finishes.",
      image: "/assets/img/extension/extension-1.webp",
      link: "/extension-calculator",
      features: [
        "Extension type",
        "Size calculation",
        "Finishing options",
        "PDF download",
      ],
      estimatedTime: "8-12 minutes",
      accuracy: "92% accurate",
    },
    {
      title: "General Renovation Calculator",
      description:
        "Comprehensive calculator for general home renovation projects. Perfect for whole house refurbishments and interior design projects.",
      image: "/assets/img/general/london-grey-living-room.webp",
      link: "/renovation-calculator",
      features: [
        "Room-by-room breakdown",
        "Material selection",
        "Labour costs",
        "PDF download",
      ],
      estimatedTime: "10-15 minutes",
      accuracy: "88% accurate",
    },
    {
      title: "BTU Calculator",
      description:
        "Calculate the perfect BTU output for heating your room with gas or electric radiators. Get accurate heating requirements based on room size and insulation.",
      image: "/assets/img/general/living-room-1.webp",
      link: "/btu-calculator",
      features: [
        "Room size calculation",
        "Insulation assessment",
        "Heating type selection",
        "Cost estimates",
      ],
      estimatedTime: "3-5 minutes",
      accuracy: "95% accurate",
    },
  ];

  const faqs = getPageFaqs("tools");

  return (
    <>
      <main>
        <Hero
          title="Renovation Cost Calculators"
          titleAccent=""
          subtitle="Get accurate cost estimates for your renovation projects with our comprehensive calculators. Plan your budget with confidence using our industry-leading tools."
          heroCTA="Start calculating now"
          heroImgUrl="modern-living-room-trustworthy.webp"
          ctaTallyFormLink="https://tally.so/r/3jZq8p"
        />
        <SocialProof />

        <SectionTitle
          title="Our Renovation Calculators"
          subtitle="Accurate cost estimates for every type of project"
        />

        {/* Calculator Cards Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {calculators.map((calculator, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative h-48">
                  <Image
                    src={calculator.image}
                    alt={calculator.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    {calculator.title}
                  </h3>
                  <p className="mb-4 leading-relaxed text-gray-600">
                    {calculator.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold text-gray-800">
                      Key Features:
                    </h4>
                    <ul className="space-y-1">
                      {calculator.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <svg
                            className="mr-2 h-4 w-4 text-[#266bf1]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
                    <span>⏱️ {calculator.estimatedTime}</span>
                    <span>🎯 {calculator.accuracy}</span>
                  </div>

                  <Link
                    href={calculator.link}
                    className="block w-full rounded-lg bg-[#266bf1] px-6 py-3 text-center font-semibold text-white transition-colors duration-200 hover:bg-[#1e5fd9]"
                  >
                    Start Calculator
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionTitle
          title="Why Use Our Calculators?"
          subtitle="Professional tools designed for accuracy and ease of use"
        />

        <TextGrid
          content={[
            {
              title: "Accurate Estimates",
              subtitle: "Based on real project data and current market rates",
              p1: "Our calculators are built on thousands of completed projects across London, ensuring estimates reflect real-world costs and current market conditions.",
              p2: "We regularly update our pricing database to account for material cost fluctuations and labour rate changes, keeping your estimates current and reliable.",
              imgSrc: "/assets/img/general/living-room-1.webp",
            },
            {
              title: "Comprehensive Coverage",
              subtitle: "Every aspect of your renovation project considered",
              p1: "From basic materials to complex structural work, our calculators account for all aspects of your renovation project, leaving no hidden costs.",
              p2: "Whether it's electrical work, plumbing, structural changes, or finishing touches, our tools provide detailed breakdowns for complete transparency.",
              imgSrc: "/assets/img/kitchen/coastal-kitchen.webp",
            },
            {
              title: "Easy to Use",
              subtitle: "Simple interface designed for homeowners",
              p1: "Our calculators feature intuitive interfaces that guide you through each step, making it easy to get accurate estimates even if you&apos;re new to renovation projects.",
              p2: "With clear explanations and helpful tips throughout the process, you'll understand exactly what factors affect your project costs.",
              imgSrc: "/assets/img/bathroom/1920.webp",
            },
          ]}
        />

        <Testimonials3 />
        <Stats />
        <SectionTitle />
        <Approach />

        <SectionTitle
          title="Our Build Approach"
          subtitle="Simple, fast and streamlined process"
        />

        <TextGrid
          content={[
            {
              title: "1. Calculate Your Costs",
              subtitle:
                "Use our accurate calculators to get detailed estimates",
              p1: "Start with any of our specialized calculators to get a comprehensive cost breakdown for your specific project type and requirements.",
              p2: "Our calculators consider your property type, location, materials, and project scope to provide the most accurate estimates possible.",
              imgSrc:
                "/assets/img/extension/diagram-of-popular-house-extensions.webp",
            },
            {
              title: "2. Book a Consultation",
              subtitle: "Get a detailed quote from our experts",
              p1: "Once you have your estimate, book a consultation with our team. We'll visit your property and provide a detailed, binding quote based on your specific needs.",
              p2: "Our experts will assess your space, discuss your requirements, and provide recommendations to optimize your project for both cost and quality.",
              imgSrc:
                "/assets/img/misc/couple-consulting-better-homes-studio.webp",
            },
            {
              title: "3. Start Your Project",
              subtitle: "Professional execution from start to finish",
              p1: "With our comprehensive planning and accurate estimates, you can confidently start your renovation project knowing exactly what to expect.",
              p2: "Our experienced team will manage every aspect of your project, from initial design to final finishing touches, ensuring exceptional results.",
              imgSrc: "/assets/img/general/bedrooms-renovation.webp",
            },
          ]}
        />

        <Testimonials11 />
        <PortfolioCardContainer />
        <Guarantee />
        <CustomCTA />
        <FAQ content={faqs} />

        <TextBlockDark
          content={{
            darkBgTextTitle: "Ready to start your renovation project?",
            darkBgTextSubtitle:
              "Get accurate estimates, professional planning, and exceptional execution with Better Homes Studio. Our calculators are just the beginning of your renovation journey.",
            darkBgTextBtn: "Get your free consultation",
          }}
        />

        <SectionTitle
          title="The Knowledge Center"
          subtitle="Where you actually learn new things"
        />

        <BlogHighlight
          articles={[
            {
              title: "Kitchen Renovation Guide: From Planning to Completion",
              excerpt:
                "Everything you need to know about renovating your kitchen, from initial planning to final finishing touches.",
              image: "/assets/img/kitchen/contemporary-kitchen.webp",
              slug: "kitchen-renovation-guide",
            },
            {
              title: "Bathroom Renovation Costs: What to Expect in 2024",
              excerpt:
                "A comprehensive breakdown of bathroom renovation costs in London, including materials, labour, and hidden expenses.",
              image: "/assets/img/bathroom/industrial-bathroom.webp",
              slug: "bathroom-renovation-costs-2024",
            },
            {
              title: "House Extensions: Planning Permission and Costs",
              excerpt:
                "Essential information about planning permission, building regulations, and cost considerations for house extensions.",
              image: "/assets/img/extension/extension-1.webp",
              slug: "house-extensions-planning-permission",
            },
          ]}
        />
      </main>
    </>
  );
}
