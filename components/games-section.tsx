import { GameCard } from "@/components/game-card"
import { Grid3X3, Users, Puzzle, Droplets, Banana, Crown } from "lucide-react"

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description:
      "Play against an AI using the magic square lookup strategy. Learn how table-driven approaches create perfect play.",
    icon: Grid3X3,
    algorithm: "Move Table / Magic Square",
    difficulty: "Beginner" as const,
    href: "/game-tic-tac-toe.html",
  },
  {
    id: "missionaries",
    title: "Missionaries & Cannibals",
    description:
      "Safely ferry everyone across the river without letting cannibals outnumber missionaries on either bank.",
    icon: Users,
    algorithm: "State Space Search",
    difficulty: "Intermediate" as const,
    href: "/game-missionaries-cannibals.html",
  },
  {
    id: "puzzle",
    title: "8 Puzzle",
    description: "Slide tiles to reach the goal pattern. Explore heuristic search with Manhattan distance.",
    icon: Puzzle,
    algorithm: "A* / Heuristic Search",
    difficulty: "Intermediate" as const,
    href: "/game-puzzle.html",
  },
  {
    id: "water-jug",
    title: "Water Jug Problem",
    description: "Measure exact amounts using fill, empty, and pour operations. A classic BFS/DFS puzzle.",
    icon: Droplets,
    algorithm: "BFS / DFS",
    difficulty: "Beginner" as const,
    href: "/game-water-jug.html",
  },
  {
    id: "monkey",
    title: "Monkey & Banana",
    description: "Help the monkey plan a sequence of actions to reach the banana. Goal-based agent fundamentals.",
    icon: Banana,
    algorithm: "Planning / Goal-Based",
    difficulty: "Beginner" as const,
    href: "/game-monkey-banana.html",
  },
  {
    id: "chess",
    title: "Chess AI",
    description: "Play against a beginner-friendly chess AI. Learn about evaluation functions and tactical decisions.",
    icon: Crown,
    algorithm: "Rule-Based / Evaluation",
    difficulty: "Advanced" as const,
    href: "/game-chess.html",
  },
]

export function GamesSection() {
  return (
    <section id="games" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Interactive Games</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Each game demonstrates core AI concepts. Click to play and learn the underlying algorithms.
          </p>
        </div>

        {/* Games Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      </div>
    </section>
  )
}
