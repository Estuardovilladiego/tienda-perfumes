export default function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:h-screen overflow-hidden">
      <img
        src="https://vitrinasmetacrilato.com/wp-content/uploads/2025/05/5c16cbd2.jpg"
        alt="Colección de perfumes Essenza"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <div className="section-container relative z-10 flex h-full min-h-[inherit] items-end pb-12 pt-28 sm:items-center sm:pb-16 sm:pt-24">
        <div className="max-w-xl text-white lg:max-w-2xl">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-gold-light sm:text-xs">
            Perfumes exclusivos · Barranquilla
          </p>

          <h2 className="text-4xl font-light leading-[1.1] uppercase sm:text-5xl md:text-6xl lg:text-7xl">
            Descubre
            <br />
            <span className="text-gold-light">tu esencia</span>
          </h2>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-200 sm:mt-6 sm:text-base">
            Fragancias 1.1 con un estilo elegante y sofisticado. Envíos
            en Barranquilla y asesoría personalizada.
          </p>

          <div className="mt-8 sm:mt-10">
            <a href="/catalogo" className="btn-primary w-full sm:w-auto">
              Ver catálogo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
