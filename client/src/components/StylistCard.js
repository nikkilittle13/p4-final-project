import React from 'react';

function StylistCard({ stylists }) {
  return (
    <div>
      <h1 className='title'>Stylist List</h1>
      {stylists.map((stylist, index) => {
         return (
         <div className='container' key={stylist.id}>
            <h1 className='name'>{stylist.name}</h1>
        </div>)
      })}
    </div>
  )
}

export default StylistCard;