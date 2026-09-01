export function TrustedBrands() {
  return (
    <section className="w-full py-16 bg-white border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-10">
          Trusted by creators and teams
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale">
          {/* Text-based fallbacks for logos to avoid external image dependencies */}
          <div className="text-xl font-black tracking-tighter">MRBEAST</div>
          <div className="text-xl font-bold tracking-tight lowercase">vid<span className="text-blue-500">IQ</span></div>
          <div className="text-xl font-semibold tracking-tight">Ali Abdaal</div>
          <div className="text-xl font-bold tracking-tight">Think Media</div>
          <div className="text-xl font-black tracking-tighter uppercase">NasDaily.</div>
          <div className="text-xl font-bold tracking-widest uppercase">Blackbox</div>
          <div className="text-xl font-bold tracking-tight uppercase text-zinc-800">YouTube Secrets</div>
        </div>
      </div>
    </section>
  )
}
