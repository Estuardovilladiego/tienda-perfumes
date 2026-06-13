import { Heart, Shield, Sparkles, Truck } from "lucide-react";

import { benefits } from "@/lib/home-data";

const iconMap = {
  sparkles: Sparkles,
  truck: Truck,
  shield: Shield,
  heart: Heart,
} as const;

export default function Benefits() {
  return (
    <section className="border-y border-border bg-white py-16 sm:py-20">
      <div className="section-container">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="section-title">Por qué Essenza</h2>
          <p className="section-subtitle mt-2">
            Calidad, confianza y estilo en cada compra
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {benefits.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={item.title}
                className="group text-center transition duration-300 hover:-translate-y-1"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-cream transition group-hover:border-gold/40 group-hover:bg-[#faf6f0]">
                  <Icon
                    size={24}
                    strokeWidth={1.25}
                    className="text-gold transition group-hover:scale-110"
                  />
                </div>
                <h3 className="mt-5 text-sm font-medium uppercase tracking-[0.12em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
