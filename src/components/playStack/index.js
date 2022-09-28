import React, { useState } from 'react'
import './PlayStack.css'
function PlayStack({content}) {
  const [stack, setStack] =  useState(content)

  const [sortOrder, setSortOrder] = useState("asc")

  const sortAsc = () => {
    setStack([...stack].sort((a, b) => a[0] - b[0]))
    setSortOrder("asc")
  }
  const sortDesc = () => {
    setStack([...stack].sort((a, b) => b[0] - a[0]))
    setSortOrder("desc")
  }
  const sortByTime = () => {
    setStack(content)
    setSortOrder("time")
  }
  return (
    <div className='play-stack'>
      <button onClick={()=>sortAsc()} >Sort Asc</button>
      <button onClick={()=>sortDesc()} >Sort Desc</button>
      <button onClick={()=>sortByTime()} >Sort By Time</button>
      <p>Step sorted by {sortOrder}</p>
      {stack.map((item, i) => (
        <div className='play-stack-item' key={i}>
          <p>Row: {item[0]}, Column: {item[1]}, Player: {item[2]}</p>
          </div>
      ))}
    </div>
  )
}

export default PlayStack
