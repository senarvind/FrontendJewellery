export interface PriceTier {
  id: number;
  badge: string;
  badgeType: "bestseller" | "premium" | "luxe";
  title: string;
  priceLabel: string;
  itemsDescription: string;
  icon: string;
  href: string;
}

export const PRICE_TIERS: PriceTier[] = [
  {
    id: 1,
    badge: "✨ BEST SELLER",
    badgeType: "bestseller",
    title: "Silver Earrings & Studs",
    priceLabel: "Under ₹999",
    itemsDescription: "Pure 92.5% Silver Rings, Studs & Hoops",
    icon: "✨",
    href: "/products/earrings"
  },
  {
    id: 2,
    badge: "💎 PREMIUM",
    badgeType: "premium",
    title: "Flora Mangalsutras & Sets",
    priceLabel: "Under ₹1,999",
    itemsDescription: "Designer Mangalsutras & Pendants",
    icon: "💎",
    href: "/products/mangalsutras"
  },
  {
    id: 3,
    badge: "🎁 LUXE",
    badgeType: "luxe",
    title: "Evil Eye & Bridal Luxe Sets",
    priceLabel: "Under ₹2,999",
    itemsDescription: "Handcrafted Bracelets, Chains & Sets",
    icon: "🎁",
    href: "/products"
  }
];
