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
  // OAuth discovery documents for AI connectors using the admin MCP server
  async rewrites() {
    return [
      {
        source: "/.well-known/oauth-authorization-server/:path*",
        destination: "/api/oauth/metadata",
      },
      {
        source: "/.well-known/openid-configuration/:path*",
        destination: "/api/oauth/metadata",
      },
      {
        source: "/.well-known/oauth-protected-resource/:path*",
        destination: "/api/oauth/protected-resource",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/blog/home-renovation-cost-in-london-the-complete-2026-price-guide",
        destination: "/blog/home-renovation-cost-london-2026",
        permanent: true,
      },
      {
        source: "/blog/loft-conversions-complete-guide-2026",
        destination: "/blog/loft-conversions-london-complete-guide-2026",
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
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "bhs-2.vercel.app",
          },
        ],
        destination: "https://bhstudio.co.uk/:path*",
        permanent: true,
      },
      {
        source: "/locations/south-woodford",
        destination: "/locations/woodford",
        permanent: true,
      },
      {
        source: "/locations/chigwell",
        destination: "/locations/woodford",
        permanent: true,
      },
      {
        source: "/locations/loughton",
        destination: "/locations/woodford",
        permanent: true,
      },
      {
        source: "/locations/theydon-bois",
        destination: "/locations/woodford",
        permanent: true,
      },
      {
        source: "/locations/edmonton",
        destination: "/locations/chingford",
        permanent: true,
      },
      {
        source: "/locations/enfield",
        destination: "/locations/chingford",
        permanent: true,
      },
      {
        source: "/locations/wood-green",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/leyton",
        destination: "/locations/leytonstone",
        permanent: true,
      },
      {
        source: "/locations/stratford",
        destination: "/locations/leytonstone",
        permanent: true,
      },
      {
        source: "/locations/poplar",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/canary-wharf",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/rotherhithe",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/whitechapel",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/southwark",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/lambeth",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/south-bank",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/westminster",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/mayfair",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/soho",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/city-of-london",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/paddington",
        destination: "/locations/notting-hill",
        permanent: true,
      },
      {
        source: "/locations/camden-town",
        destination: "/locations/hampstead",
        permanent: true,
      },
      {
        source: "/locations/marylebone",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/finsbury-park",
        destination: "/locations/islington",
        permanent: true,
      },
      {
        source: "/locations/alexandra-park",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/locations/barnet",
        destination: "/locations",
        permanent: true,
      },
      {
        source: "/blog/house-extension-guide-2025",
        destination: "/blog/house-extension-types",
        permanent: true,
      },
      {
        source: "/blog/extension-guide-2025",
        destination: "/blog/house-extension-types",
        permanent: true,
      },
      {
        source: "/blog/permitted-development-guide",
        destination: "/blog/house-extension-types",
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
