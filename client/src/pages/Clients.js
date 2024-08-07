import React, { useState, useEffect } from 'react';
import ClientForm from '../components/ClientForm';

const Clients = ({ clients, onAddClient }) => {
  const [showClients, setShowClients] = React.useState(false);

  useEffect(() => {
    console.log('Clients updated:', clients);
  }, [clients]);

  return (
    <div>
      <h1>Clients</h1>
      <ClientForm onSubmit={onAddClient} />
      <button onClick={() => setShowClients(prev => !prev)}>
        {showClients ? 'Hide Client List' : 'View Client List'}
      </button>
      {showClients && (
        <ul>
          {clients.length > 0 ? (
            clients.map((client) => (
              <li key={client.id}>
                <p><strong>Name:</strong> {client.first_name} {client.last_name}</p>
                <p><strong>Email:</strong> {client.email}</p>
                <p><strong>Phone:</strong> {client.phone_number}</p>
                <button onClick={() => console.log('View appointments for', client.id)}>View Appointments</button>
              </li>
            ))
          ) : (
            <p>No clients available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Clients;

