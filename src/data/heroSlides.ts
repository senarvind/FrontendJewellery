export interface HeroSlideData {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  alt: string;
  href: string;
  image?: string;
  isFullBanner?: boolean;
}

export const heroSlides: HeroSlideData[] = [
  {
    id: 1,
    title: "",
    subtitle: "",
    category: "",
    alt: "Keshar Jewellers Wallpaper Banner",
    href: "/products",
    image: "/images/whatsapp.jpeg",
    isFullBanner: true,
  },
  {
    id: 2,
    title: "Flora Mangalsutra",
    subtitle: "A Symbol of Love & Grace",
    category: "SACRED SIGNATURE COLLECTION",
    alt: "Flora Mangalsutra - Pure Gold & Diamond",
    href: "/products/mangalsutra",
    image: "/images/categories/Mangalsutra.png"
  },
  {
    id: 3,
    title: "Bridal Necklace Sets",
    subtitle: "Elegance for Your Special Day",
    category: "ROYAL HERITAGE COLLECTION",
    alt: "Bridal Necklace Set",
    href: "/products/necklace-sets",
    image: "/images/categories/Necklace.png"
  },
  {
    id: 4,
    title: "Festival Collection",
    subtitle: "Pure Gold & Silver Masterpieces for Dhanteras, Diwali & Festivities",
    category: "AUSPICIOUS CELEBRATIONS",
    alt: "Festival Collection - Keshar Jewellers",
    href: "/products/festival-collection",
    image: "/images/categories/08-pendants.jpg"
  }
];