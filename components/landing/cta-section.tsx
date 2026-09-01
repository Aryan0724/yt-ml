import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="w-full py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
          Stop guessing what to make.
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Start with the signals. Build with evidence. Join the platform built for creator decisions.
        </p>
        <Button size="lg" asChild className="rounded-full px-10 h-14 text-lg">
          <Link href="/signup">
            Get started free →
          </Link>
        </Button>
      </div>
    </section>
  )
}
