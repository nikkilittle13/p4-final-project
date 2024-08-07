import React, { useState, useEffect } from 'react';
import AppointmentForm from '../components/AppointmentForm'; // Adjust the import according to your project structure

const Appointments = ({ appointments, handleAddAppointment, setClients, stylists, clients, setAppointments }) => {
  const [showAppointments, setShowAppointments] = useState(false);

  useEffect(() => {
    console.log('Appointments updated:', appointments);
  }, [appointments]);

  return (
    <div>
      <h1>Appointments</h1>

      {/* Appointment Form */}
      <AppointmentForm 
        onSubmit={handleAddAppointment} 
        setClients={setClients} 
        stylists={stylists} 
        clients={clients} 
        setAppointments={setAppointments} 
      />

      {/* Button to Toggle Appointment List */}
      <button onClick={() => setShowAppointments(prev => !prev)}>
        {showAppointments ? 'Hide Appointment List' : 'View Appointment List'}
      </button>

      {/* Conditional Rendering of Appointment List */}
      {showAppointments && (
        <ul>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li key={appointment.id}>
                <p>
                  <strong>Client:</strong> 
                  {appointment.client?.first_name || 'Unknown'} {appointment.client?.last_name || 'Unknown'}
                </p>
                <p><strong>Date:</strong> {appointment.date || 'N/A'}</p>
                <p><strong>Time:</strong> {appointment.time || 'N/A'}</p>
                <p><strong>Stylist:</strong> {appointment.stylist?.name || 'Unknown'}</p>
              </li>
            ))
          ) : (
            <p>No appointments available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Appointments;