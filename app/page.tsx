import Link from "next/link"

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    emoji: "⭕",
    description: "Challenge the AI in this classic game!",
    color: "from-pink-400 to-rose-500",
    shadowColor: "shadow-pink-300",
  },
  {
    id: "puzzle",
    title: "8 Puzzle",
    emoji: "🧩",
    description: "Slide tiles to solve the puzzle!",
    color: "from-violet-400 to-purple-500",
    shadowColor: "shadow-violet-300",
  },
  {
    id: "chess",
    title: "Chess",
    emoji: "♟️",
    description: "Play chess against the computer!",
    color: "from-amber-400 to-orange-500",
    shadowColor: "shadow-amber-300",
  },
  {
    id: "water-jug",
    title: "Water Jug",
    emoji: "💧",
    description: "Measure water with two jugs!",
    color: "from-cyan-400 to-blue-500",
    shadowColor: "shadow-cyan-300",
  },
  {
    id: "missionaries",
    title: "Missionaries & Cannibals",
    emoji: "🚣",
    description: "Get everyone across safely!",
    color: "from-emerald-400 to-green-500",
    shadowColor: "shadow-emerald-300",
  },
  {
    id: "monkey-banana",
    title: "Monkey & Banana",
    emoji: "🐵",
    description: "Help the monkey get the banana!",
    color: "from-yellow-400 to-amber-500",
    shadowColor: "shadow-yellow-300",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="text-5xl animate-bounce">🎮</span>
            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
              AI Problems
            </h1>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-8 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            Learn AI by Playing! <span className="inline-block animate-wiggle">🎯</span>
          </h2>
          <p className="text-lg text-gray-600">
            Have fun with interactive games that teach you how artificial intelligence works!
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <h3 className="mb-8 text-center text-2xl font-bold text-gray-800">
            Choose Your Game <span className="inline-block">👇</span>
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <div
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${game.color} p-6 shadow-lg ${game.shadowColor} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                >
                  <div className="absolute -right-4 -top-4 text-8xl opacity-20 transition-transform duration-300 group-hover:scale-110">
                    {game.emoji}
                  </div>
                  <div className="relative">
                    <span className="mb-4 inline-block text-6xl transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce">
                      {game.emoji}
                    </span>
                    <h4 className="mb-2 text-2xl font-bold text-white">{game.title}</h4>
                    <p className="text-white/90">{game.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                      Play Now
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-4 py-8 text-center">
        <p className="text-gray-600">
          Made with <span className="text-red-500">❤️</span> for learning AI
        </p>
      </footer>
    </div>
  )
}
