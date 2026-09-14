import { businessFacts } from "@/libs/businessFacts";
export const SERVICE_AREA_GROUPS = [
  {
    regionTitle: "East and North East London",
    regionDescription:
      "Our primary delivery patch for terraces, family homes and renovation projects where local planning and access knowledge matter.",
    locations: [
      { name: "Hackney", slug: "hackney" },
      { name: "Dalston", slug: "dalston" },
      { name: "Walthamstow", slug: "walthamstow" },
      { name: "Leytonstone", slug: "leytonstone" },
      { name: "Leyton", slug: "leyton" },
      { name: "Woodford", slug: "woodford" },
      { name: "South Woodford", slug: "south-woodford" },
      { name: "Chingford", slug: "chingford" },
    ],
  },
  {
    regionTitle: "North and North West London",
    regionDescription:
      "Period properties and established family neighbourhoods where scope, structure and finish quality need joined-up planning.",
    locations: [
      { name: "Islington", slug: "islington" },
      { name: "Hampstead", slug: "hampstead" },
      { name: "Finsbury Park", slug: "finsbury-park" },
      { name: "Barnet", slug: "barnet" },
      { name: "Camden Town", slug: "camden-town" },
    ],
  },
  {
    regionTitle: "Central London – selective",
    regionDescription:
      "For the right project where access, programme control and discreet delivery justify a carefully managed full-service team.",
    locations: [
      { name: "Marylebone", slug: "marylebone" },
      { name: "Westminster", slug: "westminster" },
      { name: "City of London", slug: "city-of-london" },
    ],
  },
];

export const trustBarItems = () => [
  {
    headline: businessFacts.insuranceHeadline,
    subtext: "Confirm current policy scope before committing",
  },
  {
    headline: businessFacts.guaranteeHeadline,
    subtext: "10 years structural, extensions and lofts; 2 years kitchen and bathroom installation; 1 year decoration",
  },
  {
    headline: businessFacts.expertise,
    subtext: "Extensions, lofts and whole-home renovations",
  },
  {
    headline: "Weekly project updates",
    subtext: "Clear progress, decisions and next steps",
  },
];
