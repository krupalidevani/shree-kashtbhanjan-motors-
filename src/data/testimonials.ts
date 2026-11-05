export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
};

/**
 * SAMPLE CONTENT ONLY — these are not real customer reviews.
 * Replace with genuine reviews (with the customer's permission) when available,
 * then set `testimonialsAreSamples` to false to remove the "sample" labels.
 */
export const testimonialsAreSamples = true;

export const testimonials: Testimonial[] = [
  {
    quote:
      "Sample review: this space will show what a customer says about the quality of service, the team and the overall experience at the garage.",
    name: "Sample Customer",
    detail: "Placeholder — real review coming soon",
  },
  {
    quote:
      "Sample review: a second customer testimonial will appear here, for example feedback about timely delivery and clear communication.",
    name: "Sample Customer",
    detail: "Placeholder — real review coming soon",
  },
  {
    quote:
      "Sample review: a third testimonial will go here once genuine customer reviews are collected and approved for the website.",
    name: "Sample Customer",
    detail: "Placeholder — real review coming soon",
  },
];
