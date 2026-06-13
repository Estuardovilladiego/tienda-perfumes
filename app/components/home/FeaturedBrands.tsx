import { featuredBrands } from "@/lib/home-data";

export default function FeaturedBrands() {
  return (
    <section className="bg-cream/50 py-16 sm:py-20">
      <div className="section-container">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
            Casas olfativas
          </p>
          <h2 className="section-title mt-3">Marcas destacadas</h2>
        </div>

        <div className="mt-12 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {featuredBrands.map((brand) => (
            <div
              key={brand}
              className="flex min-h-[72px] items-center justify-center rounded-sm border border-border bg-white px-4 py-5 text-center shadow-sm transition duration-300 hover:border-gold/30 hover:shadow-md sm:px-6"
            >
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/80 sm:text-sm">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
