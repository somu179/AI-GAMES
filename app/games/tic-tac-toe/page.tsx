"use client"

import { useState } from "react"
import Link from "next/link"

type Player = "X" | "O" | null
type GameMode = "ai" | "multiplayer"

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [scores, setScores] = useState({ xWins: 0, oWins: 0, ties: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [status, setStatus] = useState("Player X's turn!")
  const [showTheory, setShowTheory] = useState(false)
  const [gameMode, setGameMode] = useState<GameMode>("ai")
  const [winner, setWinner] = useState<Player>(null)

  const checkWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const getAIMove = (squares: Player[]): number => {
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const test = [...squares]
        test[i] = "O"
        if (checkWinner(test) === "O") return i
      }
    }
    // Block player
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const test = [...squares]
        test[i] = "X"
        if (checkWinner(test) === "X") return i
      }
    }
    // Strategic moves (center, corners, edges)
    const priorities = [4, 0, 2, 6, 8, 1, 3, 5, 7]
    for (const i of priorities) {
      if (!squares[i]) return i
    }
    return -1
  }

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      if (gameMode === "ai") {
        if (gameWinner === "X") {
          setStatus("You win! Great strategy!")
          setScores((s) => ({ ...s, xWins: s.xWins + 1 }))
        } else {
          setStatus("AI wins! Try again!")
          setScores((s) => ({ ...s, oWins: s.oWins + 1 }))
        }
      } else {
        setStatus(`Player ${gameWinner} wins!`)
        if (gameWinner === "X") {
          setScores((s) => ({ ...s, xWins: s.xWins + 1 }))
        } else {
          setScores((s) => ({ ...s, oWins: s.oWins + 1 }))
        }
      }
      setGameOver(true)
      return
    }

    if (newBoard.every((cell) => cell)) {
      setStatus("It's a tie! Well played!")
      setScores((s) => ({ ...s, ties: s.ties + 1 }))
      setGameOver(true)
      return
    }

    if (gameMode === "multiplayer") {
      const nextPlayer = currentPlayer === "X" ? "O" : "X"
      setCurrentPlayer(nextPlayer)
      setStatus(`Player ${nextPlayer}'s turn!`)
    } else {
      // AI mode
      setStatus("AI is thinking...")
      setTimeout(() => {
        const aiMove = getAIMove(newBoard)
        if (aiMove !== -1) {
          newBoard[aiMove] = "O"
          setBoard([...newBoard])

          const aiWinner = checkWinner(newBoard)
          if (aiWinner === "O") {
            setWinner("O")
            setStatus("AI wins! Try again!")
            setScores((s) => ({ ...s, oWins: s.oWins + 1 }))
            setGameOver(true)
            return
          }

          if (newBoard.every((cell) => cell)) {
            setStatus("It's a tie! Well played!")
            setScores((s) => ({ ...s, ties: s.ties + 1 }))
            setGameOver(true)
            return
          }
        }
        setStatus("Your turn! Click a cell to place X")
      }, 500)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setGameOver(false)
    setWinner(null)
    setStatus(gameMode === "ai" ? "Your turn! Click a cell to place X" : "Player X's turn!")
  }

  const switchMode = (mode: GameMode) => {
    setGameMode(mode)
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setGameOver(false)
    setWinner(null)
    setScores({ xWins: 0, oWins: 0, ties: 0 })
    setStatus(mode === "ai" ? "Your turn! Click a cell to place X" : "Player X's turn!")
  }

  const magicSquare = [8, 1, 6, 3, 5, 7, 4, 9, 2]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-semibold text-purple-600 shadow-lg transition hover:shadow-xl"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg md:text-3xl">Tic Tac Toe</h1>
          <button
            onClick={() => setShowTheory(!showTheory)}
            className="rounded-full bg-white/90 px-4 py-2 font-semibold text-purple-600 shadow-lg transition hover:shadow-xl"
          >
            {showTheory ? "Hide" : "Theory"}
          </button>
        </div>

        {showTheory && (
          <div className="mb-6 rounded-2xl bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur">
            <h3 className="mb-3 text-xl font-bold text-cyan-400">Theory: Game AI with Magic Square</h3>

            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <h4 className="font-bold text-cyan-300">1. Problem Definition</h4>
                <p className="text-gray-300">
                  Tic Tac Toe is a 2-player game on a 3x3 grid. Players take turns marking empty cells with X or O. The
                  first player to get three marks in a row (horizontally, vertically, or diagonally) wins. If the grid
                  fills with no winner, it is a draw.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">2. Rules</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>The board has 9 cells arranged in a 3x3 grid</li>
                  <li>Player X always moves first</li>
                  <li>Player O moves after X</li>
                  <li>A move is valid only if the chosen cell is empty</li>
                  <li>Win condition: three marks in a straight line</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">3. Magic Square Trick</h4>
                <p className="text-gray-300 mb-2">
                  We label the grid using a 3x3 magic square where every row, column, and diagonal sums to 15:
                </p>
                <div className="font-mono bg-slate-700 p-3 rounded-lg inline-block text-center">
                  <div>8 | 1 | 6</div>
                  <div>3 | 5 | 7</div>
                  <div>4 | 9 | 2</div>
                </div>
                <p className="text-gray-300 mt-2">
                  A player wins if they occupy any three cells whose magic numbers sum to 15!
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">4. AI Strategy (Minimax)</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>
                    <strong>Priority 1:</strong> Take winning move if available
                  </li>
                  <li>
                    <strong>Priority 2:</strong> Block opponent's winning move
                  </li>
                  <li>
                    <strong>Priority 3:</strong> Take center (value 5)
                  </li>
                  <li>
                    <strong>Priority 4:</strong> Take corners (values 8, 6, 4, 2)
                  </li>
                  <li>
                    <strong>Priority 5:</strong> Take edges (values 1, 3, 7, 9)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 flex justify-center gap-2">
          <button
            onClick={() => switchMode("ai")}
            className={`rounded-full px-6 py-2 font-bold transition shadow-lg ${
              gameMode === "ai" ? "bg-purple-600 text-white" : "bg-white/80 text-purple-600 hover:bg-white"
            }`}
          >
            vs AI
          </button>
          <button
            onClick={() => switchMode("multiplayer")}
            className={`rounded-full px-6 py-2 font-bold transition shadow-lg ${
              gameMode === "multiplayer" ? "bg-purple-600 text-white" : "bg-white/80 text-purple-600 hover:bg-white"
            }`}
          >
            2 Players
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-4 rounded-2xl bg-white/20 p-4 text-white shadow-lg backdrop-blur">
          <h3 className="mb-2 text-lg font-bold">How to Play</h3>
          <ul className="space-y-1 text-sm">
            {gameMode === "ai" ? (
              <>
                <li>• You are X (pink), AI is O (purple)</li>
                <li>• Click any empty cell to place your mark</li>
                <li>• Get three in a row to win!</li>
                <li>• The AI uses optimal strategy - can you beat it?</li>
              </>
            ) : (
              <>
                <li>• Player 1 is X (pink), Player 2 is O (purple)</li>
                <li>• Take turns clicking empty cells</li>
                <li>• Get three in a row to win!</li>
                <li>• Challenge your friend!</li>
              </>
            )}
          </ul>
        </div>

        {/* Scores */}
        <div className="mb-4 flex justify-center gap-4">
          <div className="rounded-xl bg-pink-400/90 px-5 py-2 text-center shadow-lg">
            <div className="text-2xl font-bold text-pink-900">{scores.xWins}</div>
            <div className="text-xs font-semibold text-pink-800">{gameMode === "ai" ? "You (X)" : "X Wins"}</div>
          </div>
          <div className="rounded-xl bg-yellow-400/90 px-5 py-2 text-center shadow-lg">
            <div className="text-2xl font-bold text-yellow-900">{scores.ties}</div>
            <div className="text-xs font-semibold text-yellow-800">Ties</div>
          </div>
          <div className="rounded-xl bg-purple-400/90 px-5 py-2 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-900">{scores.oWins}</div>
            <div className="text-xs font-semibold text-purple-800">{gameMode === "ai" ? "AI (O)" : "O Wins"}</div>
          </div>
        </div>

        {/* Status */}
        <div
          className={`mb-4 rounded-xl p-4 text-center text-lg font-semibold shadow-lg ${
            winner === "X"
              ? "bg-pink-400 text-pink-900"
              : winner === "O"
                ? "bg-purple-400 text-purple-900"
                : "bg-white/95 text-gray-800"
          }`}
        >
          {status}
        </div>

        {/* Board */}
        <div className="mx-auto mb-6 w-fit rounded-2xl bg-white/30 p-4 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                disabled={!!cell || gameOver}
                className={`relative flex h-24 w-24 items-center justify-center rounded-xl text-5xl font-bold shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed md:h-28 md:w-28 ${
                  cell === "X"
                    ? "bg-pink-500 text-white"
                    : cell === "O"
                      ? "bg-purple-600 text-white"
                      : "bg-white/90 hover:bg-white text-gray-300"
                }`}
              >
                {cell || ""}
                {!cell && <span className="absolute bottom-1 right-2 text-xs text-gray-400">{magicSquare[index]}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="rounded-full bg-white px-8 py-3 font-bold text-purple-600 shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  )
}
