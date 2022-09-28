import React, {  useRef, useState } from 'react'
import { BOARD_HORIZONTAL_SIZE, BOARD_VERTICAL_SIZE, N_WIN } from '../../constants'
import TurnBar from '../turnbar';
import './board.css'
const initializeValues = (N, M, value) => {
  const board = []
  for (let i = 0; i < N; i++) {
    board.push([])
    for (let j = 0; j < M; j++) {
      board[i].push(value)
    }
  }
  return board
}
export default function Board() {
  const [board, setBoard] = useState(initializeValues(BOARD_HORIZONTAL_SIZE, BOARD_VERTICAL_SIZE, ''))
  const [turn, setTurn] = useState('X')
  const [winner, setWinner] = useState(null)
  const rowControl = useRef(initializeValues(BOARD_HORIZONTAL_SIZE, BOARD_VERTICAL_SIZE, ''))
  const colControl = useRef(initializeValues(BOARD_VERTICAL_SIZE, BOARD_HORIZONTAL_SIZE, ''))
  const mainDiagonalControl = useRef(initializeValues(BOARD_HORIZONTAL_SIZE*2, BOARD_HORIZONTAL_SIZE+BOARD_VERTICAL_SIZE, ''))
  const diagonalControl = useRef(initializeValues(BOARD_HORIZONTAL_SIZE*2, BOARD_HORIZONTAL_SIZE+BOARD_VERTICAL_SIZE, ''))
  const reset = () => {
    setBoard(initializeValues(BOARD_HORIZONTAL_SIZE, BOARD_VERTICAL_SIZE, ''))
    setTurn('X')
    setWinner(null)
    rowControl.current = initializeValues(BOARD_HORIZONTAL_SIZE, BOARD_VERTICAL_SIZE, '')
    colControl.current = initializeValues(BOARD_VERTICAL_SIZE, BOARD_HORIZONTAL_SIZE, '')
    mainDiagonalControl.current = initializeValues(BOARD_HORIZONTAL_SIZE*2, BOARD_HORIZONTAL_SIZE+BOARD_VERTICAL_SIZE, '')
    diagonalControl.current = initializeValues(BOARD_HORIZONTAL_SIZE*2, BOARD_HORIZONTAL_SIZE+BOARD_VERTICAL_SIZE, '')
  }
  const checkIsWin = (arr) => {
    let i = 1
    let cnt = 1
    const len = arr.length
    while (i < len) {
      if (arr[i] === '') {
        i++
        cnt = 1
        continue
      }
      if (arr[i] === arr[i-1]) {
        cnt++
        if (cnt === N_WIN) {
          return true
        }
        i++
        continue
      }
      else{
        cnt = 1
        i++
      }
    }
    return false
  }
  const checkArrayWin = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (checkIsWin(arr[i])) {
        return true
      }
    }
    return false
  }
  const handlePlay = (cell, row, col) => {
    if (cell === '' && !winner) {
      board[row][col] = turn
      rowControl.current[row][col] = turn
      colControl.current[col][row] = turn
      mainDiagonalControl.current[row+col][row] = turn
      diagonalControl.current[BOARD_VERTICAL_SIZE-1-row+col][col] = turn
      setBoard(board)
      setTurn(turn === 'X' ? 'O' : 'X')
      if ( checkArrayWin(rowControl.current)
        || checkArrayWin(colControl.current)
        || checkArrayWin(mainDiagonalControl.current)
        || checkArrayWin(diagonalControl.current)) {
        setWinner(turn)
      }
    }
  }
  return (
    <>
    <TurnBar turn={turn} winner={winner} reset={reset} />
    <div className='board'>
      {
      board.map((row, i) => (
        <div className='row' key={i}>{
          row.map((cell, j) => (
            <div
              className='cell'
              key={j}
              onClick={() => handlePlay(cell, i, j)}
            >{cell}</div>
          ))

    }</div>
    ))}
    </div>
    </>
  )
}
