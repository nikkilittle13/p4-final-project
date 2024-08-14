import React, { useState, useEffect } from 'react';
import StylistForm from '../components/StylistForm';
import StylistCard from '../components/StylistCard';

function Stylists({ stylists, onAddStylist }) {
  const [showStylists, setShowStylists] = useState(false);

  return (
    <div>
      <h1 className='title'>Stylists</h1>
      <StylistForm onSubmit={onAddStylist} />
      <button className='button' onClick={() => setShowStylists(prev => !prev)}>
        {showStylists ? 'Hide Stylist List' : 'View Stylist List'}
      </button>
      {showStylists && <StylistCard stylists={stylists} />}
    </div>
  );
};

export default Stylists;