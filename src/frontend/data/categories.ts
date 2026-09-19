export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image?: string;
  imageClassName?: string;
  gradient: string;
  href: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 1, name: "Necklaces", slug: "necklaces", icon: "📿", image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844000/keshar-categories/Necklace.png", gradient: "from-[#FDE8E9] to-[#F7D2D6]", href: "/products/necklaces" },
  { id: 2, name: "Necklace Sets", slug: "necklace-sets", icon: "✨", gradient: "from-[#FCE4E8] to-[#F5CBD2]", href: "/products/necklace-sets" },
  { id: 3, name: "Earrings", slug: "earrings", icon: "💎", image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844010/keshar-categories/earrings.png", imageClassName: "scale-[1.2] group-hover/item:scale-[1.3]", gradient: "from-[#FDE7EB] to-[#F8D4D9]", href: "/products/earrings" },
  { id: 4, name: "Bangles", slug: "bangles", icon: "⭕", image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844022/keshar-categories/bangels.png", gradient: "from-[#FDEBEF] to-[#F9DBE1]", href: "/products/bangles" },
  { id: 5, name: "Bracelets", slug: "bracelets", icon: "🔗", gradient: "from-[#FCE2E6] to-[#F6C6CD]", href: "/products/bracelets" },
  { id: 6, name: "Rings", slug: "rings", icon: "💍", image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844033/keshar-categories/ring.png", gradient: "from-[#FEE8ED] to-[#FAD4DB]", href: "/products/rings" },
  { id: 7, name: "Mangalsutra", slug: "mangalsutra", icon: "📿", image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844035/keshar-categories/Mangalsutra.jpg", imageClassName: "scale-[1.2] group-hover/item:scale-[1.3]", gradient: "from-[#FDE5EA] to-[#F8CCD4]", href: "/products/mangalsutra" },
  { id: 8, name: "Chains", slug: "chains", icon: "⛓️", image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844037/keshar-categories/07-chains.jpg", gradient: "from-[#EAF2FE] to-[#D5E4FD]", href: "/products/chains" },
  { id: 9, name: "Pendants", slug: "pendants", icon: "🌸", image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844039/keshar-categories/08-pendants.jpg", gradient: "from-[#FDEBF1] to-[#F8D5E1]", href: "/products/pendants" },
  { id: 10, name: "Nose Pins", slug: "nose-pins", icon: "💫", image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844042/keshar-categories/nosepins.jpg", gradient: "from-[#F9EFE5] to-[#F2E0CE]", href: "/products/nose-pins" },
  { id: 11, name: "Maang Tikka", slug: "maang-tikka", icon: "👑", image: "https://res.cloudinary.com/dxq570mvr/image/upload/v1789844056/keshar-categories/maangtka.png", gradient: "from-[#F5F5F5] to-[#E5E5E5]", href: "/products/maang-tikka" },
  { id: 12, name: "Anklets", slug: "anklets", icon: "✨", gradient: "from-[#FDE8E9] to-[#F7D2D6]", href: "/products/anklets" },
  { id: 13, name: "Toe Rings", slug: "toe-rings", icon: "👡", gradient: "from-[#FCE4E8] to-[#F5CBD2]", href: "/products/toe-rings" },
  { id: 14, name: "Kada", slug: "kada", icon: "⭕", gradient: "from-[#FDE7EB] to-[#F8D4D9]", href: "/products/kada" },
  { id: 15, name: "Waist Jewellery", slug: "waist-jewellery", icon: "✨", gradient: "from-[#FCE2E6] to-[#F6C6CD]", href: "/products/waist-jewellery" },
  { id: 16, name: "Bajuband / Armlets", slug: "bajuband-armlets", icon: "💫", gradient: "from-[#FEE8ED] to-[#FAD4DB]", href: "/products/bajuband-armlets" },
  { id: 17, name: "Hair Jewellery", slug: "hair-jewellery", icon: "🌸", gradient: "from-[#FDE5EA] to-[#F8CCD4]", href: "/products/hair-jewellery" },
  { id: 18, name: "Nath", slug: "nath", icon: "💎", gradient: "from-[#EAF2FE] to-[#D5E4FD]", href: "/products/nath" },
  { id: 19, name: "Bridal Jewellery Sets", slug: "bridal-jewellery-sets", icon: "👑", gradient: "from-[#FDEBF1] to-[#F8D5E1]", href: "/products/bridal-jewellery-sets" },
];

export const SPECIAL_COLLECTIONS: CategoryItem[] = [
  { id: 101, name: "Evil Eye", slug: "evil-eye", icon: "🧿", gradient: "from-[#EBF4FF] to-[#D0E2FF]", href: "/products/evil-eye" },
  { id: 102, name: "Kids & Baby", slug: "kids", icon: "🎀", gradient: "from-[#FFF0F5] to-[#FFD8E4]", href: "/products/kids" },
  { id: 103, name: "Silver Pens", slug: "pens", icon: "🖊️", gradient: "from-[#F0F4F8] to-[#D9E2EC]", href: "/products/pens" },
  { id: 104, name: "Pure Utensils", slug: "utensils", icon: "🏺", gradient: "from-[#FFF5EB] to-[#FFE4CC]", href: "/products/utensils" },
  { id: 105, name: "Silver Artifacts", slug: "artifacts", icon: "🪔", gradient: "from-[#FFF8E7] to-[#FEEBC8]", href: "/products/artifacts" },
  { id: 106, name: "Coins & Bars", slug: "coins-bars", icon: "🪙", gradient: "from-[#FFFBEB] to-[#FEF3C7]", href: "/products/coins-bars" },
  { id: 107, name: "Pooja Articles", slug: "pooja-articles", icon: "🕉️", gradient: "from-[#FDF2F8] to-[#FCE7F3]", href: "/products/pooja-articles" },
];

export const FEATURED_JEWELLERY_SLUGS = [
  "mangalsutra",
  "chains",
  "pendants",
  "bridal-jewellery-sets",
  "necklaces",
  "necklace-sets",
];

