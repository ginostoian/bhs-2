import Navigation from "../components/navigation/Navigation";
import Footer from "../components/footer/Footer";
import "../styles/globals.css";

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
