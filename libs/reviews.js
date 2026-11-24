// Verbatim excerpts from published reviews. Wording is copied exactly; "…" marks cuts.
// Checked on Houzz, MyBuilder and Google on 25 November 2026.
const HOUZZ = "https://www.houzz.co.uk/pro/betterhomeslondon/better-homes";
const MYBUILDER = "https://www.mybuilder.com/profile/celli/reviews";
const GOOGLE = "https://g.page/r/CaGIVAg_unOVEBM/";

export const reviews = {
  george: {
    name: "George G",
    context: "Hip-to-gable loft, North East London",
    quote: "…we've got an amazing loft conversion, all done and dusted in just 9 weeks, just like they promised from the get-go.",
    source: "Houzz",
    url: "https://www.houzz.co.uk/viewReview/2013769/better-homes-studio-review",
  },
  danny: {
    name: "Danny M",
    context: "Houzz, October 2024",
    quote: "Now, after more than three years, we're happy to report that everything still looks fantastic",
    source: "Houzz",
    url: HOUZZ,
  },
  chris: {
    name: "Chris",
    context: "Bathroom, bedrooms and hallway",
    quote:
      "Totally trustworthy and transparent from the start… A year later, I experienced a small problem with the plumbing and within a short time, someone from Better Homes was over to check.",
    source: "Houzz",
    url: HOUZZ,
  },
  mia: {
    name: "Mia F.",
    context: "Whole-flat renovation",
    quote: "Gino and his team managed the project seamlessly and kept everything on schedule throughout the renovation.",
    source: "Houzz",
    url: HOUZZ,
  },
  louise: {
    name: "Louise Thorogood",
    context: "Bathroom refurbishment",
    quote: "I could not recommend them more highly. The whole process was so streamlined and efficient.",
    source: "Houzz",
    url: "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
  },
  shyra: {
    name: "Shyra Muthusamy",
    context: "Home renovation",
    quote: "The quality of workmanship is extremely high and they have managed to translate loose ideas … into reality.",
    source: "Houzz",
    url: "https://www.houzz.co.uk/viewReview/1863607/better-homes-studio-review",
  },
  amanda: {
    name: "Amanda Monck",
    context: "Kitchen with a picture-frame steel beam",
    quote:
      "I had been concerned about the installation of the picture frame structural beam… but I needn't have worried because the whole process went very smoothly… I received a detailed quote with no hidden costs.",
    source: "Google",
    url: GOOGLE,
  },
  michelle: {
    name: "Michelle Murugiah",
    context: "Kitchen gutted, remodelled and refitted",
    quote:
      "Celino and his team dealt with each one with ease and experience, this included talking to third parties like Wrens who had sent incorrect or poor quality items.",
    source: "Google",
    url: GOOGLE,
  },
  alice: {
    name: "Alice Fuller",
    context: "Bathroom remodel",
    quote: "Celino remodelled my bathroom, and completed the job to a high standard… The quality of the work was so very good quality for the price charged.",
    source: "Google",
    url: GOOGLE,
  },
  alex: {
    name: "alexylophone",
    context: "Walthamstow: new kitchen, wall removed, new boiler",
    quote:
      "All work was completed on time and any minor issues were taken care of quickly… structural work removing an internal wall adding in a steel beam, and more.",
    source: "MyBuilder",
    url: MYBUILDER,
  },
  gareth: {
    name: "garethd",
    context: "Wanstead: master bathroom",
    quote:
      "…did a great job completely stripping out our master bathroom, bricking in a window and installing all of the fittings including a free standing bath.",
    source: "MyBuilder",
    url: MYBUILDER,
  },
  meltslow: {
    name: "meltslow",
    context: "Holloway: small bathroom",
    quote: "Celino's quote was very detailed which showed he wanted to understand the job in hand.",
    source: "MyBuilder",
    url: MYBUILDER,
  },
  anna: {
    name: "annac2018",
    context: "Bethnal Green: full refurbishment of a 2-bed flat",
    quote: "The refurb project was completed to a high standard…",
    source: "MyBuilder",
    url: MYBUILDER,
  },
};

export const ratings = [
  { source: "Houzz", score: "5.0", count: 51, url: HOUZZ },
  { source: "MyBuilder", score: "5.0", count: 71, url: MYBUILDER },
  { source: "Google", score: "5.0", count: 10, url: GOOGLE },
];

export const reviewsFor = {
  extension: ["amanda", "alex", "danny"],
  loft: ["george", "danny", "amanda"],
  renovation: ["mia", "chris", "anna"],
  kitchen: ["michelle", "amanda", "alex"],
  bathroom: ["gareth", "meltslow", "alice"],
  basement: ["amanda", "danny", "shyra"],
};
