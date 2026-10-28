// Verbatim excerpts from published client reviews. Only add context (project type, area)
// that the review itself states. Checked against the Houzz review pages on 29 October 2026.
const houzz = {
  louise: {
    name: "Louise Thorogood",
    context: "Bathroom refurbishment",
    quote:
      "I could not recommend them more highly. The whole process was so streamlined and efficient.",
    source: "Houzz",
    url: "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
  },
  george: {
    name: "George G",
    context: "Hip-to-gable loft, North East London",
    quote:
      "…we've got an amazing loft conversion, all done and dusted in just 9 weeks, just like they promised from the get-go.",
    source: "Houzz",
    url: "https://www.houzz.co.uk/viewReview/2013769/better-homes-studio-review",
  },
  shyra: {
    name: "Shyra Muthusamy",
    context: "Home renovation",
    quote:
      "The quality of workmanship is extremely high and they have managed to translate loose ideas … into reality.",
    source: "Houzz",
    url: "https://www.houzz.co.uk/viewReview/1863607/better-homes-studio-review",
  },
};

const client = {
  jack: {
    name: "Jack Robertson",
    context: "Complete renovation, Chingford",
    quote:
      "Better Homes did a fantastic job carrying out a complete renovation of our 1930s ‘chalet bungalow’ in Chingford.",
    source: "Client review",
  },
  alice: {
    name: "Alice Buchanan",
    context: "Kitchen renovation",
    quote:
      "I had our kitchen redone and couldn’t be happier! … They worked so incredibly hard to get everything completed within time and at a high standard.",
    source: "Client review",
  },
};

export const serviceReviews = {
  "/house-extension": houzz.shyra,
  "/loft-conversion": houzz.george,
  "/general-renovation": client.jack,
  "/kitchen-renovation": client.alice,
  "/bathroom-renovation": houzz.louise,
  "/basement-conversion": houzz.shyra,
};
