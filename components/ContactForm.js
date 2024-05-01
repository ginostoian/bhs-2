"use client";

import { useEffect, useState } from "react";

import React from "react";

const ContactForm = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const scriptTag = document.createElement("script");

    scriptTag.src = "https://tally.so/widgets/embed.js";
    scriptTag.addEventListener("load", () => setLoaded(true));

    document.body.appendChild(scriptTag);
  }, []);
  return (
    <div>
      <iframe
        data-tally-src="https://tally.so/embed/wQEoXw?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        width="100%"
        height="300"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Contact us"
        className="contact-iframe"
        id="contactForm"
      ></iframe>
    </div>
  );
};

export default ContactForm;
