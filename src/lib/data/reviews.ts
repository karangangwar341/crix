import { Review } from "@/lib/types";

const names = [
  "James H.", "Aarav P.", "Charlotte W.", "Liam K.", "Sofia M.", "Ben T.",
  "Isla R.", "Noah D.", "Grace L.", "Ethan B.", "Mia C.", "Oscar F.",
];

const titles = [
  "Exceptional pickup",
  "Better than my last three bats combined",
  "Worth every penny",
  "The sweet spot is enormous",
  "Beautiful craftsmanship",
  "Exactly as described",
  "My timing has never been better",
  "Premium feel from the first net session",
];

const bodies = [
  "Picked this up for the new season and the difference in pickup is immediate — feels much lighter than the stated weight.",
  "The finish on this bat is genuinely gorgeous. Grain count matched what was promised and the sticker work is flawless.",
  "Took a few overs to find the middle but once I did, the ball was flying off the middle with barely any effort.",
  "Ordered after using the Find Your Bat quiz and it nailed the recommendation. Balance point is spot on for my style.",
  "Delivery was fast and the bat arrived properly pressed and ready to knock in. Detailed spec sheet included.",
  "This is my third bat from them and the consistency across grades is what keeps me coming back.",
];

const tagsPool: Review["tags"][] = [
  ["Performance"],
  ["Pickup"],
  ["Balance"],
  ["Looks"],
  ["Performance", "Pickup"],
  ["Balance", "Looks"],
];

export function generateReviews(productId: string, count: number, ratingBase: number): Review[] {
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      id: `${productId}-review-${i}`,
      productId,
      author: names[i % names.length],
      verified: i % 3 !== 0,
      rating: Math.max(3, Math.min(5, Math.round(ratingBase + ((i % 5) - 2) * 0.3))),
      title: titles[i % titles.length],
      body: bodies[i % bodies.length],
      tags: tagsPool[i % tagsPool.length],
      date: new Date(2025, (i * 3) % 12, ((i * 7) % 27) + 1).toISOString(),
    });
  }
  return reviews;
}
