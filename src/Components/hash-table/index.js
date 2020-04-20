import React from 'react'

import './style.css';

const HashTable = ({ className = "", data = [], onElementHover, onElementClick }) => {
  return (
    <div className={`hash-table ${className} `}>
      {data.map((el, i) => {
        return <div key={el.key + i} className="hash-table__element">
          <div className="hash-table__key">
            <span>{el.key}</span>
          </div>
          <div className="hash-table__value">
            <span>{el.value}</span>
          </div>
        </div>
      })}
    </div>
  )
}

export default HashTable;