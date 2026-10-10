"use client";

// Shown inside the root layout (header and footer stay visible) when a page fails,
// e.g. while the product backend is waking up. Replaces the old site-wide error box.
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="min-h-[60vh] bg-[#FFF8F0] flex flex-col items-center justify-center text-center px-4 py-16">
      <h1 className="font-serif text-2xl sm:text-3xl text-[#7C1B2A]">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-[#6F4A4A]">
        Our catalogue is taking longer than usual to load. Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-5 px-5 py-2.5 bg-[#B82E44] hover:bg-[#7C1B2A] text-white rounded-xl text-sm font-bold"
      >
        Try again
      </button>
    </section>
  );
}
