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
    badge: "💖 MOST POPULAR",
    badgeType: "bestseller",
    title: "Most Liked Products",
    priceLabel: "Most Liked Products",
    itemsDescription: "Customer Favorites & Trending Hallmarked Jewellery",
    icon: "💖",
    href: "/products/all"
  },
  {
    id: 2,
    badge: "✨ BEST SELLER",
    badgeType: "bestseller",
    title: "Silver Earrings & Studs",
    priceLabel: "Under ₹999",
    itemsDescription: "Pure 92.5% Silver Rings, Studs & Hoops",
    icon: "✨",
    href: "/products/price/under-999"
  },
  {
    id: 3,
    badge: "🪔 FESTIVE SPECIAL",
    badgeType: "premium",
    title: "Auspicious Festive Jewellery",
    priceLabel: "Festival Collection",
    itemsDescription: "Pure 92.5 Silver & Gold Festive Pieces",
    icon: "🪔",
    href: "/products/festival-collection"
  },
  {
    id: 4,
    badge: "👑 CUSTOM MADE",
    badgeType: "luxe",
    title: "Customized & Bespoke Jewellery",
    priceLabel: "Customer On Demand",
    itemsDescription: "Personalized Designs, Custom Engravings & Bespoke Orders",
    icon: "👑",
    href: "/products/customized-jewellery"
  }
];
