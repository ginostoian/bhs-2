import themes from "daisyui/src/theming/themes.js";
import Link from "next/link";

const config = {
  // REQUIRED
  appName: "Better Homes",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Better Homes is the one stop shop for all your design and build needs. Take the hassle out of construction.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "bhstudio.co.uk",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (mailgun.supportEmail) otherwise customer support won't work.
    id: "ce9f7fa3-7ecf-42e4-a9c6-fb46d0ae6208",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    // onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Niyy5AxyNprDp7iZIqEyD2h"
            : "price_456",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Starter",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for small projects",
        // The price you want to display, the one user will be charged on Stripe.
        price: 79,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 99,
        features: [
          {
            name: "NextJS boilerplate",
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
        ],
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1O5KtcAxyNprDp7iftKnrrpw"
            : "price_456",
        name: "Advanced",
        description: "You need more power",
        price: 99,
        priceAnchor: 149,
        features: [
          {
            name: "NextJS boilerplate",
          },
          { name: "User oauth" },
          { name: "Database" },
          { name: "Emails" },
          { name: "1 year of updates" },
          { name: "24/7 support" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  mailgun: {
    // subdomain to use when sending emails, if you don't have a subdomain, just remove it. Highly recommended to have one (i.e. mg.yourdomain.com or mail.yourdomain.com)
    subdomain: "mg",
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `ShipFast <noreply@mg.shipfa.st>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Marc at ShipFast <marc@mg.shipfa.st>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "marc@mg.shipfa.st",
    // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
    forwardRepliesTo: "marc.louvion@gmail.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    // main: themes[`[data-theme=light]`]["primary"],
    main: "#266bf1",
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
  copy: {
    homepage: {
      title: "Renovate stress free with ",
      titleAccent: "Better Homes Studio",
      subtitle:
        "Builders don't have to be unreliable and hard to work with. We make your house renovation and refurbishment a breeze. Test",
      heroCTA: "Get your free estimate now",
      heroImgUrl: "misc/best-of-houzz-winner.png",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      whatWeDoSection: {
        bathroom: {
          title: "Bathroom renovation",
          subtitle: "We create outstanding bathrooms. ",
          subtitleAccent: "Design, Supply & Install.",
          p1: "Renovating your bathroom can be quite the task. There are a lot of big decisions to be made from design and practicality to plumbing and drainage.",
          p2: "Our team will help you make the best decisions whether you are doing a full Design, Supply & Install or just the installation with us.",
          CTA: "Renovate your bathroom",
          imgSrc: "/assets/img/bathroom/industrial-bathroom.webp",
          slug: "bathroom-renovation",
        },
        kitchen: {
          title: "Kitchen renovation",
          subtitle: "A well planned, beautifully designed kitchen adds ",
          subtitleAccent: "huge value and comfort to any home.",
          p1: "Renovating your kitchen is one of the biggest undertakings when planning your perfect home.",
          p2: "Our team of kitchen refurbishment experts will guide you through the whole process to maximise your investment.",
          CTA: "Renovate your kitchen",
          imgSrc: "/assets/img/kitchen/contemporary-kitchen.webp",
          slug: "kitchen-renovation",
        },
        generalRenovation: {
          title: "Home Renovation",
          subtitle: "We create stunning interiors. ",
          subtitleAccent: "Design, Flooring, Decorating, Structural and more.",
          p1: "Your house should feel like home. It doesn't matter if it is a flat, house or container house. It should match your style.",
          p2: "Forever home or not, your home should represent you. A well done house renovation can greatly increase your comfort level and your house's value!",
          CTA: "Renovate your home",
          imgSrc: "/assets/img/general/london-grey-living-room.webp",
          slug: "general-renovation",
        },
        interiorDesign: {
          title: "Interior Design",
          subtitle: "Our team does more than design homes. ",
          subtitleAccent: "The create living experiences.",
          p1: "Our team of designers interpret each client’s passions and style to provide innovative and exquisite interiors, curating furniture, textiles, even art and antiques.",
          p2: "Interior spaces are often completely re-imagined beyond the decorative, to eliminate boundaries between the built environment and a better way of life.",
          CTA: "Do your home a favour",
          imgSrc: "/assets/img/general/living-room-1.webp",
          slug: "interior-design",
        },
        smartHome: {
          title: "Smart Homes",
          subtitle: "We get smarter as times passes ",
          subtitleAccent: "Our homes should do the same.",
          p1: "Our team of trained proffesionals will transform your home into a tech fest.",
          p2: "Letting your home deal with menial tasks enables you and your family to focus on what matters most to you.",
          CTA: "Automate your home",
          imgSrc: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home",
        },
        houseExtension: {
          title: "House Extensions",
          subtitle: "Increase your houses square footage. ",
          subtitleAccent: "It's value will grow as a bonus.",
          p1: "When you need more space but you're in love with your current home or simply dread the idea of moving, the solution is quite simple.",
          p2: "Our team will help you make the best decisions when planning for your house extension to maximise both space and value.",
          CTA: "Extend your home",
          imgSrc: "/assets/img/extension/extension-1.webp",
          slug: "house-extension",
        },
      },
      howWeDoItSection: {
        bigGridTitle: "Easy, transparent and different",
        bigGridText:
          "From design to refurbishment you can rest assured that your experience with Better Homes Studio will be second to none.",
        gridOneNum: "1.",
        gridOneTitle: "Book an appointment",
        gridOneText:
          "Use our quick and easy online form to book a date which suits you best. One of our experienced operators will be in touch to finalise your appointment.",
        gridTwoNum: "2.",
        gridTwoTitle: "Receive your free & transparent quote",
        gridTwoText:
          "Based on your preferences discussed during the initial meeting, our team of expert estimators will craft a clear and transparent quote.",
        gridThreeNum: "3.",
        gridThreeTitle: "We carry out the work",
        gridThreeText:
          "Our friendly team of highly skilled professionals will effortlessly refurbish your home so you won't have to worry about a thing.",
        gridFourNum: "4.",
        gridFourTitle: "Enjoy your new home + The BHS Guarantee",
        gridFourText:
          "Now it's time to sit back, relax and marvel at how your vision became a reality. It really is that simple, so what are you waiting for?",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
    bathroomPage: {
      ctaTallyFormLink:
        "#tally-open=wbkWj0&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=1000",
      title: "Renovate your bathroom with BHS. ",
      titleAccent: "A hassle free experience.",
      subtitle:
        "Bathroom design, supply and renovation. We take care of every aspect of the project so you don't have to lift a finger. Be smarter than your peers and choose the easy way - The Better Homes Studio way.",
      heroCTA: "Get your quote now - it's free",
      heroImgUrl: "bathroom/industrial-bathroom.webp",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      whatWeDoSection: {
        bathroomDesign: {
          title: "Bathroom design",
          subtitle: "We create outstanding bathrooms.",
          subtitleAccent: " Design, Supply & Install.",
          p1: "Renovating your bathroom can be quite the task. There are a lot of big decisions to be made from design and practicality to plumbing and drainage.",
          p2: "Our team will help you make the best decisions whether you are doing a full Design, Supply & Install or just the installation with us.",
          CTA: "Get your bathroom designed",
          imgSrc: "/assets/img/bathroom/bathroom-design.webp",
          slug: "#tally-open=wbkWj0&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=1000",
        },
        smallBathroom: {
          title: "Small bathrooms",
          subtitle: "Even a small bathroom can make a huge impact",
          subtitleAccent: " if renovated properly.",
          p1: "Combining functionality, practicality with clever storage solutions you can manage to get rid of the chaos that usually comes with a tiny bathroom.",
          p2: "Our team of bathroom refurbishment experts will guide you through the whole process.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/small-bathroom.webp",
          slug: "#tally-open=wbkWj0&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=1000",
        },
        modernBathroom: {
          title: "Modern bathrooms",
          subtitle:
            "Geometrical shapes, simple colour palettes with sleek bold accents",
          subtitleAccent: " or tones of neutral colours",
          p1: "Modern bathrooms are predominantly simplistic. Decorative bathroom tiles add a sort of unmatched charm to the entire space that cranks things up a notch.",
          p2: "If you really wish to put the X-Factor in extra, don’t, for once, shy away from bold colours encircling a statement bathtub or shower.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/modern-bathroom.webp",
          slug: "#tally-open=wbkWj0&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=1000",
        },
        industrialBathroom: {
          title: "Industrial bathrooms",
          subtitle:
            "Exposed pipes, ducts, tubes, and wires are commonly found in",
          subtitleAccent: " industrial style bathrooms",
          p1: "When considering an industrial style bathroom renovation you can go either strong or soft.",
          p2: "Whichever option you decide to go with, you can use metro tiles, grey colors, bare brick walls, exposed shelving and black shower frames.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/industrial-bathroom.webp",
          slug: "#tally-open=wbkWj0&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=1000",
        },
        traditionalBathroom: {
          title: "Traditional bathrooms",
          subtitle: "Traditional style bathrooms are",
          subtitleAccent: " classic and elegant in design.",
          p1: "Traditional bathroom designs typically take their cue from what is currently trending in the design world, with materials and decor that are respective of their historical periods.",
          p2: "Keep your accessories clean and simple, you could consider monogramming for your towels and bath mats.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/bathroom-trad.webp",
          slug: "#tally-open=wbkWj0&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=1000",
        },
        victorianBathroom: {
          title: "Victorian bathrooms",
          subtitle: "This design style often features a ",
          subtitleAccent: "freestanding bath as the center piece",
          p1: "Victorian bathrooms are characterized by the elegant design elements commonly found in the grand homes of the Victorian era.",
          p2: "In general, the design for Victorian bathrooms focuses on beauty, elegance, and comfort.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/victorian-bathroom.webp",
          slug: "#tally-open=wbkWj0&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave&tally-auto-close=1000",
        },
      },
      howWeDoItSection: {
        bigGridTitle: "Trustworthy, reliable, friendly.",
        bigGridText:
          "When things get messy, and they do, you'll be happy we're by your side, taking care of all the issues. Design, supply and build. All taken care of.",
        gridOneNum: "1.",
        gridOneTitle: "Expertise through experience.",
        gridOneText:
          "We have been designing and renovating bathrooms in London for over 12 years. We have encountered all possible scenarios and all types of clients. This means we know how to manage anything that comes our way.",
        gridTwoNum: "2.",
        gridTwoTitle: "Detailed, transparent, no fluff quotes.",
        gridTwoText:
          "Worried about 'the actual' price of your bathroom renovation? All our estimates and quotes are free, transparent and detailed. What you see is what you get. No more hidden costs that take the cost up by 50% more than initially quoted.",
        gridThreeNum: "3.",
        gridThreeTitle: "Your bathroom. Professionaly designed.",
        gridThreeText:
          "Skip the tens of hours spent scouring Pinterest and Google for inspiration and for what you need to purchase. Let our proffesional bathroom designers do all the heavy lifting. Relax, approve and visualise your bathroom in 3D from the comfort of your house. Piece of cake.",
        gridFourNum: "4.",
        gridFourTitle: "After care and guarantees.",
        gridFourText:
          "Our industry leading 2 year workmanship guarantee is designed to offer you peace of mind. On the off chance that something goes wrong, we come out and fix it for free. Simple like that. For item faults, we are more than happy to replace them while under warranty (labour costs may apply)",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
    kitchenPage: {
      ctaTallyFormLink:
        "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
      title: "Your kitchen deserves better ",
      titleAccent: "Renovate with the best.",
      subtitle:
        "Kitchen fitting and renovation done right - On Time, On Budget, 5-Star Guarantee. From 0 to 100 without you having to lift a finger. Renovate smarter and easier - The Better Homes Studio way.",
      heroCTA: "Get your quote now - it's free",
      heroImgUrl: "kitchen/modern-kitchen.webp",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      whatWeDoSection: {
        kitchenDesign: {
          title: "Kitchen design",
          subtitle: "We create outstanding kitchens.",
          subtitleAccent: " Custom built, for you!",
          p1: "Designing your kitchen can be quite the task. There are a lot of big decisions to be made from design and practicality to plumbing and drainage.",
          p2: "When getting a kitchen from one of the big kitchen vendors is just not enough, our team will help you make the best decisions",
          CTA: "Get your kitchen designed",
          imgSrc: "/assets/img/kitchen/kitchen-design.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        smallKitchen: {
          title: "Small kitchens",
          subtitle: "Even a small kitchen can meet your needs",
          subtitleAccent: " if designed & renovated properly.",
          p1: "Combining functionality, practicality with clever storage solutions you can manage to get rid of the chaos that usually comes with a tiny kitchen.",
          p2: "Our team of kitchen refurbishment experts and installers will guide you through the whole process.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/small-kitchen.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        modernKitchen: {
          title: "Modern kitchens",
          subtitle:
            "Geometrical shapes, simple colour palettes with sleek bold accents",
          subtitleAccent: " or tones of neutral colours",
          p1: "Modern kitchen designs have open floor plans stretching the entire length of the kitchen layout.",
          p2: "This minimalistic approach to layout is what achieves a simple and elegant look.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/modern-kitchen.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        industrialKitchen: {
          title: "Industrial kitchens",
          subtitle:
            "Exposed pipes, ducts, tubes, and wires are commonly found in",
          subtitleAccent: " industrial style kitchens",
          p1: "When considering an industrial style kitchen renovation you can go either strong or soft.",
          p2: "Whichever option you decide to go with, you can use metro tiles, grey colors, bare brick walls, exposed shelving and black shower frames.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/industrial-kitchen.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        openPlanKitchen: {
          title: "Open plan kitchens",
          subtitle: "Open plan style kitchens are",
          subtitleAccent: " for the free and bold.",
          p1: "Open plan kitchens are one of the most sought after features of a modern family home, thanks to their light, spacious feel and versatile design.",
          p2: "In an open plan kitchen, the design hangs on the interaction between the kitchen, especially the island, and dining or living room. This usually involves knocking down a wall.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/open-plan-kitchen.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        kitchenInExtension: {
          title: "Kitchen in extension",
          subtitle:
            "Kitchen extensions don't have to be huge, sprawling design to  ",
          subtitleAccent: "transform an existing house.",
          p1: "When designing a kitchen extension, spend time and effort on making sure plenty natural light infiltrates the space.",
          p2: "Bifold or sliding patio doors are fantastic options that offer views out all year round, while installing a large roof lantern can bring in plenty of natural light to the new space.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/kitchen-extension.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
      },
      howWeDoItSection: {
        bigGridTitle: "Trustworthy, reliable, friendly.",
        bigGridText:
          "When things get messy, and they do, you'll be happy we're by your side, taking care of all the issues. Design, supply and build. All taken care of.",
        gridOneNum: "1.",
        gridOneTitle: "Expertise through experience.",
        gridOneText:
          "We have been designing and renovating kitchens in London for over 12 years. We have encountered all possible scenarios and all types of clients. This means we know how to manage anything that comes our way.",
        gridTwoNum: "2.",
        gridTwoTitle: "Detailed, transparent, no fluff quotes.",
        gridTwoText:
          "Worried about 'the actual' price of your kitchen fitting and renovation? All our estimates and quotes are free, transparent and detailed. What you see is what you get. No more hidden costs that take the cost up by 50% more than initially quoted.",
        gridThreeNum: "3.",
        gridThreeTitle: "Your kitchen. Professionaly designed & fitted.",
        gridThreeText:
          "Skip the tens of hours spent scouring Pinterest and Google for inspiration and for what you need to purchase. If the big vendors are not cutting it out for you, let our proffesional designers do all the heavy lifting. Piece of cake.",
        gridFourNum: "4.",
        gridFourTitle: "After care and guarantees.",
        gridFourText:
          "Our industry leading 2 year workmanship guarantee is designed to offer you peace of mind. On the off chance that something goes wrong, we come out and fix it for free. Simple like that. For item faults, we are more than happy to replace them while under warranty (labour costs may apply)",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
    renovationPage: {
      ctaTallyFormLink:
        "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
      title: "Goodbye renovation nightmares. ",
      titleAccent: "Hello, dream home!",
      subtitle:
        "Tired of unreliable contractors and surprise costs? Say goodbye to renovation nightmares and endless contractor headaches. Our streamlined process, transparent communication, and skilled team will take you from 0 to 100 in no time.",
      heroCTA: "Get your quote now - it's free",
      heroImgUrl: "general/living-room-1.webp",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      whatWeDoSection: {
        fullHome: {
          title: "Full home renovation",
          subtitle: "Full house refurbishment.",
          subtitleAccent: " Transform your house into a home.",
          p1: "Renovating your house is a big task. There are a lot of big decisions to be made from design and furnishing to layout and practicality.",
          p2: "Our team will help you make the best decisions and get the best possible outcome from the renovation.",
          CTA: "Renovate your house",
          imgSrc: "/assets/img/general/london-grey-living-room.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        kitchenInstallation: {
          title: "Kitchen installation & Design",
          subtitle: "Your kitchen is the hub of your home.",
          subtitleAccent: " Treat it well.",
          p1: "Bespoke or designed at one of the big kitchen designers, renovating your kitchen will make a huge difference to your home.",
          p2: "Our team of kitchen refurbishment experts and installers will guide you through the whole process",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/contemporary-kitchen.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        bathroomInstallation: {
          title: "Bathroom installation & Design",
          subtitle: "One or two, or five, small or big, your bathroom is",
          subtitleAccent: " important",
          p1: "Designing and fitting a great bathroom will be a treat for the whole house.",
          p2: "Know what you want? Go for installation or get your bathroom designed and installed by us.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/bathroom-design.webp",
          slug: "#tally-open=3x6L5n&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        flooringInstallation: {
          title: "Flooring installation",
          subtitle:
            "Laminate, engineered, tiles, cement, LVT or whatever you might like,",
          subtitleAccent: " your floor will stand out.",
          p1: "One of the biggest features of your home is the floor. It's important to consider the look and the long term practicality of your new flooring.",
          p2: "Whichever option you decide to go with, we will make sure that it's flawlessly installed. We can even help you source it.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/flooring-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        structuralWork: {
          title: "Structural work",
          subtitle: "As great as your home is,",
          subtitleAccent: " it could do with some layout changes.",
          p1: "Circumstances change. What once worked, might not now. Your home can adapt to your needs.",
          p2: "Create another room for your baby, convert your space to open plan or add a new bathroom. Whatever you need, our team can make it happen.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/structural-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        heating: {
          title: "Heating & Boilers",
          subtitle: "Pipework, boiler conversion or installation,",
          subtitleAccent: " underfloor heating systems.",
          p1: "Your home should be comfortable and nothing offers more comfort than the perfect temperature.",
          p2: "Get your home up to date with the perfect heating system for you and your family.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/heating-1.webp",
          slug: "/contact",
        },
      },
      howWeDoItSection: {
        bigGridTitle: "Trustworthy, reliable, friendly.",
        bigGridText:
          "When things get messy, and they do, you'll be happy we're by your side, taking care of all the issues. Design, supply and build. All taken care of.",
        gridOneNum: "1.",
        gridOneTitle: "Expertise through experience.",
        gridOneText:
          "We have been designing and renovating homes in London for over 12 years. We have encountered all possible scenarios and all types of clients. This means we know how to manage anything that comes our way.",
        gridTwoNum: "2.",
        gridTwoTitle: "Detailed, transparent, no fluff quotes.",
        gridTwoText:
          "Worried about 'the actual' price of your renovation? All our estimates and quotes are free, transparent and detailed. What you see is what you get. No more hidden costs that take the cost up by 50% more than initially quoted.",
        gridThreeNum: "3.",
        gridThreeTitle: "Your home. Professionaly refurbished.",
        gridThreeText:
          "Skip the tens of hours spent research and dealing with hard to work with contractors. Let our team of proffesionals do all the heavy lifting for you. Relax, approve and see your dreams come true in front of your eyes. Piece of cake.",
        gridFourNum: "4.",
        gridFourTitle: "After care and guarantees.",
        gridFourText:
          "Our industry leading workmanship guarantees are designed to offer you peace of mind. On the off chance that something goes wrong, we come out and fix it for free. Simple like that. For item faults, we are more than happy to replace them while under warranty (labour costs may apply)",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
    extensionPage: {
      ctaTallyFormLink:
        "#tally-open=wQEoXw&tally-emoji-text=👋&tally-emoji-animation=wave",
      title: "Extending your home the right way. ",
      titleAccent: "It's hard but we make it easier.",
      subtitle:
        "Looking to create an inviting space bathed in natural light? Need extra space for a growing family? Want to experience the ease and functionality of open-plan living? Our team will work with you to bring your dream extension to life.",
      heroCTA: "Get your quote now - it's free",
      heroImgUrl: "extension/single-storey-extension.webp",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      whatWeDoSection: {
        singleStoreyExtension: {
          title: "Single storey extension",
          subtitle: "The addition of single storey extension can add ",
          subtitleAccent: "significant value to your home.",
          p1: "Single storey house extensions are built onto a part of the house whereby one or more sides of the extension is attached to the property, and there is only the ground floor plus any basement built to it.",
          p2: "Single storey extensions require building control, but they might not need planning permission.",
          CTA: "Extent your home",
          imgSrc: "/assets/img/extension/single-storey-extension.webp",
          slug: "contact",
        },
        sideReturnExtension: {
          title: "Side return extension",
          subtitle: "Perfect for a bit of additional space without causing",
          subtitleAccent: " too much disruption .",
          p1: "Side return extension functions similarly to a rear extension, with the difference being that rather than extending do the rear, the property is extended to the side, making use of the side return, or small ‘alleyway’ between yours and your neighbour’s property.",
          p2: "Simplicity and cost are again the main selling points here, with the side return extension being relatively easy to build, taking less time than some of the other options and consequently also being among the least expensive of all options.",
          CTA: "Extend your home",
          imgSrc: "/assets/img/extension/side-return-extension.webp",
          slug: "contact",
        },
        doubleStoreyExtension: {
          title: "Double storey extension",
          subtitle: "Need to add more than one room to your home?",
          subtitleAccent:
            " a double-storey extension is a cost-effective option.",
          p1: "With this type of extension, you could create a large kitchen with a dining area and easy access to the garden on the lower half. Have an extra bedroom, large family bathroom, office or even a home gym on the second half.",
          p2: "Double storey home extensions can be built onto the back or the side of the house.",
          CTA: "Extend your home",
          imgSrc: "/assets/img/extension/double-storey-extension.webp",
          slug: "contact",
        },
        overStructureExtension: {
          title: "Over structure extension",
          subtitle: "An extension over the top of an existing",
          subtitleAccent: " structure such as a garage.",
          p1: "Many UK properties (detached & semi-detached) built within the last 40 years, usually have a single storey side garage. This creates an opportunity for an additional extension on top of the garage.",
          p2: "This type of extension on top of the garage offers significant benefits compared to other extension types such as creating a large master bedroom with en-suite.",
          CTA: "Extend your home",
          imgSrc: "/assets/img/extension/over-structure-extension.webp",
          slug: "contact",
        },
        basementExtension: {
          title: "Basement extension",
          subtitle: "Usually used to add a",
          subtitleAccent: " gym or game room to your home.",
          p1: "If your property sits on a slope, you could build a semi-basement with a part of the area sitting below the ground. Bringing light and air into half basements is usually straightforward.",
          p2: "If you are adding a side or rear house extension to your house, you might be able to incorporate a basement extension into the design.",
          CTA: "Extend your home",
          imgSrc: "/assets/img/extension/basement.jpeg",
          slug: "contact",
        },
        loftConversion: {
          title: "Loft conversion",
          subtitle: "Create an extra room or more by simply",
          subtitleAccent: " converting your loft.",
          p1: "If you have an attic with sufficient floor to ceiling heights, you could create an extra room by simply converting your loft by adding a couple of Velux or other good quality windows to your roof, creating a roof light loft conversion.",
          p2: "If your attic is not high enough, you could still add a room by building a dormer loft conversion or a mansard extension",
          CTA: "Convert your loft",
          imgSrc: "/assets/img/extension/loft-conversion.png",
          slug: "contact",
        },
      },
      howWeDoItSection: {
        bigGridTitle: "Trustworthy, reliable, friendly.",
        bigGridText:
          "When things get messy, and they do, you'll be happy we're by your side, taking care of all the issues. Design, supply and build. All taken care of.",
        gridOneNum: "1.",
        gridOneTitle: "Expertise through experience.",
        gridOneText:
          "We have been extending houses in London for over 12 years. We have encountered all possible scenarios and all types of clients. This means we know how to manage anything that comes our way.",
        gridTwoNum: "2.",
        gridTwoTitle: "Detailed, transparent, no fluff quotes.",
        gridTwoText:
          "Worried about 'the actual' price of your extension? All our estimates and quotes are free, transparent and detailed. What you see is what you get. No more hidden costs that take the cost up by 50% more than initially quoted.",
        gridThreeNum: "3.",
        gridThreeTitle: "Your bathroom. Professionaly designed.",
        gridThreeText:
          "Skip the tens of hours spent research and dealing with hard to work with contractors. Let our team of proffesionals do all the heavy lifting for you. Relax, approve and see your dreams come true in front of your eyes. Piece of cake.",
        gridFourNum: "4.",
        gridFourTitle: "After care and guarantees.",
        gridFourText:
          "Our industry leading workmanship guarantee is designed to offer you peace of mind. On the off chance that something goes wrong, we come out and fix it for free. Simple like that. For item faults, we are more than happy to replace them while under warranty (labour costs may apply)",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
    interiorDesignPage: {
      ctaTallyFormLink:
        "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
      title: "This page is currently under construction ",
      titleAccent: "See you soon",
      subtitle:
        "Tired of unreliable contractors and surprise costs? Say goodbye to renovation nightmares and endless contractor headaches. Our streamlined process, transparent communication, and skilled team will take you from 0 to 100 in no time.",
      heroCTA: "Get your quote now - it's free",
      heroImgUrl: "general/living-room-1.webp",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      whatWeDoSection: {
        fullHome: {
          title: "Full home renovation",
          subtitle: "Full house refurbishment.",
          subtitleAccent: " Transform your house into a home.",
          p1: "Renovating your house is a big task. There are a lot of big decisions to be made from design and furnishing to layout and practicality.",
          p2: "Our team will help you make the best decisions and get the best possible outcome from the renovation.",
          CTA: "Renovate your house",
          imgSrc: "/assets/img/general/london-grey-living-room.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        kitchenInstallation: {
          title: "Kitchen installation & Design",
          subtitle: "Your kitchen is the hub of your home.",
          subtitleAccent: " Treat it well.",
          p1: "Bespoke or designed at one of the big kitchen designers, renovating your kitchen will make a huge difference to your home.",
          p2: "Our team of kitchen refurbishment experts and installers will guide you through the whole process",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/contemporary-kitchen.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        bathroomInstallation: {
          title: "Bathroom installation & Design",
          subtitle: "One or two, or five, small or big, your bathroom is",
          subtitleAccent: " important",
          p1: "Designing and fitting a great bathroom will be a treat for the whole house.",
          p2: "Know what you want? Go for installation or get your bathroom designed and installed by us.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/bathroom-design.webp",
          slug: "#tally-open=3x6L5n&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        flooringInstallation: {
          title: "Flooring installation",
          subtitle:
            "Laminate, engineered, tiles, cement, LVT or whatever you might like,",
          subtitleAccent: " your floor will stand out.",
          p1: "One of the biggest features of your home is the floor. It's important to consider the look and the long term practicality of your new flooring.",
          p2: "Whichever option you decide to go with, we will make sure that it's flawlessly installed. We can even help you source it.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/flooring-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        structuralWork: {
          title: "Structural work",
          subtitle: "As great as your home is,",
          subtitleAccent: " it could do with some layout changes.",
          p1: "Circumstances change. What once worked, might not now. Your home can adapt to your needs.",
          p2: "Create another room for your baby, convert your space to open plan or add a new bathroom. Whatever you need, our team can make it happen.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/structural-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        heating: {
          title: "Heating & Boilers",
          subtitle: "Pipework, boiler conversion or installation,",
          subtitleAccent: " underfloor heating systems.",
          p1: "Your home should be comfortable and nothing offers more comfort than the perfect temperature.",
          p2: "Get your home up to date with the perfect heating system for you and your family.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/heating-1.webp",
          slug: "/contact",
        },
      },
      howWeDoItSection: {
        bigGridTitle: "Trustworthy, reliable, friendly.",
        bigGridText:
          "When things get messy, and they do, you'll be happy we're by your side, taking care of all the issues. Design, supply and build. All taken care of.",
        gridOneNum: "1.",
        gridOneTitle: "Expertise through experience.",
        gridOneText:
          "We have been designing and renovating homes in London for over 12 years. We have encountered all possible scenarios and all types of clients. This means we know how to manage anything that comes our way.",
        gridTwoNum: "2.",
        gridTwoTitle: "Detailed, transparent, no fluff quotes.",
        gridTwoText:
          "Worried about 'the actual' price of your renovation? All our estimates and quotes are free, transparent and detailed. What you see is what you get. No more hidden costs that take the cost up by 50% more than initially quoted.",
        gridThreeNum: "3.",
        gridThreeTitle: "Your home. Professionaly refurbished.",
        gridThreeText:
          "Skip the tens of hours spent research and dealing with hard to work with contractors. Let our team of proffesionals do all the heavy lifting for you. Relax, approve and see your dreams come true in front of your eyes. Piece of cake.",
        gridFourNum: "4.",
        gridFourTitle: "After care and guarantees.",
        gridFourText:
          "Our industry leading workmanship guarantees are designed to offer you peace of mind. On the off chance that something goes wrong, we come out and fix it for free. Simple like that. For item faults, we are more than happy to replace them while under warranty (labour costs may apply)",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
    aboutPage: {
      ctaTallyFormLink:
        "#tally-open=wQEoXw&tally-emoji-text=👋&tally-emoji-animation=wave",
      title: "Better Homes Studio! ",
      titleAccent: "Full service renovation company",
      subtitle:
        "We are London based full service renovation company with over 12 years of experience in the field. From bathroom renovations to home extensions, our team has you covered design to build. We are also the proud winners of the Best of Houzz Award two years in a row.",
      heroCTA: "Reach out now",
      heroImgUrl: "social/bh-logo.png",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      whatWeDoSection: {
        fullHome: {
          title: "Full home renovation",
          subtitle: "Full house refurbishment.",
          subtitleAccent: " Transform your house into a home.",
          p1: "Renovating your house is a big task. There are a lot of big decisions to be made from design and furnishing to layout and practicality.",
          p2: "Our team will help you make the best decisions and get the best possible outcome from the renovation.",
          CTA: "Renovate your house",
          imgSrc: "/assets/img/general/london-grey-living-room.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        kitchenInstallation: {
          title: "Kitchen installation & Design",
          subtitle: "Your kitchen is the hub of your home.",
          subtitleAccent: " Treat it well.",
          p1: "Bespoke or designed at one of the big kitchen designers, renovating your kitchen will make a huge difference to your home.",
          p2: "Our team of kitchen refurbishment experts and installers will guide you through the whole process",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/contemporary-kitchen.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        bathroomInstallation: {
          title: "Bathroom installation & Design",
          subtitle: "One or two, or five, small or big, your bathroom is",
          subtitleAccent: " important",
          p1: "Designing and fitting a great bathroom will be a treat for the whole house.",
          p2: "Know what you want? Go for installation or get your bathroom designed and installed by us.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/bathroom-design.webp",
          slug: "#tally-open=3x6L5n&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        flooringInstallation: {
          title: "Flooring installation",
          subtitle:
            "Laminate, engineered, tiles, cement, LVT or whatever you might like,",
          subtitleAccent: " your floor will stand out.",
          p1: "One of the biggest features of your home is the floor. It's important to consider the look and the long term practicality of your new flooring.",
          p2: "Whichever option you decide to go with, we will make sure that it's flawlessly installed. We can even help you source it.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/flooring-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        structuralWork: {
          title: "Structural work",
          subtitle: "As great as your home is,",
          subtitleAccent: " it could do with some layout changes.",
          p1: "Circumstances change. What once worked, might not now. Your home can adapt to your needs.",
          p2: "Create another room for your baby, convert your space to open plan or add a new bathroom. Whatever you need, our team can make it happen.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/structural-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        heating: {
          title: "Heating & Boilers",
          subtitle: "Pipework, boiler conversion or installation,",
          subtitleAccent: " underfloor heating systems.",
          p1: "Your home should be comfortable and nothing offers more comfort than the perfect temperature.",
          p2: "Get your home up to date with the perfect heating system for you and your family.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/heating-1.webp",
          slug: "/contact",
        },
      },
      howWeDoItSection: {
        bigGridTitle: "Trustworthy, reliable, friendly.",
        bigGridText:
          "When things get messy, and they do, you'll be happy we're by your side, taking care of all the issues. Design, supply and build. All taken care of.",
        gridOneNum: "1.",
        gridOneTitle: "Expertise through experience.",
        gridOneText:
          "We have been designing and renovating homes in London for over 12 years. We have encountered all possible scenarios and all types of clients. This means we know how to manage anything that comes our way.",
        gridTwoNum: "2.",
        gridTwoTitle: "Detailed, transparent, no fluff quotes.",
        gridTwoText:
          "Worried about 'the actual' price of your renovation? All our estimates and quotes are free, transparent and detailed. What you see is what you get. No more hidden costs that take the cost up by 50% more than initially quoted.",
        gridThreeNum: "3.",
        gridThreeTitle: "Your home. Professionaly refurbished.",
        gridThreeText:
          "Skip the tens of hours spent research and dealing with hard to work with contractors. Let our team of proffesionals do all the heavy lifting for you. Relax, approve and see your dreams come true in front of your eyes. Piece of cake.",
        gridFourNum: "4.",
        gridFourTitle: "After care and guarantees.",
        gridFourText:
          "Our industry leading workmanship guarantees are designed to offer you peace of mind. On the off chance that something goes wrong, we come out and fix it for free. Simple like that. For item faults, we are more than happy to replace them while under warranty (labour costs may apply)",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
    contactPage: {
      ctaTallyFormLink:
        "#tally-open=wQEoXw&tally-emoji-text=👋&tally-emoji-animation=wave",
      title: "We are always ready talk. ",
      titleAccent: "Ask us anything!",
      subtitle:
        "Want to discuss your project, ask questions about our services and understand how we can help you? Or maybe you'd like to work with us. Fill out the below form and we'll happily answer any query.",
      heroCTA: "Reach out now",
      heroImgUrl: "general/happy-couple-bhs.WEBP",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      whatWeDoSection: {
        fullHome: {
          title: "Full home renovation",
          subtitle: "Full house refurbishment.",
          subtitleAccent: " Transform your house into a home.",
          p1: "Renovating your house is a big task. There are a lot of big decisions to be made from design and furnishing to layout and practicality.",
          p2: "Our team will help you make the best decisions and get the best possible outcome from the renovation.",
          CTA: "Renovate your house",
          imgSrc: "/assets/img/general/london-grey-living-room.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        kitchenInstallation: {
          title: "Kitchen installation & Design",
          subtitle: "Your kitchen is the hub of your home.",
          subtitleAccent: " Treat it well.",
          p1: "Bespoke or designed at one of the big kitchen designers, renovating your kitchen will make a huge difference to your home.",
          p2: "Our team of kitchen refurbishment experts and installers will guide you through the whole process",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/contemporary-kitchen.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        bathroomInstallation: {
          title: "Bathroom installation & Design",
          subtitle: "One or two, or five, small or big, your bathroom is",
          subtitleAccent: " important",
          p1: "Designing and fitting a great bathroom will be a treat for the whole house.",
          p2: "Know what you want? Go for installation or get your bathroom designed and installed by us.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/bathroom-design.webp",
          slug: "#tally-open=3x6L5n&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        flooringInstallation: {
          title: "Flooring installation",
          subtitle:
            "Laminate, engineered, tiles, cement, LVT or whatever you might like,",
          subtitleAccent: " your floor will stand out.",
          p1: "One of the biggest features of your home is the floor. It's important to consider the look and the long term practicality of your new flooring.",
          p2: "Whichever option you decide to go with, we will make sure that it's flawlessly installed. We can even help you source it.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/flooring-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        structuralWork: {
          title: "Structural work",
          subtitle: "As great as your home is,",
          subtitleAccent: " it could do with some layout changes.",
          p1: "Circumstances change. What once worked, might not now. Your home can adapt to your needs.",
          p2: "Create another room for your baby, convert your space to open plan or add a new bathroom. Whatever you need, our team can make it happen.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/structural-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        heating: {
          title: "Heating & Boilers",
          subtitle: "Pipework, boiler conversion or installation,",
          subtitleAccent: " underfloor heating systems.",
          p1: "Your home should be comfortable and nothing offers more comfort than the perfect temperature.",
          p2: "Get your home up to date with the perfect heating system for you and your family.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/heating-1.webp",
          slug: "/contact",
        },
      },
      howWeDoItSection: {
        bigGridTitle: "Trustworthy, reliable, friendly.",
        bigGridText:
          "When things get messy, and they do, you'll be happy we're by your side, taking care of all the issues. Design, supply and build. All taken care of.",
        gridOneNum: "1.",
        gridOneTitle: "Expertise through experience.",
        gridOneText:
          "We have been designing and renovating homes in London for over 12 years. We have encountered all possible scenarios and all types of clients. This means we know how to manage anything that comes our way.",
        gridTwoNum: "2.",
        gridTwoTitle: "Detailed, transparent, no fluff quotes.",
        gridTwoText:
          "Worried about 'the actual' price of your renovation? All our estimates and quotes are free, transparent and detailed. What you see is what you get. No more hidden costs that take the cost up by 50% more than initially quoted.",
        gridThreeNum: "3.",
        gridThreeTitle: "Your home. Professionaly refurbished.",
        gridThreeText:
          "Skip the tens of hours spent research and dealing with hard to work with contractors. Let our team of proffesionals do all the heavy lifting for you. Relax, approve and see your dreams come true in front of your eyes. Piece of cake.",
        gridFourNum: "4.",
        gridFourTitle: "After care and guarantees.",
        gridFourText:
          "Our industry leading workmanship guarantees are designed to offer you peace of mind. On the off chance that something goes wrong, we come out and fix it for free. Simple like that. For item faults, we are more than happy to replace them while under warranty (labour costs may apply)",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
    faqPage: {
      ctaTallyFormLink:
        "#tally-open=wQEoXw&tally-emoji-text=👋&tally-emoji-animation=wave",
      title: "Frequently asked ",
      titleAccent: "questions.",
      subtitle:
        "Read on to find answers to some of the most frequent questions clients ask us. If you don't find what you're looking for, click the button below to get in touch.",
      heroCTA: "Reach out now",
      heroImgUrl: "illustrations/faq.jpg",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      whatWeDoSection: {
        fullHome: {
          title: "Full home renovation",
          subtitle: "Full house refurbishment.",
          subtitleAccent: " Transform your house into a home.",
          p1: "Renovating your house is a big task. There are a lot of big decisions to be made from design and furnishing to layout and practicality.",
          p2: "Our team will help you make the best decisions and get the best possible outcome from the renovation.",
          CTA: "Renovate your house",
          imgSrc: "/assets/img/general/london-grey-living-room.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        kitchenInstallation: {
          title: "Kitchen installation & Design",
          subtitle: "Your kitchen is the hub of your home.",
          subtitleAccent: " Treat it well.",
          p1: "Bespoke or designed at one of the big kitchen designers, renovating your kitchen will make a huge difference to your home.",
          p2: "Our team of kitchen refurbishment experts and installers will guide you through the whole process",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/kitchen/contemporary-kitchen.webp",
          slug: "#tally-open=wvPvbg&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        bathroomInstallation: {
          title: "Bathroom installation & Design",
          subtitle: "One or two, or five, small or big, your bathroom is",
          subtitleAccent: " important",
          p1: "Designing and fitting a great bathroom will be a treat for the whole house.",
          p2: "Know what you want? Go for installation or get your bathroom designed and installed by us.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/bathroom/bathroom-design.webp",
          slug: "#tally-open=3x6L5n&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        flooringInstallation: {
          title: "Flooring installation",
          subtitle:
            "Laminate, engineered, tiles, cement, LVT or whatever you might like,",
          subtitleAccent: " your floor will stand out.",
          p1: "One of the biggest features of your home is the floor. It's important to consider the look and the long term practicality of your new flooring.",
          p2: "Whichever option you decide to go with, we will make sure that it's flawlessly installed. We can even help you source it.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/flooring-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        structuralWork: {
          title: "Structural work",
          subtitle: "As great as your home is,",
          subtitleAccent: " it could do with some layout changes.",
          p1: "Circumstances change. What once worked, might not now. Your home can adapt to your needs.",
          p2: "Create another room for your baby, convert your space to open plan or add a new bathroom. Whatever you need, our team can make it happen.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/structural-1.webp",
          slug: "#tally-open=w2XXag&tally-overlay=1&tally-emoji-text=👋&tally-emoji-animation=wave",
        },
        heating: {
          title: "Heating & Boilers",
          subtitle: "Pipework, boiler conversion or installation,",
          subtitleAccent: " underfloor heating systems.",
          p1: "Your home should be comfortable and nothing offers more comfort than the perfect temperature.",
          p2: "Get your home up to date with the perfect heating system for you and your family.",
          CTA: "Let's discuss your project",
          imgSrc: "/assets/img/general/heating-1.webp",
          slug: "/contact",
        },
      },
      howWeDoItSection: {
        bigGridTitle: "Trustworthy, reliable, friendly.",
        bigGridText:
          "When things get messy, and they do, you'll be happy we're by your side, taking care of all the issues. Design, supply and build. All taken care of.",
        gridOneNum: "1.",
        gridOneTitle: "Expertise through experience.",
        gridOneText:
          "We have been designing and renovating homes in London for over 12 years. We have encountered all possible scenarios and all types of clients. This means we know how to manage anything that comes our way.",
        gridTwoNum: "2.",
        gridTwoTitle: "Detailed, transparent, no fluff quotes.",
        gridTwoText:
          "Worried about 'the actual' price of your renovation? All our estimates and quotes are free, transparent and detailed. What you see is what you get. No more hidden costs that take the cost up by 50% more than initially quoted.",
        gridThreeNum: "3.",
        gridThreeTitle: "Your home. Professionaly refurbished.",
        gridThreeText:
          "Skip the tens of hours spent research and dealing with hard to work with contractors. Let our team of proffesionals do all the heavy lifting for you. Relax, approve and see your dreams come true in front of your eyes. Piece of cake.",
        gridFourNum: "4.",
        gridFourTitle: "After care and guarantees.",
        gridFourText:
          "Our industry leading workmanship guarantees are designed to offer you peace of mind. On the off chance that something goes wrong, we come out and fix it for free. Simple like that. For item faults, we are more than happy to replace them while under warranty (labour costs may apply)",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
    portfolioPage: {
      ctaTallyFormLink:
        "#tally-open=wQEoXw&tally-emoji-text=👋&tally-emoji-animation=wave",
      title: "A picture is worth a thousand words. ",
      titleAccent: "Take a peek at what your home could look like.",
      subtitle:
        "12 years of experience in the field and proud winners of the Best of Houzz Award two years in a row. We've completed hundreds of projects, from bathroom renovations to home extensions. Below are just a couple of examples to give you a taste.",
      heroCTA: "Start your project with us",
      heroImgUrl: "social/bh-logo.png",
      servicesSectionTitle: "What we do",
      servicesSectionSubtitle: "Full service renovation company",
      howWeDoItSection: {
        bigGridTitle: "Trustworthy, reliable, friendly.",
        bigGridText:
          "When things get messy, and they do, you'll be happy we're by your side, taking care of all the issues. Design, supply and build. All taken care of.",
        gridOneNum: "1.",
        gridOneTitle: "Expertise through experience.",
        gridOneText:
          "We have been designing and renovating homes in London for over 12 years. We have encountered all possible scenarios and all types of clients. This means we know how to manage anything that comes our way.",
        gridTwoNum: "2.",
        gridTwoTitle: "Detailed, transparent, no fluff quotes.",
        gridTwoText:
          "Worried about 'the actual' price of your renovation? All our estimates and quotes are free, transparent and detailed. What you see is what you get. No more hidden costs that take the cost up by 50% more than initially quoted.",
        gridThreeNum: "3.",
        gridThreeTitle: "Your home. Professionaly refurbished.",
        gridThreeText:
          "Skip the tens of hours spent research and dealing with hard to work with contractors. Let our team of proffesionals do all the heavy lifting for you. Relax, approve and see your dreams come true in front of your eyes. Piece of cake.",
        gridFourNum: "4.",
        gridFourTitle: "After care and guarantees.",
        gridFourText:
          "Our industry leading workmanship guarantees are designed to offer you peace of mind. On the off chance that something goes wrong, we come out and fix it for free. Simple like that. For item faults, we are more than happy to replace them while under warranty (labour costs may apply)",
      },
      reviewsSection: {
        darkBgTextTitle:
          "You are our top priority. Your satisfaction is our goal.",
        darkBgTextSubtitle:
          "We've built our business on the back of our clients satisfaction. If you are happy, we are happy. To read even more reviews, scroll to the bottom where you'll find links to different platforms with verified reviews.",
        darkBgTextBtn: "Let's discuss",
      },
      faqs: [
        {
          question: "Who is Better Homes Studio?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              We are a full service renovation company based in London. We do
              everything from interior design to building extensions and
              converting lofts. We bet there is nothing you can throw at us that
              we can&apos;t do.
            </div>
          ),
        },
        {
          question: "Are your quotes free?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, our quotes are 100% free, detailed and transparent.
            </div>
          ),
        },
        {
          question: "Do you offer a work guarantee?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes. The BH Studio workmanship guarantee covers our work from 1
              year to 10 years depending on the project. You can read more about{" "}
              <Link href="/our-guarantee">our guarantee here.</Link>
            </div>
          ),
        },
        {
          question: "Can I use BHS just for the build phase?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Yes, if you provide us with the design, our team will take care of
              translating your ideas into reality
            </div>
          ),
        },
        {
          question: "How long will my project take?",
          answer: (
            <div className="space-y-2 leading-relaxed">
              It depends on the size of your project. A bathroom renovation
              usually takes between 10 and 14 working days. A full flat or home
              renovation can take from 3 weeks to 1 and a half months and up
              depending on complexity. For a more specific answer, reach out to
              us.
            </div>
          ),
        },
        {
          question: "Do you offer refferal rewards?",
          answer:
            "Yes, we run the BHS Scheme. This allows you to win a reward for every client you refer that we end up working with. For more information, please reach out.",
        },
        {
          question: "I have another question",
          answer: (
            <div className="space-y-2 leading-relaxed">
              Great, give us a call or fill our form.
            </div>
          ),
        },
      ],
      blogHighlights: [
        {
          title: "We won the Best of Houzz Service Award - 2023",
          date: "23 February 2023",
          imgUrl: "/assets/img/misc/best-of-houzz-winner.png",
          slug: "best-of-houzz-winner-2023",
        },
        {
          title: "Top 5 bathroom design trends in 2023",
          date: "23 January 2023",
          imgUrl: "/assets/img/bathroom/bathroom-design-trend-terrazzo.jpeg",
          slug: "top-5-bathroom-design-trends-in-2023",
        },
        {
          title: "Save money and time with a smart home",
          date: "05 March 2023",
          imgUrl: "/assets/img/smarthome/smarthome-1.webp",
          slug: "smart-home-ideas-2023",
        },
        {
          title: "Small bathroom design & renovation ideas",
          date: "15 February 2023",
          imgUrl:
            "/assets/img/bathroom/vertical-layout-in-small-bathroom-design.jpeg",
          slug: "small-bathroom-design-ideas",
        },
      ],
    },
  },
};

export default config;
