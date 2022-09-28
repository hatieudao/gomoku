import React, {  useRef, useState } from 'react'
import { BOARD_HORIZONTAL_SIZE, BOARD_VERTICAL_SIZE, N_WIN } from '../../constants'
import TurnBar from '../turnbar';
import classNames from 'classnames';
import './board.css'
import PlayStack from '../playStack';
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
  const playStack = useRef([])
  const winInfo = useRef({})
  const winStack = useRef([])
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
    playStack.current = []
    winInfo.current = {}
    winStack.current = []
  }
  const checkIsWin = (arr, index, type) => {
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
          winInfo.current = { end: i, type, index}
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
  const checkArrayWin = (arr, type) => {
    for (let i = 0; i < arr.length; i++) {
      if (checkIsWin(arr[i], i, type)) {
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
      diagonalControl.current[BOARD_VERTICAL_SIZE + row - col][col] = turn
      playStack.current.push([row, col, turn])
      setBoard(board)
      if ( checkArrayWin(rowControl.current, 'row')
        || checkArrayWin(colControl.current, 'col')
        || checkArrayWin(mainDiagonalControl.current, 'mainDiagonal')
        || checkArrayWin(diagonalControl.current, 'diagonal')) {
          winStack.current = getWinCells()
          setWinner(turn)
      }
      setTurn(turn === 'X' ? 'O' : 'X')
    }
  }
  const getWinCells = ()=>{
    const { end, type, index } = winInfo.current
    switch(type) {
      case 'row':
        let res = []
        for(let i = end-N_WIN+1; i <= end; i++) {
          res.push([index, i, turn])
        }
        return res
      case 'col':
        let res1 = []
        for(let i = end-N_WIN+1; i <= end; i++) {
          res1.push([i, index, turn])
        }
        return res1
      case 'mainDiagonal':
        let res2 = []
        for(let i = end-N_WIN+1; i <= end; i++) {
          res2.push([i, index-i, turn])
        }
        return res2
      case 'diagonal':
        let res3 = []
        for(let i = end-N_WIN+1; i <= end; i++) {
          res3.push([index+i-BOARD_VERTICAL_SIZE, i, turn])
        }
        return res3
      default:
        return []
    }
  }
  const Include = (arr, item) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] === item[0] && arr[i][1] === item[1]) {
        return true
      }
    }
    return false
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
            className={classNames({
                'cell': true,
                'cant-click': cell !== '',
                'current': ( playStack.current.length > 0 && i===playStack.current[playStack.current.length-1][0] && j===playStack.current[playStack.current.length-1][1]),
                'win': Include(winStack.current, [i, j])
              })}
              key={j}
              onClick={() => handlePlay(cell, i, j)}
            >{cell}</div>
          ))

    }</div>
    ))}
    </div>
    <PlayStack content={playStack.current} />
    </>
  )
}
