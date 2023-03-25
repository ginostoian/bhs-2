import Navigation from "../components/navigation/Navigation";
import "../styles/globals.css";

import Footer from "../components/footer/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
