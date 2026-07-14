"use client"

import { useState } from "react"
import Link from "next/link"

export default function WaterJug() {
  const [jug1, setJug1] = useState(0)
  const [jug2, setJug2] = useState(0)
  const [jug1Max] = useState(4)
  const [jug2Max] = useState(3)
  const [goal] = useState(2)
  const [moves, setMoves] = useState(0)
  const [status, setStatus] = useState("Use the buttons to fill, empty, or pour water!")
  const [won, setWon] = useState(false)
  const [showTheory, setShowTheory] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const addHistory = (action: string) => {
    setHistory((h) => [...h, `${moves + 1}. ${action}`])
  }

  const checkWin = (j1: number, j2: number, action: string) => {
    addHistory(action)
    setMoves((m) => m + 1)
    if (j1 === goal || j2 === goal) {
      setStatus(`Goal achieved in ${moves + 1} steps! You got exactly ${goal}L!`)
      setWon(true)
    } else {
      setStatus(`State: (${j1}L, ${j2}L) - Keep going!`)
    }
  }

  const fill1 = () => {
    if (won) return
    setJug1(jug1Max)
    checkWin(jug1Max, jug2, `Fill Jug1 → (${jug1Max}, ${jug2})`)
  }

  const fill2 = () => {
    if (won) return
    setJug2(jug2Max)
    checkWin(jug1, jug2Max, `Fill Jug2 → (${jug1}, ${jug2Max})`)
  }

  const empty1 = () => {
    if (won) return
    setJug1(0)
    checkWin(0, jug2, `Empty Jug1 → (0, ${jug2})`)
  }

  const empty2 = () => {
    if (won) return
    setJug2(0)
    checkWin(jug1, 0, `Empty Jug2 → (${jug1}, 0)`)
  }

  const pour1to2 = () => {
    if (won) return
    const space = jug2Max - jug2
    const amount = Math.min(jug1, space)
    const newJug1 = jug1 - amount
    const newJug2 = jug2 + amount
    setJug1(newJug1)
    setJug2(newJug2)
    checkWin(newJug1, newJug2, `Pour 1→2 → (${newJug1}, ${newJug2})`)
  }

  const pour2to1 = () => {
    if (won) return
    const space = jug1Max - jug1
    const amount = Math.min(jug2, space)
    const newJug1 = jug1 + amount
    const newJug2 = jug2 - amount
    setJug1(newJug1)
    setJug2(newJug2)
    checkWin(newJug1, newJug2, `Pour 2→1 → (${newJug1}, ${newJug2})`)
  }

  const reset = () => {
    setJug1(0)
    setJug2(0)
    setMoves(0)
    setWon(false)
    setHistory([])
    setStatus("Use the buttons to fill, empty, or pour water!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-semibold text-blue-600 shadow-lg transition hover:shadow-xl"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg md:text-3xl">Water Jug</h1>
          <button
            onClick={() => setShowTheory(!showTheory)}
            className="rounded-full bg-white/90 px-4 py-2 font-semibold text-blue-600 shadow-lg transition hover:shadow-xl"
          >
            {showTheory ? "Hide" : "Theory"}
          </button>
        </div>

        {showTheory && (
          <div className="mb-6 rounded-2xl bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur">
            <h3 className="mb-3 text-xl font-bold text-cyan-400">Theory: State-Space Search</h3>

            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <h4 className="font-bold text-cyan-300">1. Problem Definition</h4>
                <p className="text-gray-300">
                  You are given two jugs with fixed capacities ({jug1Max}L and {jug2Max}L) and a water source. The jugs
                  have no measurement markings. The task is to measure out exactly
                  {goal}L of water using only these jugs and three basic operations.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">2. Allowed Actions</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>
                    <strong>Fill:</strong> Fill a jug completely from the water source
                  </li>
                  <li>
                    <strong>Empty:</strong> Empty a jug completely onto the ground
                  </li>
                  <li>
                    <strong>Pour:</strong> Pour from one jug to another until source is empty or destination is full
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">3. State Representation</h4>
                <p className="text-gray-300 mb-2">
                  State = <code className="bg-slate-700 px-2 py-0.5 rounded">(x, y)</code> where x = water in Jug1, y =
                  water in Jug2
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>
                    <strong>Initial state:</strong> (0, 0) - both jugs empty
                  </li>
                  <li>
                    <strong>Goal state:</strong> ({goal}, _) or (_, {goal}) - either jug has exactly {goal}L
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">4. Search Strategy</h4>
                <p className="text-gray-300">
                  Each state (x, y) is a node in a graph. Operations create edges to neighboring states. BFS
                  (Breadth-First Search) finds the shortest solution. For {jug1Max}L & {jug2Max}L jugs with goal {goal}
                  L, the optimal solution takes 4 steps!
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">5. Optimal Solution</h4>
                <ol className="list-decimal list-inside text-gray-300 space-y-1">
                  <li>Fill 3L jug → (0, 3)</li>
                  <li>Pour 3L → 4L → (3, 0)</li>
                  <li>Fill 3L jug → (3, 3)</li>
                  <li>Pour 3L → 4L until full → (4, 2) - Done!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-4 rounded-2xl bg-white/20 p-4 text-white shadow-lg backdrop-blur">
          <h3 className="mb-2 text-lg font-bold">How to Play</h3>
          <ul className="space-y-1 text-sm">
            <li>
              • You have a {jug1Max}L jug and a {jug2Max}L jug (both empty)
            </li>
            <li>• Goal: Get exactly {goal}L in either jug</li>
            <li>• Use Fill, Empty, and Pour operations strategically</li>
            <li>• Try to reach the goal in minimum steps (optimal: 4 steps)</li>
          </ul>
        </div>

        {/* Stats */}
        <div className="mb-4 flex justify-center gap-4">
          <div className="rounded-xl bg-amber-400/90 px-5 py-2 text-center shadow-lg">
            <div className="text-2xl font-bold text-amber-900">Target: {goal}L</div>
          </div>
          <div className="rounded-xl bg-white/90 px-5 py-2 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
            <div className="text-xs font-semibold text-blue-800">Steps</div>
          </div>
        </div>

        {/* Status */}
        <div
          className={`mb-4 rounded-xl p-4 text-center text-lg font-semibold shadow-lg ${
            won ? "bg-green-400 text-green-900" : "bg-white/95 text-gray-800"
          }`}
        >
          {status}
        </div>

        {/* Jugs Visualization */}
        <div className="mb-6 flex justify-center gap-8 md:gap-16">
          {/* Jug 1 */}
          <div className="text-center">
            <div className="mb-2 text-lg font-bold text-white">Jug 1 ({jug1Max}L)</div>
            <div className="relative mx-auto h-48 w-24 overflow-hidden rounded-b-3xl border-4 border-blue-900 bg-blue-100 shadow-xl">
              {/* Water level markers */}
              {[...Array(jug1Max)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-blue-300/50"
                  style={{ bottom: `${((i + 1) / jug1Max) * 100}%` }}
                >
                  <span className="absolute -left-6 -top-2 text-xs text-blue-200">{i + 1}</span>
                </div>
              ))}
              {/* Water */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-500"
                style={{ height: `${(jug1 / jug1Max) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-blue-900 drop-shadow">
                {jug1}L
              </div>
            </div>
          </div>

          {/* Jug 2 */}
          <div className="text-center">
            <div className="mb-2 text-lg font-bold text-white">Jug 2 ({jug2Max}L)</div>
            <div className="relative mx-auto h-36 w-20 overflow-hidden rounded-b-3xl border-4 border-blue-900 bg-blue-100 shadow-xl">
              {/* Water level markers */}
              {[...Array(jug2Max)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-blue-300/50"
                  style={{ bottom: `${((i + 1) / jug2Max) * 100}%` }}
                >
                  <span className="absolute -left-6 -top-2 text-xs text-blue-200">{i + 1}</span>
                </div>
              ))}
              {/* Water */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-cyan-400 transition-all duration-500"
                style={{ height: `${(jug2 / jug2Max) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-900 drop-shadow">
                {jug2}L
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button
            onClick={fill1}
            disabled={won}
            className="rounded-xl bg-blue-500 px-4 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-blue-400 disabled:opacity-50"
          >
            Fill Jug 1
          </button>
          <button
            onClick={fill2}
            disabled={won}
            className="rounded-xl bg-blue-500 px-4 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-blue-400 disabled:opacity-50"
          >
            Fill Jug 2
          </button>
          <button
            onClick={empty1}
            disabled={won}
            className="rounded-xl bg-gray-500 px-4 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-gray-400 disabled:opacity-50"
          >
            Empty Jug 1
          </button>
          <button
            onClick={empty2}
            disabled={won}
            className="rounded-xl bg-gray-500 px-4 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-gray-400 disabled:opacity-50"
          >
            Empty Jug 2
          </button>
          <button
            onClick={pour1to2}
            disabled={won}
            className="rounded-xl bg-cyan-500 px-4 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-cyan-400 disabled:opacity-50"
          >
            Pour 1 → 2
          </button>
          <button
            onClick={pour2to1}
            disabled={won}
            className="rounded-xl bg-cyan-500 px-4 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:bg-cyan-400 disabled:opacity-50"
          >
            Pour 2 → 1
          </button>
        </div>

        {history.length > 0 && (
          <div className="mb-4 rounded-xl bg-white/20 p-3 backdrop-blur">
            <h4 className="mb-2 font-bold text-white">Move History:</h4>
            <div className="max-h-24 overflow-y-auto text-sm text-white/90">
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
            className="rounded-full bg-white px-8 py-3 font-bold text-blue-600 shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  )
}
