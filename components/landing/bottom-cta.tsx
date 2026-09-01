import Link from "next/link"
import { ArrowRight, Calendar, StopCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BottomCTA() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF9F0] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#EBE8D8]">
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Start making better<br />decisions today.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <div>
                  <div className="text-xs font-bold text-zinc-900">Free plan available</div>
                  <div className="text-[10px] text-zinc-500">No credit card required</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <StopCircle className="w-5 h-5 text-zinc-400" />
                <div>
                  <div className="text-xs font-bold text-zinc-900">Cancel anytime</div>
                  <div className="text-[10px] text-zinc-500">No commitments</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-zinc-400" />
                <div>
                  <div className="text-xs font-bold text-zinc-900">Built for creators</div>
                  <div className="text-[10px] text-zinc-500">By creators</div>
                </div>
              </div>
            </div>
          </div>

          <Button size="lg" asChild className="rounded-full px-8 h-14 text-sm shadow-sm bg-foreground text-background hover:bg-foreground/90 shrink-0">
            <Link href="/dashboard">
              Get started free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
        </div>
      </div>
    </section>
  )
}
