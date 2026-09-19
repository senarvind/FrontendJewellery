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
    href: "/products/price/under-999"
  },
  {
    id: 2,
    badge: "🪔 FESTIVE SPECIAL",
    badgeType: "premium",
    title: "Auspicious Festive Jewellery",
    priceLabel: "Festival Collection",
    itemsDescription: "Pure 92.5 Silver & Gold Festive Pieces",
    icon: "🪔",
    href: "/products/festival-collection"
  },
  {
    id: 3,
    badge: "👑 CUSTOM MADE",
    badgeType: "luxe",
    title: "Customized & Bespoke Jewellery",
    priceLabel: "Customer On Demand",
    itemsDescription: "Personalized Designs, Custom Engravings & Bespoke Orders",
    icon: "👑",
    href: "/products/customized-jewellery"
  }
];
