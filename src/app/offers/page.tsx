import { getActiveOffers, Offer } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export const metadata = {
  title: 'Special Offers | Keshar Jewellers',
  description: 'Exclusive jewellery offers and discounts from Keshar Jewellers, Sehore.',
};

function OfferCard({ offer }: { offer: Offer }) {
  const validTo = new Date(offer.validTo);
  const now = new Date();
  const msLeft = validTo.getTime() - now.getTime();
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#F0DDD8] hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="relative w-full aspect-square bg-[#FFF8F0] overflow-hidden">
        {offer.image ? (
          <Image
            src={offer.image}
            alt={offer.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-[#E8CFC5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 10V5a2 2 0 012-2z" />
            </svg>
          </div>
        )}
        {/* Discount Badge */}
        <span className="absolute top-3 left-3 bg-[#9B1B30] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          {offer.discountPercent.toFixed(1)}% OFF
        </span>
        {/* Category Badge */}
        {offer.category && (
          <span className="absolute top-3 right-3 bg-white/90 text-[#6F4A4A] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#E8CFC5]">
            {offer.category}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-serif text-base sm:text-lg text-[#35191C] font-semibold leading-snug line-clamp-2">
          {offer.title}
        </h3>
        {offer.description && (
          <p className="text-xs text-[#6F4A4A] line-clamp-2">{offer.description}</p>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-bold text-[#9B1B30]">
            ₹{offer.offerPrice.toFixed(2)}
          </span>
          <span className="text-sm text-[#6F4A4A] line-through">
            ₹{offer.originalPrice.toFixed(2)}
          </span>
        </div>

        {/* Validity */}
        <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-[#F0DDD8]">
          <svg className="w-3.5 h-3.5 text-[#A77C18] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {daysLeft > 0 ? (
            <span className="text-[10px] font-semibold text-[#A77C18]">
              {daysLeft === 1 ? 'Expires today!' : `Expires in ${daysLeft} days`}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-red-500">Expired</span>
          )}
          <span className="text-[10px] text-[#6F4A4A] ml-auto">
            Till {validTo.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* CTA */}
        {offer.productLink ? (
          <Link
            href={offer.productLink}
            className="mt-2 w-full text-center bg-[#9B1B30] hover:bg-[#7C1424] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
          >
            Shop Now
          </Link>
        ) : (
          <Link
            href="/products"
            className="mt-2 w-full text-center bg-[#9B1B30] hover:bg-[#7C1424] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
          >
            View Collection
          </Link>
        )}
      </div>
    </div>
  );
}

export default async function OffersPage() {
  let offers: Offer[] = [];
  try {
    offers = await getActiveOffers();
  } catch {
    offers = [];
  }

  return (
    <main className="min-h-screen bg-[#FFF8F0] pb-24 md:pb-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#9B1B30] to-[#6B0F20] text-white py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 10V5a2 2 0 012-2z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E6C766]">Exclusive Deals</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Special Offers
        </h1>
        <p className="text-sm text-white/80 max-w-md mx-auto">
          Keshar Jewellers ki taraf se khaas offers — limited time ke liye!
        </p>
      </div>

      {/* Offers Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {offers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#F0DDD8] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-[#9B1B30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 10V5a2 2 0 012-2z" />
              </svg>
            </div>
            <h2 className="font-serif text-xl text-[#35191C] font-semibold mb-2">
              Abhi koi offers nahi hain
            </h2>
            <p className="text-sm text-[#6F4A4A] mb-6">
              Jald hi khaas offers laayenge — tab tak hamare collection dekhein!
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#9B1B30] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#7C1424] transition-colors"
            >
              Jewellery Dekhein
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#6F4A4A] mb-6">
              {offers.length} {offers.length === 1 ? 'offer' : 'offers'} available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {offers.map((offer) => (
                <OfferCard key={offer._id} offer={offer} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
