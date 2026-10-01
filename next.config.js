const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Forme loads its WASM engine from node_modules at runtime; don't bundle it
    serverComponentsExternalPackages: ["@formepdf/core", "@formepdf/react"],
    // Fonts are read from disk when rendering PDFs
    outputFileTracingIncludes: {
      "/api/quotes/[id]/pdf": ["./libs/pdf/fonts/**/*"],
      "/api/invoices/[token]/pdf": ["./libs/pdf/fonts/**/*"],
      "/api/admin/invoicing/[id]/pdf": ["./libs/pdf/fonts/**/*"],
      "/api/admin/quoting/pdf": ["./libs/pdf/fonts/**/*"],
    },
  },
  async redirects() {
    return [
      {
        source: "/blog/home-renovation-cost-in-london-the-complete-2026-price-guide",
        destination: "/blog/home-renovation-cost-london-2026",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.bhstudio.co.uk",
          },
        ],
        destination: "https://bhstudio.co.uk/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
    ],
  },
};

module.exports = nextConfig;
