"use client"

import { useState } from "react"
import Link from "next/link"

type Piece = string
type GameMode = "ai" | "multiplayer"

const initialBoard: Piece[][] = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
]

const whitePieces = ["♔", "♕", "♖", "♗", "♘", "♙"]
const blackPieces = ["♚", "♛", "♜", "♝", "♞", "♟"]

const pieceValues: { [key: string]: number } = {
  "♙": 1,
  "♟": 1,
  "♘": 3,
  "♞": 3,
  "♗": 3,
  "♝": 3,
  "♖": 5,
  "♜": 5,
  "♕": 9,
  "♛": 9,
  "♔": 100,
  "♚": 100,
}

export default function Chess() {
  const [board, setBoard] = useState<Piece[][]>(initialBoard.map((row) => [...row]))
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [validMoves, setValidMoves] = useState<[number, number][]>([])
  const [turn, setTurn] = useState<"white" | "black">("white")
  const [status, setStatus] = useState("White's turn! Click a white piece to select it.")
  const [gameOver, setGameOver] = useState(false)
  const [showTheory, setShowTheory] = useState(false)
  const [gameMode, setGameMode] = useState<GameMode>("ai")
  const [winner, setWinner] = useState<"white" | "black" | null>(null)

  const isWhite = (piece: string) => whitePieces.includes(piece)
  const isBlack = (piece: string) => blackPieces.includes(piece)

  const isValidMove = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    currentBoard: Piece[][] = board,
  ): boolean => {
    const piece = currentBoard[fromRow][fromCol]
    const target = currentBoard[toRow][toCol]

    if (!piece) return false
    if (target && isWhite(piece) === isWhite(target)) return false

    const rowDiff = toRow - fromRow
    const colDiff = Math.abs(toCol - fromCol)

    // Pawn
    if (piece === "♙") {
      if (fromCol === toCol && !target) {
        if (rowDiff === -1) return true
        if (fromRow === 6 && rowDiff === -2 && !currentBoard[5][fromCol]) return true
      }
      if (colDiff === 1 && rowDiff === -1 && target && isBlack(target)) return true
      return false
    }
    if (piece === "♟") {
      if (fromCol === toCol && !target) {
        if (rowDiff === 1) return true
        if (fromRow === 1 && rowDiff === 2 && !currentBoard[2][fromCol]) return true
      }
      if (colDiff === 1 && rowDiff === 1 && target && isWhite(target)) return true
      return false
    }

    // Rook
    if (piece === "♖" || piece === "♜") {
      if (fromRow !== toRow && fromCol !== toCol) return false
      return isPathClear(fromRow, fromCol, toRow, toCol, currentBoard)
    }

    // Bishop
    if (piece === "♗" || piece === "♝") {
      if (Math.abs(rowDiff) !== colDiff) return false
      return isPathClear(fromRow, fromCol, toRow, toCol, currentBoard)
    }

    // Queen
    if (piece === "♕" || piece === "♛") {
      if (fromRow !== toRow && fromCol !== toCol && Math.abs(rowDiff) !== colDiff) return false
      return isPathClear(fromRow, fromCol, toRow, toCol, currentBoard)
    }

    // Knight
    if (piece === "♘" || piece === "♞") {
      return (Math.abs(rowDiff) === 2 && colDiff === 1) || (Math.abs(rowDiff) === 1 && colDiff === 2)
    }

    // King
    if (piece === "♔" || piece === "♚") {
      return Math.abs(rowDiff) <= 1 && colDiff <= 1
    }

    return false
  }

  const isPathClear = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    currentBoard: Piece[][] = board,
  ): boolean => {
    const rowStep = fromRow === toRow ? 0 : toRow > fromRow ? 1 : -1
    const colStep = fromCol === toCol ? 0 : toCol > fromCol ? 1 : -1
    let r = fromRow + rowStep
    let c = fromCol + colStep
    while (r !== toRow || c !== toCol) {
      if (currentBoard[r][c]) return false
      r += rowStep
      c += colStep
    }
    return true
  }

  const getValidMovesForPiece = (row: number, col: number): [number, number][] => {
    const moves: [number, number][] = []
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(row, col, r, c)) {
          moves.push([r, c])
        }
      }
    }
    return moves
  }

  const makeAIMove = (currentBoard: Piece[][]) => {
    const moves: { from: [number, number]; to: [number, number]; score: number }[] = []

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isBlack(currentBoard[r][c])) {
          for (let tr = 0; tr < 8; tr++) {
            for (let tc = 0; tc < 8; tc++) {
              if (isValidMove(r, c, tr, tc, currentBoard)) {
                const target = currentBoard[tr][tc]
                const score = target ? pieceValues[target] * 10 : Math.random()
                moves.push({ from: [r, c], to: [tr, tc], score })
              }
            }
          }
        }
      }
    }

    if (moves.length > 0) {
      moves.sort((a, b) => b.score - a.score)
      const move = moves[0]

      const newBoard = currentBoard.map((row) => [...row])
      newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]]
      newBoard[move.from[0]][move.from[1]] = ""

      let whiteKingExists = false
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (newBoard[r][c] === "♔") whiteKingExists = true
        }
      }

      setBoard(newBoard)

      if (!whiteKingExists) {
        setStatus("AI wins! The King has been captured!")
        setWinner("black")
        setGameOver(true)
      } else {
        setTurn("white")
        setStatus("Your turn! Click a white piece to select it.")
      }
    }
  }

  const handleClick = (row: number, col: number) => {
    if (gameOver) return

    const currentTurnPieces = turn === "white" ? isWhite : isBlack
    const piece = board[row][col]

    if (selected) {
      const [sRow, sCol] = selected

      if (sRow === row && sCol === col) {
        setSelected(null)
        setValidMoves([])
        setStatus("Selection cleared.")
        return
      }

      if (isValidMove(sRow, sCol, row, col)) {
        const newBoard = board.map((r) => [...r])
        newBoard[row][col] = newBoard[sRow][sCol]
        newBoard[sRow][sCol] = ""
        setBoard(newBoard)
        setSelected(null)
        setValidMoves([])

        // Check if king is captured
        let blackKingExists = false
        let whiteKingExists = false
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (newBoard[r][c] === "♚") blackKingExists = true
            if (newBoard[r][c] === "♔") whiteKingExists = true
          }
        }

        if (!blackKingExists) {
          setStatus("White wins! Black King captured!")
          setWinner("white")
          setGameOver(true)
          return
        }

        if (!whiteKingExists) {
          setStatus("Black wins! White King captured!")
          setWinner("black")
          setGameOver(true)
          return
        }

        if (gameMode === "multiplayer") {
          const nextTurn = turn === "white" ? "black" : "white"
          setTurn(nextTurn)
          setStatus(`${nextTurn.charAt(0).toUpperCase() + nextTurn.slice(1)}'s turn!`)
        } else {
          // AI mode
          setTurn("black")
          setStatus("AI is thinking...")
          setTimeout(() => makeAIMove(newBoard), 600)
        }
      } else {
        if (currentTurnPieces(piece)) {
          setSelected([row, col])
          setValidMoves(getValidMovesForPiece(row, col))
          setStatus("Piece selected. Click a highlighted square to move.")
        } else {
          setStatus("Invalid move! Try again.")
        }
      }
    } else {
      if (currentTurnPieces(piece)) {
        setSelected([row, col])
        setValidMoves(getValidMovesForPiece(row, col))
        setStatus("Piece selected. Click a highlighted square to move.")
      } else {
        setStatus(`Select a ${turn} piece first!`)
      }
    }
  }

  const resetGame = () => {
    setBoard(initialBoard.map((row) => [...row]))
    setSelected(null)
    setValidMoves([])
    setTurn("white")
    setStatus(gameMode === "ai" ? "Your turn! Click a white piece to select it." : "White's turn!")
    setGameOver(false)
    setWinner(null)
  }

  const switchMode = (mode: GameMode) => {
    setGameMode(mode)
    setBoard(initialBoard.map((row) => [...row]))
    setSelected(null)
    setValidMoves([])
    setTurn("white")
    setGameOver(false)
    setWinner(null)
    setStatus(mode === "ai" ? "Your turn! Click a white piece to select it." : "White's turn!")
  }

  const isValidMoveSquare = (row: number, col: number) => {
    return validMoves.some(([r, c]) => r === row && c === col)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-600 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-semibold text-amber-700 shadow-lg transition hover:shadow-xl"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg md:text-3xl">Chess</h1>
          <button
            onClick={() => setShowTheory(!showTheory)}
            className="rounded-full bg-white/90 px-4 py-2 font-semibold text-amber-700 shadow-lg transition hover:shadow-xl"
          >
            {showTheory ? "Hide" : "Theory"}
          </button>
        </div>

        {showTheory && (
          <div className="mb-6 rounded-2xl bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur">
            <h3 className="mb-3 text-xl font-bold text-cyan-400">Theory: Rule-Based Chess AI</h3>

            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <h4 className="font-bold text-cyan-300">1. Problem Definition</h4>
                <p className="text-gray-300">
                  Chess is a two-player, perfect-information, turn-based game on an 8x8 board. Each side starts with 16
                  pieces. The objective is to checkmate the opponent's king.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">2. Piece Movement Rules</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>
                    <strong>Pawns:</strong> Move forward, capture diagonally
                  </li>
                  <li>
                    <strong>Rooks:</strong> Move horizontally or vertically
                  </li>
                  <li>
                    <strong>Bishops:</strong> Move diagonally
                  </li>
                  <li>
                    <strong>Knights:</strong> L-shape, can jump
                  </li>
                  <li>
                    <strong>Queen:</strong> Combines rook and bishop
                  </li>
                  <li>
                    <strong>King:</strong> One square any direction
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">3. Piece Values</h4>
                <div className="flex gap-4 flex-wrap text-gray-300">
                  <span>Pawn: 1</span>
                  <span>Knight: 3</span>
                  <span>Bishop: 3</span>
                  <span>Rook: 5</span>
                  <span>Queen: 9</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-cyan-300">4. AI Strategy</h4>
                <p className="text-gray-300">
                  The AI prioritizes captures based on piece values. It evaluates all legal moves and chooses the one
                  with highest material gain.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4 flex justify-center gap-2">
          <button
            onClick={() => switchMode("ai")}
            className={`rounded-full px-6 py-2 font-bold transition shadow-lg ${
              gameMode === "ai" ? "bg-amber-800 text-white" : "bg-white/80 text-amber-700 hover:bg-white"
            }`}
          >
            vs AI
          </button>
          <button
            onClick={() => switchMode("multiplayer")}
            className={`rounded-full px-6 py-2 font-bold transition shadow-lg ${
              gameMode === "multiplayer" ? "bg-amber-800 text-white" : "bg-white/80 text-amber-700 hover:bg-white"
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
                <li>• You play White (bottom), AI plays Black</li>
                <li>• Click a piece to select - valid moves highlighted in green</li>
                <li>• Capture the opponent's King to win!</li>
              </>
            ) : (
              <>
                <li>• White moves first, then players alternate</li>
                <li>• Click your piece to select, then click destination</li>
                <li>• Capture the opponent's King to win!</li>
              </>
            )}
          </ul>
        </div>

        {/* Turn Indicator */}
        <div className="mb-4 flex justify-center">
          <div
            className={`rounded-xl px-6 py-2 font-bold shadow-lg ${
              turn === "white" ? "bg-white text-gray-800" : "bg-gray-800 text-white"
            }`}
          >
            {turn === "white" ? "⚪ White's Turn" : "⚫ Black's Turn"}
          </div>
        </div>

        {/* Status */}
        <div
          className={`mb-4 rounded-xl p-4 text-center text-lg font-semibold shadow-lg ${
            winner === "white"
              ? "bg-white text-gray-800"
              : winner === "black"
                ? "bg-gray-800 text-white"
                : "bg-white/95 text-gray-800"
          }`}
        >
          {status}
        </div>

        {/* Board */}
        <div className="mx-auto mb-6 w-fit rounded-2xl bg-amber-900 p-2 shadow-2xl">
          <div className="grid grid-cols-8 gap-0">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0
                const isSelected = selected && selected[0] === rowIndex && selected[1] === colIndex
                const isValidTarget = isValidMoveSquare(rowIndex, colIndex)
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleClick(rowIndex, colIndex)}
                    className={`flex h-10 w-10 items-center justify-center text-3xl transition-all sm:h-12 sm:w-12 sm:text-4xl ${
                      isLight ? "bg-amber-100" : "bg-amber-600"
                    } ${isSelected ? "ring-4 ring-yellow-400 ring-inset" : ""} ${
                      isValidTarget ? "bg-green-400 hover:bg-green-300" : ""
                    } hover:brightness-110`}
                  >
                    {piece}
                  </button>
                )
              }),
            )}
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="rounded-full bg-white px-8 py-3 font-bold text-amber-700 shadow-lg transition hover:scale-105 hover:shadow-xl"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  )
}
