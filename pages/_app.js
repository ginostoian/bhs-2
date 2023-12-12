import Script from "next/script";

import Navigation from "../components/navigation/Navigation";
import Footer from "../components/footer/Footer";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-79F5GFQ1GP"
      ></Script>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-79F5GFQ1GP');
        `}
      </Script>
      <Script id="hotjar">
        {`
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:3786664,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
      </Script>
      <Script
        async
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          Tally.loadEmbeds();
        }}
      />
      <Navigation />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
