"use client"

import { type LucideIcon, ArrowUpRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface GameCardProps {
  title: string
  description: string
  icon: LucideIcon
  algorithm: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  href: string
}

const difficultyColors = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
}

export function GameCard({ title, description, icon: Icon, algorithm, difficulty, href }: GameCardProps) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_30px_-5px_oklch(0.72_0.15_180_/_0.2)]">
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon className="h-6 w-6" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Badge variant="outline" className={`shrink-0 ${difficultyColors[difficulty]}`}>
            {difficulty}
          </Badge>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

        {/* Algorithm Tag */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          {algorithm}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
          <a href={href} target="_blank" rel="noopener noreferrer">
            Play Game
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}
