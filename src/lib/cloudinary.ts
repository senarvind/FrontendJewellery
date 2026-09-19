/**
 * Cloudinary Responsive Image URL Generator
 * Automatically injects transformations:
 * - w_{width}, h_{height}
 * - c_fill / c_limit (smart crop / resize)
 * - q_auto (intelligent quality compression with zero perceptual quality loss)
 * - f_auto (delivers modern AVIF / WebP depending on user browser)
 * - dpr_auto (detects high-resolution Retina / mobile displays)
 */

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "scale" | "thumb";
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
}

export function cloudinaryUrl(
  src: string | undefined | null,
  options: CloudinaryTransformOptions = {}
): string {
  if (!src || typeof src !== "string") {
    return "/images/categories/ring.png";
  }

  // If not a Cloudinary URL, return as-is
  if (!src.includes("cloudinary.com") || !src.includes("/upload/")) {
    return src;
  }

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  const transforms: string[] = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop && (width || height)) transforms.push(`c_${crop}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);
  transforms.push("dpr_auto");

  const transformString = transforms.join(",");

  // Cloudinary standard upload pattern: .../upload/v12345/folder/image.jpg
  // Replace /upload/ with /upload/{transformString}/
  return src.replace("/upload/", `/upload/${transformString}/`);
}

/**
 * Common presets for jewelry storefront
 */
export const IMAGE_PRESETS = {
  // Category circular icons (small ~96px to 128px)
  categoryIcon: (url: string) => cloudinaryUrl(url, { width: 160, height: 160, crop: "fill" }),

  // Product cards in listings & carousels (~350px)
  productCard: (url: string) => cloudinaryUrl(url, { width: 450, height: 450, crop: "fill" }),

  // Product detail view (~800px)
  productDetail: (url: string) => cloudinaryUrl(url, { width: 900, height: 900, crop: "limit" }),

  // High-res zoom preview (~1600px)
  productZoom: (url: string) => cloudinaryUrl(url, { width: 1600, height: 1600, crop: "limit" }),
};
