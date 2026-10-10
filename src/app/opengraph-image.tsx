import { ImageResponse } from "next/og";

// Default share image (WhatsApp, Facebook, Google Discover) for every page
// that does not set its own og:image (product pages use the product photo).
export const alt = "Keshar Jewellers, Sarafa Market, Sehore – 92.5 Silver & Hallmark Gold Jewellery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4A0E17 0%, #7C1B2A 55%, #B82E44 100%)",
          color: "#FFF8F0",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 8, color: "#E6C766" }}>SINCE 2003 • SEHORE</div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 16 }}>Keshar Jewellers</div>
        <div style={{ fontSize: 40, marginTop: 20 }}>92.5 Sterling Silver &amp; BIS Hallmark Gold</div>
        <div style={{ fontSize: 28, marginTop: 28, color: "#F3C2AE" }}>
          Charkha Line, Sarafa Market, Sehore (MP) • +91 98274 15111
        </div>
      </div>
    ),
    size
  );
}
