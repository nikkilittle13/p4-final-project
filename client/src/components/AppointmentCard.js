import React from 'react';

function AppointmentCard({ appointments, onEdit, onDelete }) {
  return (
    <div>
      {appointments.map((appointment) => (
        <div className='container' key={appointment.id}>
          <h1 className='name'>{appointment.client.first_name} {appointment.client.last_name}</h1>
          <p className='details'>Stylist: {appointment.stylist?.name}</p>
          <p className='details'>Date: {appointment.date}</p>
          <p className='details'>Time: {appointment.time}</p>
          <h2 className='form-label'>Services:</h2>
          {appointment.appointment_services.map((service, index) => (
            <div key={index}>
              <p className='details'>* {service.service.type} - ${service.service.price}</p>
              <p  className='details'>Client notes: {service.notes}</p>
            </div>
          ))}
          <button className='button' onClick={() => onEdit(appointment)}>Edit</button>
          <button className='button' onClick={() => onDelete(appointment.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AppointmentCard