// Subscription tiers as implemented, from reference/SUBSCRIPTIONS_AND_PROMOTIONS.md
// ("Implemented access", 2026-09-09). No prices: storefront prices are not verified.
// Advanced Arete for Max is deferred and must not be advertised.

export interface Plan {
  id: "free" | "plus" | "max";
  name: string;
  includes: string[];
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    includes: [
      "Calendar, practice, proof and reminders",
      "History, progress and earned badges",
      "Friends, feedback and the feed",
      "A starter avatar wardrobe and 20 calendar backgrounds",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    includes: [
      "Everything in Free",
      "A broad avatar wardrobe and 48 calendar backgrounds",
      "Practice insights: 7, 30 and 90-day comparisons by pattern",
      "Saved practice plans",
    ],
  },
  {
    id: "max",
    name: "Max",
    includes: [
      "Everything in Plus",
      "The complete avatar wardrobe and all 77 calendar backgrounds",
    ],
  },
];
