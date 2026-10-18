export function TrustedBrands() {
  const brands = [
    "MrBeast Style Teams", "Ali Abdaal Studio", "Think Media", "Nas Daily Lab", "MKBHD Channel",
    "Linus Media Group", "Veritasium Science", "Kurzgesagt Production", "Colin and Samir", "Mark Rober Labs",
    "MrBeast Style Teams", "Ali Abdaal Studio", "Think Media", "Nas Daily Lab", "MKBHD Channel",
  ]

  return (
    <section className="w-full py-12 bg-neutral-50 border-y border-neutral-200 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-neutral-500">
          Powering intelligence for top YouTube creators & media companies
        </p>
      </div>

      <div className="relative flex overflow-x-hidden" aria-hidden="true">
        <div className="flex items-center gap-12 whitespace-nowrap animate-[marquee_35s_linear_infinite]">
          {brands.map((brand, i) => (
            <span
              key={i}
              className="text-sm font-semibold tracking-wide text-neutral-400 hover:text-neutral-900 transition-colors cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
        {/* Soft edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-50 to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
