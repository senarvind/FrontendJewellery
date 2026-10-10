export interface HeroSlideData {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  alt: string;
  href: string;
  image?: string;
  isFullBanner?: boolean;
  isBrandPoster?: boolean;
}

export const heroSlides: HeroSlideData[] = [
  {
    id: 1,
    title: "",
    subtitle: "",
    category: "",
    alt: "Keshar Jewellers Brand Poster Banner",
    href: "/products",
    isBrandPoster: true,
  },
  {
    id: 2,
    title: "Flora Mangalsutra",
    subtitle: "A Symbol of Love & Grace",
    category: "SACRED SIGNATURE COLLECTION",
    alt: "Flora mangalsutra with black beads – Keshar Jewellers",
    href: "/products/mangalsutra",
    image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844035/keshar-categories/Mangalsutra.jpg"
  },
  {
    id: 3,
    title: "Bridal Jewellery Sets",
    subtitle: "Elegance for Your Special Day",
    category: "ROYAL HERITAGE COLLECTION",
    alt: "Bridal Jewellery Set",
    href: "/products/bridal-jewellery-sets",
    image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844000/keshar-categories/Necklace.png"
  },
  {
    id: 4,
    title: "Festival Collection",
    subtitle: "Pure Gold & Silver Masterpieces for Dhanteras, Diwali & Festivities",
    category: "AUSPICIOUS CELEBRATIONS",
    alt: "Festival Collection - Keshar Jewellers",
    href: "/products/festival-collection",
    image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844039/keshar-categories/08-pendants.jpg"
  }
];