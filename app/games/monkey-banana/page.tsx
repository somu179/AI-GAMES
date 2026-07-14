"use client"

import { useState } from "react"
import Link from "next/link"

type Position = "outside" | "door" | "window" | "center"

export default function MonkeyBanana() {
  const [state, setState] = useState({
    monkeyPos: "outside" as Position,
    monkeyInside: false,
    boxPos: "window" as "window" | "center",
    onBox: false,
    hasBanana: false,
  })
  const [status, setStatus] = useState("Help the monkey get the banana!")
  const [moves, setMoves] = useState(0)
  const [showTheory, setShowTheory] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const addHistory = (action: string, success: boolean) => {
    if (success) {
      setHistory((h) => [...h, `${moves + 1}. ${action}`])
      setMoves((m) => m + 1)
    }
  }

  const doAction = (action: string) => {
    if (state.hasBanana) return

    switch (action) {
      case "enter":
        if (!state.monkeyInside) {
          setState((s) => ({ ...s, monkeyInside: true, monkeyPos: "door" }))
          setStatus("Monkey entered the room through the door!")
          addHistory("Enter room → at door", true)
        } else {
          setStatus("Monkey is already inside!")
        }
        break

      case "goto-window":
        if (!state.monkeyInside) {
          setStatus("Enter the room first!")
        } else if (state.onBox) {
          setStatus("Climb down from the box first!")
        } else {
          setState((s) => ({ ...s, monkeyPos: "window" }))
          setStatus("Monkey walked to the window area!")
          addHistory("Walk to window → at window", true)
        }
        break

      case "goto-center":
        if (!state.monkeyInside) {
          setStatus("Enter the room first!")
        } else if (state.onBox) {
          setStatus("Climb down from the box first!")
        } else {
          setState((s) => ({ ...s, monkeyPos: "center" }))
          setStatus("Monkey walked to the center!")
          addHistory("Walk to center → at center", true)
        }
        break

      case "push-box":
        if (!state.monkeyInside) {
          setStatus("Enter the room first!")
        } else if (state.monkeyPos !== "window") {
          setStatus("Go to the window where the box is!")
        } else if (state.onBox) {
          setStatus("Cannot push while standing on the box!")
        } else if (state.boxPos === "center") {
          setStatus("Box is already under the banana!")
        } else {
          setState((s) => ({ ...s, boxPos: "center", monkeyPos: "center" }))
          setStatus("Pushed the box under the banana!")
          addHistory("Push box to center → box at center", true)
        }
        break

      case "climb":
        if (!state.monkeyInside) {
          setStatus("Enter the room first!")
        } else if (state.monkeyPos !== "center" || state.boxPos !== "center") {
          setStatus("The box must be at center and you must be there too!")
        } else if (state.onBox) {
          setStatus("Already standing on the box!")
        } else {
          setState((s) => ({ ...s, onBox: true }))
          setStatus("Monkey climbed onto the box!")
          addHistory("Climb box → on box", true)
        }
        break

      case "grab":
        if (!state.onBox || state.boxPos !== "center") {
          setStatus("Must be standing on the box under the banana!")
        } else {
          setState((s) => ({ ...s, hasBanana: true }))
          setStatus(`SUCCESS! Monkey got the banana in ${moves + 1} moves!`)
          addHistory("Grab banana → HAS BANANA!", true)
        }
        break

      case "climb-down":
        if (!state.onBox) {
          setStatus("Not on the box!")
        } else {
          setState((s) => ({ ...s, onBox: false }))
          setStatus("Monkey climbed down from the box.")
          addHistory("Climb down → on floor", true)
        }
        break
    }
  }

  const reset = () => {
    setState({
      monkeyPos: "outside",
      monkeyInside: false,
      boxPos: "window",
      onBox: false,
      hasBanana: false,
    })
    setStatus("Help the monkey get the banana!")
    setMoves(0)
    setHistory([])
  }

  const getMonkeyX = () => {
    if (!state.monkeyInside) return "5%"
    if (state.monkeyPos === "door") return "20%"
    if (state.monkeyPos === "window") return "75%"
    return "50%"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-semibold text-orange-600 shadow-lg transition hover:shadow-xl"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-white drop-shadow-lg md:text-2xl">Monkey & Banana</h1>
          <button
            onClick={() => setShowTheory(!showTheory)}
            className="rounded-full bg-white/90 px-4 py-2 font-semibold text-orange-600 shadow-lg transition hover:shadow-xl"
          >
            {showTheory ? "Hide" : "Theory"}
          </button>
        </div>

        {showTheory && (
          <div className="mb-6 rounded-2xl bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur">
            <h3 className="mb-3 text-xl font-bold text-cyan-400">Theory: Planning & Goal-Based Agents</h3>

            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <h4 className="font-bold text-cyan-300">1. Problem Definition</h4>
                <p className="text-gray-300">
                  A monkey is in a room. A banana is hanging from the ceiling, out of reach. There is a movable box in
                  the room. The monkey must plan a sequence of actions to reach and grab the banana.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">2. Available Actions</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>
                    <strong>Enter:</strong> Enter the room (prerequisite for everything)
                  </li>
                  <li>
                    <strong>Walk:</strong> Move to a location (door, window, center)
                  </li>
                  <li>
                    <strong>Push:</strong> Push the box from one location to another
                  </li>
                  <li>
                    <strong>Climb:</strong> Climb onto the box
                  </li>
                  <li>
                    <strong>Grab:</strong> Grab the banana (only if on box under banana)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">3. State Representation</h4>
                <p className="text-gray-300 mb-2">
                  State ={" "}
                  <code className="bg-slate-700 px-2 py-0.5 rounded">(monkeyLoc, boxLoc, onBox, hasBanana)</code>
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>
                    <strong>Initial:</strong> (outside, window, false, false)
                  </li>
                  <li>
                    <strong>Goal:</strong> hasBanana = true
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">4. Planning Concept</h4>
                <p className="text-gray-300">
                  This problem illustrates goal-based agents and planning in AI. Instead of reacting greedily, the agent
                  must think in sequences. Actions have preconditions that must be satisfied before execution.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">5. Optimal Plan</h4>
                <ol className="list-decimal list-inside text-gray-300 space-y-1">
                  <li>Enter the room → at door</li>
                  <li>Walk to window → at window (where box is)</li>
                  <li>Push box to center → box under banana</li>
                  <li>Climb the box → on box</li>
                  <li>Grab banana → SUCCESS!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-4 rounded-2xl bg-white/20 p-4 text-white shadow-lg backdrop-blur">
          <h3 className="mb-2 text-lg font-bold">How to Play</h3>
          <ul className="space-y-1 text-sm">
            <li>• The monkey starts outside, the banana hangs from the ceiling</li>
            <li>• A box is near the window - push it under the banana</li>
            <li>• Follow the correct sequence: Enter → Go to box → Push → Climb → Grab</li>
            <li>• Invalid actions will be blocked - plan your moves!</li>
          </ul>
        </div>

        {/* Stats */}
        <div className="mb-4 flex justify-center gap-4">
          <div className="rounded-xl bg-white/90 px-5 py-2 text-center shadow-lg">
            <div className="text-2xl font-bold text-orange-600">{moves}</div>
            <div className="text-xs font-semibold text-orange-800">Moves</div>
          </div>
        </div>

        {/* Status */}
        <div
          className={`mb-4 rounded-xl p-4 text-center text-lg font-semibold shadow-lg ${
            state.hasBanana ? "bg-green-400 text-green-900" : "bg-white/95 text-gray-800"
          }`}
        >
          {status}
        </div>

        {/* Scene */}
        <div className="relative mb-4 h-64 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-200 to-amber-100 shadow-2xl md:h-72">
          {/* Room outline */}
          <div className="absolute inset-x-[15%] top-8 bottom-12 border-4 border-amber-800 bg-amber-50/50 rounded-lg">
            {/* Ceiling with banana */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 text-4xl">{!state.hasBanana && "🍌"}</div>

            {/* Door */}
            <div className="absolute left-4 bottom-0 text-4xl">🚪</div>

            {/* Window */}
            <div className="absolute right-4 top-4 text-3xl">🪟</div>

            {/* Box */}
            <div
              className="absolute bottom-2 text-5xl transition-all duration-700"
              style={{ left: state.boxPos === "window" ? "70%" : "45%", transform: "translateX(-50%)" }}
            >
              📦
            </div>

            {/* Monkey inside room */}
            {state.monkeyInside && (
              <div
                className="absolute text-5xl transition-all duration-500"
                style={{
                  left: state.monkeyPos === "door" ? "15%" : state.monkeyPos === "window" ? "70%" : "45%",
                  bottom: state.onBox ? "70px" : "10px",
                  transform: "translateX(-50%)",
                }}
              >
                🐵{state.hasBanana && "🍌"}
              </div>
            )}
          </div>

          {/* Monkey outside */}
          {!state.monkeyInside && <div className="absolute left-[5%] bottom-12 text-5xl animate-bounce">🐵</div>}

          {/* Labels */}
          <div className="absolute bottom-2 left-[20%] text-xs font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
            Door
          </div>
          <div className="absolute bottom-2 right-[18%] text-xs font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
            Window
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
            Center
          </div>
        </div>

        {/* Current State Display */}
        <div className="mb-4 rounded-xl bg-gray-100 p-3 text-center text-sm text-gray-700">
          <strong>State:</strong> Monkey: {state.monkeyInside ? state.monkeyPos : "outside"}
          {state.onBox && " (on box)"} | Box: {state.boxPos} | {state.hasBanana ? "HAS BANANA!" : "No banana"}
        </div>

        {/* Action Buttons */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => doAction("enter")}
            disabled={state.hasBanana || state.monkeyInside}
            className="rounded-xl bg-green-500 px-4 py-2 font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
          >
            Enter Room
          </button>
          <button
            onClick={() => doAction("goto-window")}
            disabled={state.hasBanana || !state.monkeyInside || state.onBox}
            className="rounded-xl bg-blue-500 px-4 py-2 font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
          >
            Go to Window
          </button>
          <button
            onClick={() => doAction("goto-center")}
            disabled={state.hasBanana || !state.monkeyInside || state.onBox}
            className="rounded-xl bg-blue-500 px-4 py-2 font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
          >
            Go to Center
          </button>
          <button
            onClick={() => doAction("push-box")}
            disabled={state.hasBanana || state.monkeyPos !== "window" || state.boxPos === "center"}
            className="rounded-xl bg-amber-500 px-4 py-2 font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
          >
            Push Box
          </button>
          <button
            onClick={() => doAction("climb")}
            disabled={state.hasBanana || state.onBox || state.monkeyPos !== "center" || state.boxPos !== "center"}
            className="rounded-xl bg-purple-500 px-4 py-2 font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
          >
            Climb Box
          </button>
          <button
            onClick={() => doAction("climb-down")}
            disabled={state.hasBanana || !state.onBox}
            className="rounded-xl bg-gray-500 px-4 py-2 font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
          >
            Climb Down
          </button>
          <button
            onClick={() => doAction("grab")}
            disabled={state.hasBanana || !state.onBox || state.boxPos !== "center"}
            className="rounded-xl bg-yellow-500 px-4 py-2 font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
          >
            Grab Banana!
          </button>
        </div>

        {history.length > 0 && (
          <div className="mb-4 rounded-xl bg-white/20 p-3 backdrop-blur">
            <h4 className="mb-2 font-bold text-white">Action History:</h4>
            <div className="max-h-20 overflow-y-auto text-sm text-white/90">
              {history.map((h, i) => (
                <div key={i}>{h}</div>
              ))}
            </div>
          </div>
        )}

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={reset}
            className="rounded-full bg-white px-8 py-3 font-bold text-orange-600 shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  )
}
