import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.28_0.015_260)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.28_0.015_260)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Interactive Learning Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Master AI Algorithms
            <span className="mt-2 block text-accent">Through Play</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Explore fundamental artificial intelligence concepts through interactive games and puzzles. Learn minimax,
            BFS, DFS, and more with hands-on experiences.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto" asChild>
              <a href="#games">
                Explore Games
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-border bg-transparent text-foreground hover:bg-muted sm:w-auto"
              asChild
            >
              <a href="#theory">View Theory</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-10">
            <div>
              <p className="text-3xl font-bold text-accent">6+</p>
              <p className="mt-1 text-sm text-muted-foreground">Interactive Games</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">10+</p>
              <p className="mt-1 text-sm text-muted-foreground">AI Algorithms</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">100%</p>
              <p className="mt-1 text-sm text-muted-foreground">Free Access</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
