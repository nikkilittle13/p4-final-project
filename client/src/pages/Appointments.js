// Appointments.js
import React, { useState, useEffect } from 'react';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentCard from '../components/AppointmentCard';

function Appointments({ appointments, handleAddAppointment, setClients, stylists, clients, setAppointments, services, setServices, completeAppointments }) {
  const [showAppointments, setShowAppointments] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);

  function handleEditAppointment(appointment) {
    setAppointmentToEdit(appointment);
    setShowAppointments(true);
  };

  function handleUpdateAppointment(updatedAppointment) {
    setAppointments(prev => 
      prev.map(app => app.id === updatedAppointment.id ? updatedAppointment : app)
    );
    setAppointmentToEdit(null);
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const response = await fetch(`http://localhost:5555/appointments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
      const data = await response.json();
      console.log('Appointment deleted:', data);
  
      setAppointments(prevAppointments => 
        prevAppointments.filter(appointment => appointment.id !== id)
      );
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };
  

  return (
    <div>
      <h1 className='title'>Appointments</h1>
      <AppointmentForm 
        onSubmit={appointmentToEdit ? handleUpdateAppointment : handleAddAppointment} 
        setClients={setClients} 
        stylists={stylists} 
        clients={clients} 
        setAppointments={setAppointments} 
        appointmentToEdit={appointmentToEdit}
        services={services} 
        setServices={setServices}
      />
      <button className='button' onClick={() => setShowAppointments(prev => !prev)}>
        {showAppointments ? 'Hide Appointments' : 'View Appointments'}
      </button>
      {showAppointments && (
      <AppointmentCard 
        appointments={appointments}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
      />
      )}
    </div>
  );
};

export default Appointments;