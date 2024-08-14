import React, { useState } from 'react';
import ClientForm from '../components/ClientForm';
import ClientCard from '../components/ClientCard';

function Clients({ clients, onAddClient }) {
  const [showClients, setShowClients] = useState(false);

  return (
    <div>
      <h1 className='title'>Clients</h1>
      <ClientForm onSubmit={onAddClient} />
      <button className='button' onClick={() => setShowClients(prev => !prev)}>
        {showClients ? 'Hide Client List' : 'View Client List'}
      </button>
      {showClients && <ClientCard clients={clients} />}
    </div>
  );
};

export default Clients;