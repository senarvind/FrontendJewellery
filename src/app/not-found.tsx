import Link from "next/link";

// Next.js sends HTTP 404 and adds <meta name="robots" content="noindex"> automatically.
export default function NotFound() {
  return (
    <section className="min-h-[60vh] bg-[#FFF8F0] flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="font-serif text-3xl sm:text-4xl text-[#9B1B30]">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-[#6F4A4A]">
        This design may be sold out or the link has changed. Explore our latest 92.5 silver and hallmarked gold jewellery.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link href="/products" className="px-5 py-2.5 bg-[#9B1B30] hover:bg-[#7C1B2A] text-[#FFF8F0] rounded-xl text-sm font-bold">
          Browse all jewellery
        </Link>
        <Link href="/" className="px-5 py-2.5 bg-[#FFF0EA] border border-[#E8CFC5] text-[#7C1B2A] rounded-xl text-sm font-bold">
          Go to home page
        </Link>
      </div>
    </section>
  );
}
