export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mcbyrnecreative.com";

export const BUSINESS = {
  name: "New Day Power Wash",
  legalName: "New Day Power Wash",
  phone: "+19255184931",
  phoneDisplay: "(925) 518-4931",
  email: "info@newdaypowerwash.com",
  primaryCity: "Livermore",
  region: "CA",
  country: "US",
  priceRange: "$$",
} as const;

export const SERVICE_CITIES = [
  {
    name: "Livermore",
    region: "CA",
    headline: "Power Washing in Livermore",
    description:
      "Residential driveway, patio, and stucco cleaning across Livermore, plus HOA and community power washing in the Tri-Valley.",
    highlights: ["Driveways & pavers", "Soft-wash siding", "HOA common areas"],
  },
  {
    name: "Dublin",
    region: "CA",
    headline: "Pressure Washing in Dublin",
    description:
      "Residential pressure washing for Dublin homes and townhomes, plus HOA and community properties.",
    highlights: ["Townhome exteriors", "HOA common areas", "Sidewalk cleaning"],
  },
  {
    name: "Pleasanton",
    region: "CA",
    headline: "Power Washing in Pleasanton",
    description:
      "Restore curb appeal with professional cleaning for Pleasanton driveways, decks, and building exteriors.",
    highlights: ["Concrete driveways", "Wooden decks", "Building exteriors"],
  },
  {
    name: "San Ramon",
    region: "CA",
    headline: "Pressure Washing in San Ramon",
    description:
      "Residential pressure washing throughout San Ramon neighborhoods, plus HOA and leasing office services.",
    highlights: ["Home driveways & patios", "HOA communities", "Fence & patio cleaning"],
  },
  {
    name: "Danville",
    region: "CA",
    headline: "Power Washing in Danville",
    description:
      "Residential soft wash and surface restoration for Danville homes and walkways, plus HOA communities.",
    highlights: ["Home exteriors", "Walkways & patios", "HOA common areas"],
  },
] as const;

export const SEO_KEYWORDS = [
  "power washing Livermore",
  "pressure washing Dublin CA",
  "power washing Pleasanton",
  "pressure washing San Ramon",
  "power washing Danville",
  "Tri-Valley power washing",
  "Bay Area pressure washing",
  "driveway cleaning Livermore",
  "HOA power washing",
  "soft wash Bay Area",
  "residential power washing",
];

export const DEFAULT_TITLE =
  "New Day Power Wash | Bay Area Power Washing in Livermore, Dublin, Pleasanton & Tri-Valley";

export const DEFAULT_DESCRIPTION =
  "Professional residential power washing in Livermore, Dublin, Pleasanton, San Ramon, Danville, and the Bay Area, plus HOA and property management services. Get an instant photo quote today.";

export const LOCAL_FAQS = [
  {
    question: "What cities do you serve?",
    answer:
      "Livermore, Dublin, Pleasanton, San Ramon, Danville, and nearby Tri-Valley and East Bay communities.",
  },
  {
    question: "How much does power washing cost?",
    answer:
      "Most residential jobs start at $149 for a driveway and walkway. Upload a photo for an instant quote or contact us for a custom estimate.",
  },
  {
    question: "Do you offer free estimates?",
    answer:
      "Yes. Use the photo quote tool on this page or call (925) 518-4931.",
  },
  {
    question: "Do you pressure wash driveways and patios?",
    answer:
      "Yes. Driveways, patios, decks, siding, and more, using the right pressure or soft-wash method for each surface.",
  },
] as const;
