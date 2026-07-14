"use client"

import { useState } from "react"
import Link from "next/link"

export default function Missionaries() {
  const [state, setState] = useState({
    leftM: 3,
    leftC: 3,
    rightM: 0,
    rightC: 0,
    boatM: 0,
    boatC: 0,
    boatPos: "left" as "left" | "right",
  })
  const [status, setStatus] = useState("Click on people to board the boat (max 2)!")
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [moves, setMoves] = useState(0)
  const [showTheory, setShowTheory] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const MAX_BOAT_CAPACITY = 2

  const addToBoat = (type: "M" | "C", side: "left" | "right") => {
    console.log("[v0] addToBoat called:", { type, side, boatPos: state.boatPos, isAnimating, gameOver })

    if (gameOver || isAnimating) return
    if (state.boatPos !== side) {
      setStatus(`The boat is on the ${state.boatPos} bank! Click people on that side.`)
      return
    }
    if (state.boatM + state.boatC >= MAX_BOAT_CAPACITY) {
      setStatus(`Boat is full! Maximum ${MAX_BOAT_CAPACITY} passengers allowed.`)
      return
    }

    const key = `${side}${type}` as "leftM" | "leftC" | "rightM" | "rightC"
    if (state[key] <= 0) {
      setStatus(`No more ${type === "M" ? "missionaries" : "cannibals"} on this side!`)
      return
    }

    setState((prev) => ({
      ...prev,
      [key]: prev[key] - 1,
      boatM: type === "M" ? prev.boatM + 1 : prev.boatM,
      boatC: type === "C" ? prev.boatC + 1 : prev.boatC,
    }))
    setStatus("Passenger boarded! Add more (max 2) or click Sail.")
  }

  const removeFromBoat = (type: "M" | "C") => {
    if (gameOver || isAnimating) return

    const boatKey = type === "M" ? "boatM" : "boatC"
    if (state[boatKey] <= 0) return

    const sideKey = `${state.boatPos}${type}` as "leftM" | "leftC" | "rightM" | "rightC"
    setState((prev) => ({
      ...prev,
      [boatKey]: prev[boatKey] - 1,
      [sideKey]: prev[sideKey] + 1,
    }))
    setStatus("Passenger disembarked! Add passengers or sail.")
  }

  const moveBoat = () => {
    console.log("[v0] moveBoat called:", { state, isAnimating, gameOver })

    if (gameOver || isAnimating) return
    if (state.boatM + state.boatC === 0) {
      setStatus("Boat cannot sail empty! Board at least 1 person.")
      return
    }

    const passengersM = state.boatM
    const passengersC = state.boatC
    const fromSide = state.boatPos
    const toSide = fromSide === "left" ? "right" : "left"

    setIsAnimating(true)
    setStatus(`Sailing to ${toSide} bank with ${passengersM}M + ${passengersC}C...`)

    // Animate boat crossing
    setTimeout(() => {
      // Calculate new state after crossing - passengers disembark automatically
      const newLeftM = fromSide === "left" ? state.leftM : state.leftM + passengersM
      const newLeftC = fromSide === "left" ? state.leftC : state.leftC + passengersC
      const newRightM = fromSide === "right" ? state.rightM : state.rightM + passengersM
      const newRightC = fromSide === "right" ? state.rightC : state.rightC + passengersC

      // Check safety constraints
      const leftSafe = newLeftM === 0 || newLeftM >= newLeftC
      const rightSafe = newRightM === 0 || newRightM >= newRightC

      const moveNum = moves + 1
      const moveDesc = `Move ${moveNum}: ${passengersM}M + ${passengersC}C sailed ${fromSide} → ${toSide}`
      setHistory((h) => [...h, moveDesc])

      if (!leftSafe || !rightSafe) {
        setState({
          leftM: newLeftM,
          leftC: newLeftC,
          rightM: newRightM,
          rightC: newRightC,
          boatM: 0,
          boatC: 0,
          boatPos: toSide,
        })
        setStatus("GAME OVER! Missionaries were outnumbered and eaten!")
        setGameOver(true)
        setIsAnimating(false)
        return
      }

      // Update state - boat is now on the other side, passengers disembarked
      setState({
        leftM: newLeftM,
        leftC: newLeftC,
        rightM: newRightM,
        rightC: newRightC,
        boatM: 0,
        boatC: 0,
        boatPos: toSide,
      })
      setMoves(moveNum)

      // Check win condition
      if (newRightM === 3 && newRightC === 3) {
        setStatus(`Victory! Everyone crossed safely in ${moveNum} moves!`)
        setGameOver(true)
        setWon(true)
      } else {
        setStatus(`Arrived at ${toSide} bank! Now board passengers from ${toSide} side to sail back.`)
      }
      setIsAnimating(false)

      console.log("[v0] After move:", { newLeftM, newLeftC, newRightM, newRightC, boatPos: toSide })
    }, 2000)
  }

  const reset = () => {
    setState({
      leftM: 3,
      leftC: 3,
      rightM: 0,
      rightC: 0,
      boatM: 0,
      boatC: 0,
      boatPos: "left",
    })
    setStatus("Click on people to board the boat (max 2)!")
    setGameOver(false)
    setWon(false)
    setIsAnimating(false)
    setMoves(0)
    setHistory([])
  }

  const PersonGroup = ({
    type,
    count,
    onClick,
    side,
  }: {
    type: "M" | "C"
    count: number
    onClick: () => void
    side: "left" | "right"
  }) => {
    const isBoatHere = state.boatPos === side
    const canClick = isBoatHere && !gameOver && !isAnimating

    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-bold text-white drop-shadow">
          {type === "M" ? "Missionaries" : "Cannibals"} ({count})
        </span>
        <div className="flex gap-1 flex-wrap justify-center min-h-[40px]">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={onClick}
              disabled={!canClick}
              className={`text-3xl md:text-4xl transition-all duration-200 drop-shadow-lg
                ${
                  canClick
                    ? "hover:scale-125 hover:-translate-y-2 cursor-pointer animate-pulse"
                    : "opacity-60 cursor-not-allowed"
                }`}
              title={canClick ? `Click to board ${type === "M" ? "missionary" : "cannibal"}` : "Boat is not here"}
            >
              {type === "M" ? "👨‍🦳" : "👹"}
            </button>
          ))}
          {count === 0 && <span className="text-white/50 text-xs italic">None</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 px-4 py-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-semibold text-emerald-700 shadow-lg transition hover:shadow-xl hover:bg-white"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-white drop-shadow-lg md:text-3xl">River Crossing</h1>
          <button
            onClick={() => setShowTheory(!showTheory)}
            className="rounded-full bg-white/90 px-4 py-2 font-semibold text-emerald-700 shadow-lg transition hover:shadow-xl hover:bg-white"
          >
            {showTheory ? "Hide" : "Theory"}
          </button>
        </div>

        {showTheory && (
          <div className="mb-6 rounded-2xl bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur">
            <h3 className="mb-3 text-xl font-bold text-cyan-400">Theory: State-Space Search Problem</h3>

            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <h4 className="font-bold text-cyan-300">1. Problem Definition</h4>
                <p className="text-gray-300">
                  There are 3 missionaries and 3 cannibals on the left bank of a river. They have a boat that can carry
                  at most <strong className="text-yellow-300">2 people</strong> at a time. The goal is to move everyone
                  to the right bank without ever leaving missionaries outnumbered by cannibals on any bank.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">2. Rules & Constraints</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>
                    The boat can carry <strong className="text-yellow-300">1 or 2 people</strong>
                  </li>
                  <li>The boat cannot travel empty - someone must row!</li>
                  <li>On each bank: if missionaries are present, they must be ≥ cannibals</li>
                  <li>Boat must go back and forth to transport everyone</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">3. State Representation</h4>
                <p className="text-gray-300 mb-2">
                  State = <code className="bg-slate-700 px-2 py-0.5 rounded">(M_left, C_left, boat_position)</code>
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>
                    <strong>Initial:</strong> (3, 3, left) - all on left
                  </li>
                  <li>
                    <strong>Goal:</strong> (0, 0, right) - all on right
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">4. Valid Boat Configurations</h4>
                <div className="mt-2 bg-slate-800 p-2 rounded text-xs grid grid-cols-5 gap-2 text-center">
                  <span className="bg-blue-600 rounded px-2 py-1">1M</span>
                  <span className="bg-blue-600 rounded px-2 py-1">2M</span>
                  <span className="bg-red-600 rounded px-2 py-1">1C</span>
                  <span className="bg-red-600 rounded px-2 py-1">2C</span>
                  <span className="bg-purple-600 rounded px-2 py-1">1M+1C</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">5. Solution (11 moves)</h4>
                <p className="text-gray-300 text-xs">
                  1. 2C→ | 2. 1C← | 3. 2C→ | 4. 1C← | 5. 2M→ | 6. 1M+1C← | 7. 2M→ | 8. 1C← | 9. 2C→ | 10. 1C← | 11. 2C→
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Card */}
        <div className="mb-4 rounded-2xl bg-emerald-600/90 p-4 text-white shadow-lg backdrop-blur">
          <h3 className="mb-2 text-lg font-bold">How to Play</h3>
          <ul className="space-y-1 text-sm">
            <li>
              1. Click people on the bank where the <strong className="text-yellow-200">boat is located</strong> to
              board them
            </li>
            <li>
              2. Click <strong className="text-yellow-200">"Sail"</strong> to cross the river (1-2 passengers required)
            </li>
            <li>
              3. After arriving, board someone to <strong className="text-yellow-200">sail back</strong> for more people
            </li>
            <li>4. Repeat until everyone is on the right bank!</li>
            <li className="text-red-200">Warning: Never leave missionaries outnumbered by cannibals on any bank!</li>
          </ul>
        </div>

        {/* Status & Moves - with boat location indicator */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1 rounded-xl bg-white/95 p-3 text-center font-semibold text-gray-800 shadow-lg backdrop-blur">
            {status}
          </div>
          <div className="rounded-xl bg-amber-400 px-4 py-3 text-center font-bold text-amber-900 shadow-lg">
            Moves: {moves}
          </div>
        </div>

        <div className="mb-4 text-center">
          <span className="inline-block rounded-full bg-blue-600 px-4 py-2 text-white font-bold shadow-lg animate-bounce">
            🚣 Boat is at {state.boatPos.toUpperCase()} bank - Click people there to board!
          </span>
        </div>

        {/* River Scene */}
        <div className="relative mb-6 h-[420px] overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 via-sky-200 to-blue-500 shadow-2xl md:h-[480px]">
          {/* Sky with clouds */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-sky-400 to-sky-200">
            <div className="absolute top-4 left-[5%] text-4xl animate-[cloud_40s_linear_infinite]">☁️</div>
            <div className="absolute top-10 left-[25%] text-3xl animate-[cloud_50s_linear_infinite]">☁️</div>
            <div className="absolute top-2 left-[50%] text-5xl animate-[cloud_35s_linear_infinite]">☁️</div>
            <div className="absolute top-8 left-[75%] text-3xl animate-[cloud_45s_linear_infinite]">☁️</div>
          </div>

          {/* Sun */}
          <div className="absolute top-4 right-8 text-5xl animate-pulse">☀️</div>

          {/* Left Bank */}
          <div
            className={`absolute bottom-0 left-0 h-48 w-[30%] rounded-tr-[80px] bg-gradient-to-t from-green-800 via-green-600 to-green-500 shadow-xl ${state.boatPos === "left" ? "ring-4 ring-yellow-400 ring-opacity-75" : ""}`}
          >
            <div className="absolute -top-6 left-2 text-3xl">🌳</div>
            <div className="absolute -top-8 left-14 text-4xl">🌲</div>
            <div className="absolute -top-4 right-4 text-3xl">🌳</div>

            <div className="absolute bottom-28 left-2 right-2 flex flex-col items-center gap-4">
              <PersonGroup type="M" count={state.leftM} onClick={() => addToBoat("M", "left")} side="left" />
              <PersonGroup type="C" count={state.leftC} onClick={() => addToBoat("C", "left")} side="left" />
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-green-900/80 px-3 py-1 rounded-full">
              LEFT {state.boatPos === "left" && "🚣"}
            </div>
          </div>

          {/* Right Bank */}
          <div
            className={`absolute bottom-0 right-0 h-48 w-[30%] rounded-tl-[80px] bg-gradient-to-t from-green-800 via-green-600 to-green-500 shadow-xl ${state.boatPos === "right" ? "ring-4 ring-yellow-400 ring-opacity-75" : ""}`}
          >
            <div className="absolute -top-8 right-4 text-4xl">🌴</div>
            <div className="absolute -top-6 right-16 text-3xl">🌳</div>
            <div className="absolute -top-4 left-4 text-3xl">🌲</div>

            <div className="absolute bottom-28 left-2 right-2 flex flex-col items-center gap-4">
              <PersonGroup type="M" count={state.rightM} onClick={() => addToBoat("M", "right")} side="right" />
              <PersonGroup type="C" count={state.rightC} onClick={() => addToBoat("C", "right")} side="right" />
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-green-900/80 px-3 py-1 rounded-full">
              RIGHT {state.boatPos === "right" && "🚣"}
            </div>
          </div>

          {/* River */}
          <div className="absolute bottom-0 left-[28%] right-[28%] h-44 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-400/80 to-blue-600" />
            <div className="absolute bottom-2 left-0 right-0 flex justify-around">
              <span className="text-2xl animate-bounce opacity-50">🌊</span>
              <span className="text-2xl animate-bounce [animation-delay:200ms] opacity-50">🌊</span>
              <span className="text-2xl animate-bounce [animation-delay:400ms] opacity-50">🌊</span>
            </div>
          </div>

          {/* Boat - animated with smooth transition */}
          <div
            className={`absolute bottom-24 transition-all ${isAnimating ? "duration-[2000ms]" : "duration-300"} ease-in-out`}
            style={{
              left: state.boatPos === "left" ? "18%" : "54%",
            }}
          >
            <div
              className={`relative ${isAnimating ? "animate-[boat-rock_0.4s_ease-in-out_infinite]" : "animate-[boat-idle_2s_ease-in-out_infinite]"}`}
            >
              {/* Boat */}
              <div className="text-6xl md:text-7xl drop-shadow-lg">🚣</div>

              {/* Passengers on boat */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-amber-200/90 rounded-xl px-2 py-1 min-w-[70px] justify-center shadow-lg">
                {state.boatM === 0 && state.boatC === 0 && (
                  <span className="text-xs text-amber-700 font-semibold">Empty</span>
                )}
                {Array.from({ length: state.boatM }).map((_, i) => (
                  <button
                    key={`m-${i}`}
                    onClick={() => removeFromBoat("M")}
                    disabled={isAnimating || gameOver}
                    className="text-2xl hover:scale-125 transition-transform disabled:opacity-50"
                    title="Click to disembark"
                  >
                    👨‍🦳
                  </button>
                ))}
                {Array.from({ length: state.boatC }).map((_, i) => (
                  <button
                    key={`c-${i}`}
                    onClick={() => removeFromBoat("C")}
                    disabled={isAnimating || gameOver}
                    className="text-2xl hover:scale-125 transition-transform disabled:opacity-50"
                    title="Click to disembark"
                  >
                    👹
                  </button>
                ))}
              </div>

              {/* Capacity indicator */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs bg-blue-800 text-white px-2 py-0.5 rounded-full font-bold">
                {state.boatM + state.boatC}/{MAX_BOAT_CAPACITY}
              </div>
            </div>
          </div>

          {/* Game Over / Victory Overlay */}
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
              <div
                className={`rounded-2xl p-8 text-center shadow-2xl ${won ? "bg-gradient-to-br from-green-400 to-emerald-500" : "bg-gradient-to-br from-red-500 to-red-700"}`}
              >
                <div className="text-6xl mb-4">{won ? "🎉" : "💀"}</div>
                <h2 className="text-3xl font-bold text-white mb-2">{won ? "Victory!" : "Game Over!"}</h2>
                <p className="text-white/90 mb-4 text-lg">
                  {won ? `Everyone crossed safely in ${moves} moves!` : "The cannibals ate the missionaries!"}
                </p>
                <button
                  onClick={reset}
                  className="rounded-full bg-white px-8 py-3 font-bold text-gray-800 hover:bg-gray-100 transition shadow-lg"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={moveBoat}
            disabled={gameOver || isAnimating || state.boatM + state.boatC === 0}
            className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
          >
            {isAnimating ? (
              <>
                <span className="animate-spin">⛵</span> Sailing...
              </>
            ) : (
              <>{state.boatPos === "left" ? "Sail to Right →" : "← Sail to Left"}</>
            )}
          </button>
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            Reset Game
          </button>
        </div>

        {/* Move History */}
        {history.length > 0 && (
          <div className="rounded-xl bg-white/30 p-4 backdrop-blur">
            <h4 className="mb-2 font-bold text-white text-lg">Move History:</h4>
            <div className="max-h-32 overflow-y-auto text-sm space-y-1">
              {history.map((h, i) => (
                <div key={i} className="bg-white/60 rounded px-3 py-1 text-gray-800">
                  {h}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes boat-idle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(1deg); }
        }
        @keyframes boat-rock {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          25% { transform: translateY(-8px) rotate(4deg); }
          50% { transform: translateY(-2px) rotate(-4deg); }
          75% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes cloud {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
      `}</style>
    </div>
  )
}
