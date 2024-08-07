import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';

function AppointmentForm({ clients, stylists, setClients, setAppointments }) {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });

  // Generate available times
  useEffect(() => {
    const generateTimes = () => {
      const startHour = 9; // 9 AM
      const endHour = 17; // 5 PM
      const interval = 30; // 30-minute intervals
      let times = [];
      
      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minutes = 0; minutes < 60; minutes += interval) {
          let time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          times.push(time);
        }
      }
      return times;
    };

    setAvailableTimes(generateTimes());
  }, []);

  // Fetch services from backend
  useEffect(() => {
    fetch('http://localhost:5555/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  
    if (Array.isArray(clients)) {
      const results = query
        ? clients.filter(client =>
            `${client.first_name} ${client.last_name}`.toLowerCase().includes(query.toLowerCase())
          )
        : [];
      setFilteredClients(results);
    } else {
      setFilteredClients([]);
    }
  };

  const handleNewClientChange = (event) => {
    const { name, value } = event.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClient = (event) => {
    event.preventDefault();

    fetch('http://localhost:5555/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setFilteredClients([...filteredClients, data]);
        setClients([...clients, data]);
        setShowNewClientForm(false);
        setSearchQuery('');
      })
      .catch(error => console.error('Error adding new client:', error));
  };

  const handleSubmit = (values) => {
    console.log('Form Values on submit:', values);

    // Create the appointment
    fetch('http://localhost:5555/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: values.client_id,
        stylist_id: values.stylist_id,
        date: values.date,
        time: values.time
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Appointment created:', data);

        // Create the appointment_service entries with notes
        if (data.id && values.services.length > 0) {
          const serviceRequests = values.services.map(service => ({
            appointment_id: data.id,
            service_id: service.service_id,
            notes: service.notes || '' // Handle optional notes
          }));

          return fetch('http://localhost:5555/appointment_service', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceRequests),
          })
          .then(response => response.json())
          .then(() => {
            // Update the appointments state
            setAppointments(prevAppointments => [...prevAppointments, data]);
          });
        }
        // If no services, just update the appointments state
        setAppointments(prevAppointments => [...prevAppointments, data]);
      })
      .catch((error) => console.error('Error creating appointment:', error));
  };

  return (
    <Formik
      initialValues={{
        client_id: '',
        stylist_id: '',
        date: '',
        time: '',
        services: [{ service_id: '', notes: '' }]
      }}
      validationSchema={Yup.object({
        client_id: Yup.string().required('Client is required'),
        stylist_id: Yup.string().required('Stylist is required'),
        date: Yup.date().required('Date is required'),
        time: Yup.string().required('Time is required'),
        services: Yup.array().of(
          Yup.object().shape({
            service_id: Yup.string().required('Service is required'),
            notes: Yup.string().optional() // Optional notes field
          })
        )
      })}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div>
            <label htmlFor="clientSearch">Search for Client</label>
            <input
              type="text"
              id="clientSearch"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search clients..."
            />
          </div>

          {searchQuery && (
            <div>
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <div key={client.id}>
                    <label>
                      <Field
                        type="radio"
                        name="client_id"
                        value={client.id}
                        onChange={() => setFieldValue('client_id', client.id)}
                      />
                      {client.first_name} {client.last_name}
                    </label>
                  </div>
                ))
              ) : (
                <p>No clients found</p>
              )}
            </div>
          )}

          {searchQuery && filteredClients.length === 0 && !showNewClientForm && (
            <div>
              <p>Would you like to add a new client?</p>
              <button type="button" onClick={() => setShowNewClientForm(true)}>
                Add New Client
              </button>
            </div>
          )}

          {showNewClientForm && (
            <div>
              <h4>Add New Client</h4>
              <form onSubmit={handleAddClient}>
                <div>
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={newClient.first_name}
                    onChange={handleNewClientChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={newClient.last_name}
                    onChange={handleNewClientChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newClient.email}
                    onChange={handleNewClientChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone_number">Phone Number</label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    value={newClient.phone_number}
                    onChange={handleNewClientChange}
                    required
                  />
                </div>
                <button type="submit">Submit New Client</button>
                <button type="button" onClick={() => setShowNewClientForm(false)}>
                  Cancel
                </button>
              </form>
            </div>
          )}

          <div>
            <label htmlFor="stylist_id">Select Stylist</label>
            <Field as="select" name="stylist_id" id="stylist_id">
              <option value="">Select a stylist</option>
              {stylists && stylists.length > 0 ? (
                stylists.map(stylist => (
                  <option key={stylist.id} value={stylist.id}>
                    {stylist.name}
                  </option>
                ))
              ) : (
                <option value="">No stylists available</option>
              )}
            </Field>
            <ErrorMessage name="stylist_id" component="div" />
          </div>

          <div>
            <label htmlFor="date">Date</label>
            <Field
              as="input"
              type="date"
              name="date"
              id="date"
            />
            <ErrorMessage name="date" component="div" />
          </div>

          <div>
            <label htmlFor="time">Time</label>
            <Field as="select" name="time" id="time">
              <option value="">Select a time</option>
              {availableTimes && availableTimes.length > 0 ? (
                availableTimes.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))
              ) : (
                <option value="">No times available</option>
              )}
            </Field>
            <ErrorMessage name="time" component="div" />
          </div>

          <div>
            <FieldArray name="services">
              {({ insert, remove, push }) => (
                <div>
                  <label>Services</label>
                  {values.services.length > 0 &&
                    values.services.map((service, index) => (
                      <div key={index}>
                        <Field as="select" name={`services.${index}.service_id`}>
                          <option value="">Select a service</option>
                          {services && services.length > 0 ? (
                            services.map(serviceOption => (
                              <option key={serviceOption.id} value={serviceOption.id}>
                                {serviceOption.type} - ${serviceOption.price}
                              </option>
                            ))
                          ) : (
                            <option value="">No services available</option>
                          )}
                        </Field>
                        <ErrorMessage name={`services.${index}.service_id`} component="div" />
                        <Field
                          name={`services.${index}.notes`}
                          type="text"
                          placeholder="Special notes..."
                        />
                        <ErrorMessage name={`services.${index}.notes`} component="div" />
                        <button type="button" onClick={() => remove(index)}>Remove</button>
                      </div>
                    ))}
                  <button
                    type="button"
                    onClick={() => push({ service_id: '', notes: '' })}
                  >
                    Add Service
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}

export default AppointmentForm;