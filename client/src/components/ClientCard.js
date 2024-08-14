import React from 'react';

function ClientCard({ clients }) {
  function formatPhoneNumber(phoneNumber) {
    if (phoneNumber.length === 10 && /^\d+$/.test(phoneNumber)) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    }
  }
  return (
    <div>
      <h1 className='title'>Client List</h1>
      {clients.map((client, index) => {
         return (
         <div className="container" key={client.id}>
                <h1 className='name'>{client.first_name} {client.last_name}</h1>
                <p className='details'>{client.email}</p>
                <p className='details'>{formatPhoneNumber(client.phone_number)}</p>
        </div>)
      })}
    </div>
  )  
}
  
export default ClientCard;