/**
 * Per-category SEO copy: page <title>, meta description, visible H1 and a short intro.
 * Keep it truthful — owner can edit any line. Titles get " | Keshar Jewellers Sehore"
 * appended automatically by the root layout title template.
 */
export interface CategorySeo {
  title: string;
  description: string;
  h1: string;
  intro: string;
}

export const CATEGORY_SEO: Record<string, CategorySeo> = {
  necklaces: {
    title: "Silver & Gold Necklaces",
    description: "Shop hallmarked 92.5 silver and 22K gold necklaces at Keshar Jewellers, Sarafa Market, Sehore. Daily-wear chokers to bridal designs with clear weight and price.",
    h1: "Silver & Gold Necklaces",
    intro: "From light daily-wear chains to statement chokers and bridal necklaces, every piece is BIS hallmarked. Choose 92.5 sterling silver or 22K (916) gold, see the exact weight and price, and visit our Sarafa Market showroom in Sehore to try it on.",
  },
  earrings: {
    title: "Silver Earrings – Jhumkas, Studs & Hoops",
    description: "Hallmarked 92.5 silver earrings – jhumkas, studs, hoops and danglers – from Keshar Jewellers, Sehore. Skin-friendly, light and made for everyday wear.",
    h1: "Silver Earrings – Jhumkas, Studs & Hoops",
    intro: "Traditional jhumkas, simple studs, hoops and stone-set danglers in pure 92.5 sterling silver. Light enough for daily wear and festive enough for weddings – each pair is hallmarked and priced by weight.",
  },
  bangles: {
    title: "Silver & Gold Bangles",
    description: "Buy hallmarked 92.5 silver and 22K gold bangles at Keshar Jewellers, Sehore. Plain, oxidised and designer bangles in all sizes.",
    h1: "Silver & Gold Bangles",
    intro: "Plain, oxidised and designer bangles in 92.5 sterling silver and BIS hallmarked 22K gold. Tell us your size (2.2 to 2.10) on WhatsApp and we will help you choose the perfect fit.",
  },
  bracelets: {
    title: "Silver Bracelets for Women & Men",
    description: "925 sterling silver bracelets for women and men at Keshar Jewellers, Sehore – chain, charm and stone-set designs, hallmarked and priced by weight.",
    h1: "Silver Bracelets for Women & Men",
    intro: "Chain, charm, stone-set and kada-style bracelets in hallmarked 92.5 silver. A thoughtful gift for birthdays, Raksha Bandhan and anniversaries, available at our Sehore showroom and online.",
  },
  rings: {
    title: "Silver & Gold Rings",
    description: "Hallmarked 92.5 silver and 22K gold rings – solitaire-style, stone-set and plain bands – at Keshar Jewellers, Sarafa Market, Sehore.",
    h1: "Silver & Gold Rings",
    intro: "Everyday bands, stone-set and statement rings in 92.5 sterling silver and BIS hallmarked 22K gold. Not sure of your ring size? Visit us in Sehore or message us on WhatsApp for help.",
  },
  mangalsutra: {
    title: "Mangalsutra Designs – Gold & Silver",
    description: "Traditional and modern mangalsutra designs in 22K hallmarked gold and 92.5 silver at Keshar Jewellers, Sehore. Short daily-wear and long bridal styles.",
    h1: "Mangalsutra Designs",
    intro: "Short daily-wear and long traditional mangalsutras with black beads, in BIS hallmarked 22K gold and 92.5 silver. Each design is made to last, with honest weight and making charges.",
  },
  chains: {
    title: "Silver & Gold Chains",
    description: "Strong, hallmarked 92.5 silver and 22K gold chains for men and women at Keshar Jewellers, Sehore – rope, box, curb and daily-wear designs.",
    h1: "Silver & Gold Chains",
    intro: "Rope, box, curb and fine daily-wear chains for men and women in 92.5 sterling silver and 22K gold. Pick your length and weight, and pair it with a pendant from our collection.",
  },
  pendants: {
    title: "Silver & Gold Pendants",
    description: "Religious, initial and stone-set pendants in hallmarked 92.5 silver and 22K gold at Keshar Jewellers, Sehore.",
    h1: "Silver & Gold Pendants",
    intro: "Om, Ganesh and other religious pendants, initials and stone-set lockets in 92.5 silver and 22K gold. Every pendant is hallmarked and can be paired with a matching chain.",
  },
  "nose-pins": {
    title: "Silver Nose Pins",
    description: "Small, comfortable 92.5 silver nose pins with stone and plain designs at Keshar Jewellers, Sehore. Hallmarked, skin-friendly and affordable.",
    h1: "Silver Nose Pins",
    intro: "Tiny everyday studs, stone-set and screw-type nose pins in skin-friendly 92.5 sterling silver. Light, comfortable and hallmarked – perfect for daily wear.",
  },
  "maang-tikka": {
    title: "Maang Tikka Designs",
    description: "Bridal and festive maang tikka designs in 92.5 silver and gold finish at Keshar Jewellers, Sehore.",
    h1: "Maang Tikka Designs",
    intro: "Elegant maang tikkas for brides, bridesmaids and festive occasions in 92.5 silver and gold. Match it with our bridal sets and nath for a complete traditional look.",
  },
  anklets: {
    title: "Silver Payal (Anklets)",
    description: "Hallmarked 92.5 silver payal (anklets) – ghungroo, daily-wear and bridal designs – sold single or in pairs at Keshar Jewellers, Sehore.",
    h1: "Silver Payal (Anklets)",
    intro: "Ghungroo, chain and bridal payal in pure 92.5 sterling silver, sold as a single anklet or a pair. Each payal is hallmarked and priced by its exact weight.",
  },
  "toe-rings": {
    title: "Silver Bichhiya (Toe Rings)",
    description: "Traditional 92.5 silver bichhiya (toe rings) at Keshar Jewellers, Sehore – adjustable, comfortable and hallmarked.",
    h1: "Silver Bichhiya (Toe Rings)",
    intro: "Traditional and modern bichhiya in pure 92.5 sterling silver. Adjustable, comfortable for everyday wear and an essential part of every bride's jewellery.",
  },
  kada: {
    title: "Silver & Gold Kada for Men & Women",
    description: "Heavy and light kada designs in 92.5 silver and 22K gold for men and women at Keshar Jewellers, Sehore.",
    h1: "Silver & Gold Kada",
    intro: "Plain, carved and designer kadas for men and women in hallmarked 92.5 silver and 22K gold. Solid, long-lasting pieces sold at honest weight and price.",
  },
  "waist-jewellery": {
    title: "Silver Kamarbandh (Waist Jewellery)",
    description: "Handcrafted 92.5 silver kamarbandh and waist chains for brides and festive wear at Keshar Jewellers, Sehore.",
    h1: "Silver Kamarbandh (Waist Jewellery)",
    intro: "Handcrafted kamarbandh and waist chains in 92.5 sterling silver for brides and festive occasions. Adjustable fit with traditional designs.",
  },
  "hair-jewellery": {
    title: "Bridal Hair Jewellery",
    description: "Bridal hair jewellery – jhoomar, hair pins and choti accessories – in silver at Keshar Jewellers, Sehore.",
    h1: "Bridal Hair Jewellery",
    intro: "Jhoomar, hair pins and choti accessories to complete your bridal and festive look. Made in 92.5 silver with traditional handcrafted detailing.",
  },
  nath: {
    title: "Bridal Nath Designs",
    description: "Traditional bridal nath designs in 92.5 silver and gold at Keshar Jewellers, Sehore.",
    h1: "Bridal Nath Designs",
    intro: "Classic bridal naths in 92.5 silver and gold, from delicate everyday styles to grand wedding designs. Pair it with a maang tikka for the complete bridal look.",
  },
  "bridal-jewellery-sets": {
    title: "Bridal Jewellery Sets",
    description: "Complete bridal jewellery sets – necklace, earrings and maang tikka – in hallmarked gold and 92.5 silver at Keshar Jewellers, Sehore.",
    h1: "Bridal Jewellery Sets",
    intro: "Complete wedding sets with necklace, earrings and maang tikka, in hallmarked 22K gold and 92.5 silver. Visit our Sehore showroom to plan your full bridal jewellery with our team.",
  },
  "evil-eye": {
    title: "Evil Eye Silver Jewellery",
    description: "Evil eye (nazar) bracelets, pendants and anklets in 92.5 sterling silver at Keshar Jewellers, Sehore.",
    h1: "Evil Eye Silver Jewellery",
    intro: "Nazar bracelets, pendants, rings and anklets in 92.5 sterling silver with the protective evil eye charm. A meaningful gift for family and friends.",
  },
  kids: {
    title: "Silver Jewellery for Kids & Babies",
    description: "Skin-safe 92.5 silver jewellery for kids and babies – baby kada, payal and nazariya – at Keshar Jewellers, Sehore.",
    h1: "Silver Jewellery for Kids & Babies",
    intro: "Baby kada, small payal, nazariya and gift pieces in skin-safe 92.5 sterling silver. A traditional and safe gift for naming ceremonies and birthdays.",
  },
  pens: {
    title: "Silver Pens – Luxury Gifts",
    description: "92.5 sterling silver pens – a lasting luxury gift for teachers, professionals and special occasions – from Keshar Jewellers, Sehore.",
    h1: "Silver Pens",
    intro: "Elegant pens crafted in 92.5 sterling silver – a memorable gift for students, teachers and professionals that lasts for years.",
  },
  utensils: {
    title: "Silver Utensils – Glass, Bowl, Plate & Spoon",
    description: "92.5 sterling silver utensils – glass, bowl, plate and spoon sets – for gifting and baby annaprashan at Keshar Jewellers, Sehore.",
    h1: "Silver Utensils",
    intro: "Silver glasses, bowls, plates and spoon sets in 92.5 sterling silver – a traditional gift for annaprashan, weddings and festivals. Sold by weight with a hallmark.",
  },
  artifacts: {
    title: "Silver Idols & Articles",
    description: "Silver idols of Ganesh, Laxmi and other deities plus decorative silver articles at Keshar Jewellers, Sehore.",
    h1: "Silver Idols & Articles",
    intro: "Silver idols of Ganesh, Laxmi and other deities, plus decorative silver articles for your home temple and for gifting on Diwali and housewarmings.",
  },
  "coins-bars": {
    title: "Gold & Silver Coins and Bars",
    description: "Hallmarked gold and silver coins and bars for Dhanteras, Diwali and gifting at Keshar Jewellers, Sehore.",
    h1: "Gold & Silver Coins and Bars",
    intro: "Hallmarked gold and silver coins and bars – an auspicious buy for Dhanteras, Akshaya Tritiya and Diwali, and a trusted way to save. Sold at the day's rate.",
  },
  "pooja-articles": {
    title: "Silver Pooja Articles",
    description: "Silver pooja thali, diya, kalash and other pooja articles at Keshar Jewellers, Sarafa Market, Sehore.",
    h1: "Silver Pooja Articles",
    intro: "Silver pooja thalis, diyas, kalash, bells and other sacred articles for daily worship, festivals and gifting. Crafted in 92.5 sterling silver.",
  },
  "festival-collection": {
    title: "Festival Jewellery Collection",
    description: "Festive silver and gold jewellery and gifts for Diwali, Dhanteras, Karwa Chauth and weddings at Keshar Jewellers, Sehore.",
    h1: "Festival Jewellery Collection",
    intro: "Handpicked silver and gold pieces for Diwali, Dhanteras, Karwa Chauth, Raksha Bandhan and the wedding season – perfect for gifting and celebrating.",
  },
  "customized-jewellery": {
    title: "Customised Jewellery – Made to Order",
    description: "Get customised silver and gold jewellery made to order at Keshar Jewellers, Sehore – names, initials, bridal pieces and your own designs.",
    h1: "Customised Jewellery – Made to Order",
    intro: "Share your idea, photo or design on WhatsApp and our craftsmen in Sehore will make it for you in 92.5 silver or hallmarked gold – name pendants, initials, bridal pieces and more.",
  },
};
