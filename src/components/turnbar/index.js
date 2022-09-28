import React from 'react'
import './turnbar.css'
function TurnBar({ turn, winner, reset }) {
  return (
    <div className='turnbar'>
    <p>{
      winner ? `Winner: ${winner}` : `Turn: ${turn}`
    }</p>
    {winner && <button onClick={() => reset()}>Reset</button>}
    </div>
  )
}

export default TurnBar
