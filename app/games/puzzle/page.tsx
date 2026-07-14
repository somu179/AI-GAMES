"use client"

import { useState } from "react"
import Link from "next/link"

type GameMode = "solo" | "versus"

export default function Puzzle() {
  const [board, setBoard] = useState([1, 2, 3, 4, 5, 6, 7, 8, 0])
  const [moves, setMoves] = useState(0)
  const [status, setStatus] = useState("Click tiles adjacent to the empty space to slide them!")
  const [showTheory, setShowTheory] = useState(false)
  const [gameMode, setGameMode] = useState<GameMode>("solo")
  const [player1Moves, setPlayer1Moves] = useState(0)
  const [player2Moves, setPlayer2Moves] = useState(0)
  const [player1Board, setPlayer1Board] = useState([1, 2, 3, 4, 5, 6, 7, 8, 0])
  const [player2Board, setPlayer2Board] = useState([1, 2, 3, 4, 5, 6, 7, 8, 0])
  const [player1Done, setPlayer1Done] = useState(false)
  const [player2Done, setPlayer2Done] = useState(false)
  const [raceStarted, setRaceStarted] = useState(false)
  const [winner, setWinner] = useState<1 | 2 | null>(null)

  const getEmptyIndex = (b: number[]) => b.indexOf(0)

  const getAdjacent = (emptyIndex: number) => {
    const adj = []
    const row = Math.floor(emptyIndex / 3)
    const col = emptyIndex % 3
    if (row > 0) adj.push(emptyIndex - 3)
    if (row < 2) adj.push(emptyIndex + 3)
    if (col > 0) adj.push(emptyIndex - 1)
    if (col < 2) adj.push(emptyIndex + 1)
    return adj
  }

  const getManhattanDistance = (b: number[]) => {
    let distance = 0
    for (let i = 0; i < 9; i++) {
      if (b[i] !== 0) {
        const goalPos = b[i] - 1
        const currentRow = Math.floor(i / 3)
        const currentCol = i % 3
        const goalRow = Math.floor(goalPos / 3)
        const goalCol = goalPos % 3
        distance += Math.abs(currentRow - goalRow) + Math.abs(currentCol - goalCol)
      }
    }
    return distance
  }

  const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0]

  const handleClick = (index: number) => {
    if (gameMode === "solo") {
      const emptyIndex = getEmptyIndex(board)
      const adjacent = getAdjacent(emptyIndex)

      if (adjacent.includes(index)) {
        const newBoard = [...board]
        newBoard[emptyIndex] = newBoard[index]
        newBoard[index] = 0
        setBoard(newBoard)
        setMoves((m) => m + 1)

        if (JSON.stringify(newBoard) === JSON.stringify(goal)) {
          setStatus(`Puzzle solved in ${moves + 1} moves! Excellent!`)
        } else {
          const dist = getManhattanDistance(newBoard)
          setStatus(`Manhattan distance to goal: ${dist}`)
        }
      }
    }
  }

  const handleVersusClick = (player: 1 | 2, index: number) => {
    if (!raceStarted || winner) return

    const currentBoard = player === 1 ? player1Board : player2Board
    const setCurrentBoard = player === 1 ? setPlayer1Board : setPlayer2Board
    const setCurrentMoves = player === 1 ? setPlayer1Moves : setPlayer2Moves
    const setCurrentDone = player === 1 ? setPlayer1Done : setPlayer2Done
    const isDone = player === 1 ? player1Done : player2Done

    if (isDone) return

    const emptyIndex = getEmptyIndex(currentBoard)
    const adjacent = getAdjacent(emptyIndex)

    if (adjacent.includes(index)) {
      const newBoard = [...currentBoard]
      newBoard[emptyIndex] = newBoard[index]
      newBoard[index] = 0
      setCurrentBoard(newBoard)
      setCurrentMoves((m) => m + 1)

      if (JSON.stringify(newBoard) === JSON.stringify(goal)) {
        setCurrentDone(true)
        if (!winner) {
          setWinner(player)
          setStatus(`Player ${player} wins!`)
        }
      }
    }
  }

  const shuffleBoard = (b: number[]) => {
    const newBoard = [...b]
    for (let i = 0; i < 100; i++) {
      const emptyIndex = getEmptyIndex(newBoard)
      const adjacent = getAdjacent(emptyIndex)
      const randomIndex = adjacent[Math.floor(Math.random() * adjacent.length)]
      newBoard[emptyIndex] = newBoard[randomIndex]
      newBoard[randomIndex] = 0
    }
    return newBoard
  }

  const shuffle = () => {
    if (gameMode === "solo") {
      const newBoard = shuffleBoard(board)
      setBoard(newBoard)
      setMoves(0)
      setStatus(`Puzzle shuffled! Manhattan distance: ${getManhattanDistance(newBoard)}`)
    } else {
      const shuffled = shuffleBoard([1, 2, 3, 4, 5, 6, 7, 8, 0])
      setPlayer1Board([...shuffled])
      setPlayer2Board([...shuffled])
      setPlayer1Moves(0)
      setPlayer2Moves(0)
      setPlayer1Done(false)
      setPlayer2Done(false)
      setWinner(null)
      setRaceStarted(true)
      setStatus("Race started! Solve the puzzle first to win!")
    }
  }

  const reset = () => {
    setBoard([1, 2, 3, 4, 5, 6, 7, 8, 0])
    setMoves(0)
    setPlayer1Board([1, 2, 3, 4, 5, 6, 7, 8, 0])
    setPlayer2Board([1, 2, 3, 4, 5, 6, 7, 8, 0])
    setPlayer1Moves(0)
    setPlayer2Moves(0)
    setPlayer1Done(false)
    setPlayer2Done(false)
    setRaceStarted(false)
    setWinner(null)
    setStatus("Click tiles adjacent to the empty space to slide them!")
  }

  const switchMode = (mode: GameMode) => {
    setGameMode(mode)
    reset()
  }

  const emptyIndex = getEmptyIndex(board)
  const adjacent = getAdjacent(emptyIndex)
  const isGoal = JSON.stringify(board) === JSON.stringify(goal)

  const renderBoard = (boardState: number[], onClick: (index: number) => void, playerDone?: boolean) => {
    const empty = getEmptyIndex(boardState)
    const adj = getAdjacent(empty)
    const solved = JSON.stringify(boardState) === JSON.stringify(goal)

    return (
      <div
        className={`rounded-2xl bg-white/30 p-3 shadow-xl backdrop-blur ${playerDone ? "ring-4 ring-green-400" : ""}`}
      >
        <div className="grid grid-cols-3 gap-2">
          {boardState.map((tile, index) => (
            <button
              key={index}
              onClick={() => onClick(index)}
              disabled={tile === 0 || solved}
              className={`flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold shadow-lg transition-all md:h-20 md:w-20 md:text-3xl ${
                tile === 0
                  ? "bg-purple-900/50"
                  : adj.includes(index) && !solved
                    ? "bg-yellow-400 text-yellow-900 hover:scale-105 hover:bg-yellow-300 cursor-pointer"
                    : "bg-white text-purple-700"
              }`}
            >
              {tile !== 0 && tile}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-semibold text-purple-600 shadow-lg transition hover:shadow-xl"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg md:text-3xl">8 Puzzle</h1>
          <button
            onClick={() => setShowTheory(!showTheory)}
            className="rounded-full bg-white/90 px-4 py-2 font-semibold text-purple-600 shadow-lg transition hover:shadow-xl"
          >
            {showTheory ? "Hide" : "Theory"}
          </button>
        </div>

        {showTheory && (
          <div className="mb-6 rounded-2xl bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur">
            <h3 className="mb-3 text-xl font-bold text-cyan-400">Theory: Heuristic Search</h3>

            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <h4 className="font-bold text-cyan-300">1. Problem Definition</h4>
                <p className="text-gray-300">
                  The 8 Puzzle consists of a 3x3 grid with 8 numbered tiles and one empty space. Slide tiles adjacent to
                  the empty space to reach the goal arrangement: 1-2-3 / 4-5-6 / 7-8-empty.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">2. State Space</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Total possible states: 9! = 362,880</li>
                  <li>Only half (181,440) are reachable</li>
                  <li>Each state has 2-4 neighbors</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">3. Manhattan Distance</h4>
                <p className="text-gray-300">
                  Sum of distances each tile must travel to reach its goal position. This heuristic guides A* search to
                  find optimal solutions!
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">4. Goal State</h4>
                <div className="font-mono bg-slate-700 p-3 rounded-lg inline-block">
                  <div>1 | 2 | 3</div>
                  <div>4 | 5 | 6</div>
                  <div>7 | 8 | [ ]</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 flex justify-center gap-2">
          <button
            onClick={() => switchMode("solo")}
            className={`rounded-full px-6 py-2 font-bold transition shadow-lg ${
              gameMode === "solo" ? "bg-purple-800 text-white" : "bg-white/80 text-purple-600 hover:bg-white"
            }`}
          >
            Solo
          </button>
          <button
            onClick={() => switchMode("versus")}
            className={`rounded-full px-6 py-2 font-bold transition shadow-lg ${
              gameMode === "versus" ? "bg-purple-800 text-white" : "bg-white/80 text-purple-600 hover:bg-white"
            }`}
          >
            Versus
          </button>
        </div>

        <div className="mb-4">
          {gameMode === "solo" ? (
            renderBoard(board, handleClick)
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white">Player 1</h2>
                {renderBoard(player1Board, (index) => handleVersusClick(1, index), player1Done)}
              </div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white">Player 2</h2>
                {renderBoard(player2Board, (index) => handleVersusClick(2, index), player2Done)}
              </div>
            </>
          )}
        </div>

        <div className="mb-4 flex justify-center gap-2">
          <button
            onClick={shuffle}
            className="rounded-full px-6 py-2 font-bold transition shadow-lg bg-white/80 text-purple-600 hover:bg-white"
          >
            Shuffle
          </button>
          <button
            onClick={reset}
            className="rounded-full px-6 py-2 font-bold transition shadow-lg bg-white/80 text-purple-600 hover:bg-white"
          >
            Reset
          </button>
        </div>

        <div className="text-center text-white">{status}</div>
      </div>
    </div>
  )
}
