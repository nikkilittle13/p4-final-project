import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Stylists from '../pages/Stylists';
import Appointments from '../pages/Appointments';
import Clients from '../pages/Clients';
import NavBar from './NavBar';

function App() {
  const [clients, setClients] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5555/stylists')
      .then(res => res.json())
      .then(data => setStylists(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5555/appointments')
  .then(response => response.json())
  .then(data => {
    console.log('Appointments fetched:', data);
    setAppointments(data);
  })
  .catch(error => console.error('Error fetching appointments:', error));
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:5555/clients');
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const clients = await response.json();
      setClients(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };
  
  const handleAddClient = async (client) => {
    try {
      const response = await fetch('http://localhost:5555/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });
  
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Network response was not ok. Server responded with: ${error}`);
      }
  
      // Fetch the updated client list
      fetchClients();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStylists = async () => {
    try {
      const response = await fetch('http://localhost:5555/stylists');
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const stylists = await response.json();
      setStylists(stylists);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddStylist = async (stylist) => {
    try {
      const response = await fetch('http://localhost:5555/stylists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stylist),
      });
  
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Network response was not ok. Server responded with: ${error}`);
      }
  
      // Fetch the updated stylist list
      fetchStylists();
    } catch (error) {
      console.error('Error:', error);
      alert('There was a problem adding the stylist. Please try again.');
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5555/appointments');
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Optionally, you could set an error state here to inform users of the problem
    }
  };
  
  
  const handleAddAppointment = async (appointment) => {
    try {
      const response = await fetch('http://localhost:5555/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });
  
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Network response was not ok. Server responded with: ${error}`);
      }
  
      // Fetch the updated appointment list
      fetchAppointments();
    } catch (error) {
      console.error('Error:', error);
      alert('There was a problem adding the appointment. Please try again.');
    }
  };
  
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/appointments"
          element={
            <Appointments
              appointments={appointments}
              setAppointments={setAppointments} 
              stylists={stylists}
              clients={clients}
              setClients={setClients}
              onAddAppointment={handleAddAppointment}
            />
          }
        />
        <Route
          path="/clients"
          element={<Clients clients={clients} onAddClient={handleAddClient} />}
        />
        <Route path="/stylists" element={<Stylists stylists={stylists} onAddStylist={handleAddStylist} />} />
      </Routes>
    </Router>
  );
}

export default App;