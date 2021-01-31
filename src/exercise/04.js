// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  // 🐨✅ squares is the state for this component. Add useState for squares
  //const [squares, setSquare] = React.useState(Array(9).fill(null))

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨✅ put the status in the div below */}
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    Array(9).fill(null),
  ])
  const [currentSquares, setCurrentSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )
  const [step, setStep] = useLocalStorageState('tic-tac-toe:step', 0)

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)
  const moves = setHistoryMoves(history, selectHistory, step)

  function restart() {
    setCurrentSquares(Array(9).fill(null))
    setHistory([Array(9).fill(null)])
    setStep(0)
  }

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }
    const squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue
    setCurrentSquares(squaresCopy)

    setStep(prev => prev + 1)
    if (step + 1 < history.length) {
      return setHistory(prev => {
        return [...prev.splice(0, step + 1), squaresCopy]
      })
    }
    setHistory(prev => [...prev, squaresCopy])
  }

  function selectHistory(stepNumer) {
    setStep(stepNumer)
    setCurrentSquares(history[stepNumer])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function setHistoryMoves(movesHistory, selectHistory, step) {
  return (
    <>
      {movesHistory?.map((value, index) => {
        if (index === 0) {
          return (
            <li key={index}>
              <button
                disabled={step === index}
                onClick={() => selectHistory(index)}
              >
                Go to game start {step === index && 'current'}
              </button>
            </li>
          )
        }
        return (
          <li key={index}>
            <button
              onClick={() => selectHistory(index)}
              disabled={step === index}
            >
              Go to move #{index} {step === index && 'current'}
            </button>
          </li>
        )
      })}
    </>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
