module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/globals.css",
  ],
  theme: {
    extend: {
      colors: {
        brand: { ink: "#202925", chalk: "#F4F1EA", olive: "#4D5B4B", stone: "#D8D2C6", clay: "#A65B43" },
        blue: {50:"#F4F1EA",100:"#EDE9E0",200:"#D8D2C6",300:"#B6BEAE",400:"#89977F",500:"#66775F",600:"#4D5B4B",700:"#3E4A3C",800:"#303B30",900:"#202925",950:"#19211D"},
        indigo: {50:"#F4F1EA",100:"#EDE9E0",200:"#D8D2C6",300:"#B6BEAE",400:"#89977F",500:"#66775F",600:"#4D5B4B",700:"#3E4A3C",800:"#303B30",900:"#202925",950:"#19211D"},
      },
      borderRadius: { xl: "6px", "2xl": "6px", "3xl": "6px" },
      fontFamily: { sans: ["Satoshi", "Arial", "sans-serif"] },
      screens: {
        xs: "475px",
      },
      backgroundImage: {
        gradient:
          "linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)",
      },
      animation: {
        opacity: "opacity 0.25s ease-in-out",
        appearFromRight: "appearFromRight 300ms ease-in-out",
        wiggle: "wiggle 1.5s ease-in-out infinite",
        popup: "popup 0.25s ease-in-out",
        shimmer: "shimmer 3s ease-out infinite alternate",
      },
      keyframes: {
        opacity: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        appearFromRight: {
          "0%": { opacity: 0.3, transform: "translate(15%, 0px);" },
          "100%": { opacity: 1, transform: "translate(0);" },
        },
        wiggle: {
          "0%, 20%, 80%, 100%": {
            transform: "rotate(0deg)",
          },
          "30%, 60%": {
            transform: "rotate(-2deg)",
          },
          "40%, 70%": {
            transform: "rotate(2deg)",
          },
          "45%": {
            transform: "rotate(-4deg)",
          },
          "55%": {
            transform: "rotate(4deg)",
          },
        },
        popup: {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "0 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // Light & dark themes are added by default (it switches automatically based on OS settings)
    // You can add another theme among the list of 30+
    // Add "data-theme='theme_name" to any HTML tag to enable the 'theme_name' theme.
    // https://daisyui.com/
    themes: [{ light: { "primary": "#4D5B4B", "primary-content": "#FFFFFF", "secondary": "#202925", "secondary-content": "#F4F1EA", "accent": "#A65B43", "neutral": "#202925", "base-100": "#F4F1EA", "base-200": "#EDE9E0", "base-300": "#D8D2C6", "base-content": "#202925", "--rounded-box": "6px", "--rounded-btn": "6px" } }],
  },
};
