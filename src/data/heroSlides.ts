export interface HeroSlideData {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  alt: string;
  href: string;
  image?: string;
}

export const heroSlides: HeroSlideData[] = [
  {
    id: 1,
    title: "Flora Mangalsutra",
    subtitle: "A Symbol of Love & Grace",
    category: "SACRED SIGNATURE COLLECTION",
    alt: "Flora Mangalsutra - Pure Gold & Diamond",
    href: "/products/mangalsutra",
    image: "/images/categories/Mangalsutra.png"
  },
  {
    id: 2,
    title: "Bridal Necklace Sets",
    subtitle: "Elegance for Your Special Day",
    category: "ROYAL HERITAGE COLLECTION",
    alt: "Bridal Necklace Set",
    href: "/products/necklace-sets",
    image: "/images/categories/Necklace.png"
  },
  {
    id: 3,
    title: "Diamond & Gold Rings",
    subtitle: "Crafted for Perfection",
    category: "TIMELESS CLASSICS",
    alt: "Diamond and Gold Rings",
    href: "/products/rings",
    image: "/images/categories/ring.png"
  },
  {
    id: 4,
    title: "Royal Gold Bangles",
    subtitle: "Traditional Heritage Craftsmanship",
    category: "ROYAL BANGLE COLLECTION",
    alt: "Royal Gold & Silver Bangles",
    href: "/products/bangles",
    image: "/images/categories/bangels.png"
  },
  {
    id: 5,
    title: "Exquisite Earrings",
    subtitle: "Sparkle with Timeless Beauty",
    category: "EXCLUSIVE EARRING SELECTION",
    alt: "Exquisite Gold & Silver Earrings",
    href: "/products/earrings",
    image: "/images/categories/earrings.png"
  }
];