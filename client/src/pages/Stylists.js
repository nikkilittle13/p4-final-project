import React, { useState, useEffect } from 'react';
import StylistForm from '../components/StylistForm'

const Stylists = ({ stylists, onAddStylist }) => {
  const [showStylists, setShowStylists] = useState(false);

  useEffect(() => {
    console.log('Stylists updated:', stylists);
  }, [stylists]);

  return (
    <div>
      <h1>Stylists</h1>
      <StylistForm onSubmit={onAddStylist} />
      <button onClick={() => setShowStylists(prev => !prev)}>
        {showStylists ? 'Hide Stylist List' : 'View Stylist List'}
      </button>
      {showStylists && (
        <ul>
          {stylists.length > 0 ? (
            stylists.map((stylist) => (
              <li key={stylist.id}>
                <p><strong>Name:</strong> {stylist.name}</p>
                <button onClick={() => console.log('View appointments for', stylist.id)}>View Appointments</button>
              </li>
            ))
          ) : (
            <p>No stylists available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Stylists;


