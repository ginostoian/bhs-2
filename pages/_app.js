import Script from "next/script";

import Navigation from "../components/navigation/Navigation";
import Footer from "../components/footer/Footer";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        async
        src="https://tally.so/widgets/embed.js"
      />
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
