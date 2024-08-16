import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import "../index.css";

function AppointmentForm({ clients, stylists, setAppointments, appointmentToEdit, onUpdate, onDelete, services}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    const generateTimes = () => {
      const startHour = 9;
      const endHour = 16;
      const interval = 30;
      let times = [];
      
      for (let hour = startHour;  hour <= endHour; hour++) {
        for (let minutes = 0; minutes < 60; minutes += interval) {
          let time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          times.push(time);
        }
      }
      return times;
    };

    setAvailableTimes(generateTimes());
  }, []);

  useEffect(() => {
    if (appointmentToEdit) {
      setFilteredClients(clients.filter(client => client.id === appointmentToEdit.client_id));
      setSearchQuery('');
    }
  }, [appointmentToEdit, clients]);

  function handleSearchChange(event) {
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

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const method = appointmentToEdit ? 'PATCH' : 'POST';
      const endpoint = appointmentToEdit && appointmentToEdit.id
        ? `http://localhost:5555/appointments/${appointmentToEdit.id}`
        : 'http://localhost:5555/appointments';
  
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: values.client_id,
          stylist_id: values.stylist_id,
          date: values.date,
          time: values.time,
          services: values.services.map(({ service_id, notes }) => ({
            service_id,
            notes
          }))
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create/update appointment');
      }
  
      const appointmentData = await response.json();
  
      setAppointments(prevAppointments => {
        const updatedAppointments = appointmentToEdit
          ? prevAppointments.map(app => (app.id === appointmentData.id ? { ...app, ...appointmentData } : app))
          : [...prevAppointments, appointmentData];
  
        return updatedAppointments;
      });
  
      setSearchQuery('');
      resetForm();
    } catch (error) {
      console.error('Error creating/updating appointment:', error);
    }
  };
  
  return (
    <div>
      <h2 className="title">{appointmentToEdit ? 'Edit Appointment' : 'Create New Appointment'}</h2>
      <Formik
        initialValues={{
          client_id: appointmentToEdit ? appointmentToEdit.client_id : '',
          stylist_id: appointmentToEdit ? appointmentToEdit.stylist_id : '',
          date: appointmentToEdit ? appointmentToEdit.date : '',
          time: appointmentToEdit ? appointmentToEdit.time : '',
          services: appointmentToEdit ? appointmentToEdit.services : [{ service_id: '', notes: '' }]
        }}
        validationSchema={Yup.object({
          client_id: Yup.string().required('Client is required'),
          stylist_id: Yup.string().required('Stylist is required'),
          date: Yup.date().required('Date is required'),
          time: Yup.string().required('Time is required'),
          services: Yup.array().of(
            Yup.object().shape({
              service_id: Yup.string().required('Service is required'),
              notes: Yup.string().optional()
            })
          )
        })}
        onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <Form className='form'>
            <div>
              <label className='form-label' htmlFor="clientSearch">Search for Client: </label>
              <input
                type="text"
                id="clientSearch"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search clients..."/>
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
                          onChange={() => setFieldValue('client_id', client.id)}/>
                        {client.first_name} {client.last_name}
                      </label>
                    </div>
                  ))
                ) : (<p>No clients found</p>)}
              </div>
            )}
            <div>
              <label className='form-label' htmlFor="stylist_id">Select Stylist: </label>
              <Field as="select" name="stylist_id" id="stylist_id">
                <option value="">Select a stylist</option>
                {stylists && stylists.length > 0 ? (
                  stylists.map(stylist => (
                    <option key={stylist.id} value={stylist.id}>
                      {stylist.name}
                    </option>
                  ))
                ) : (<option value="">No stylists available</option>)}
              </Field>
              <ErrorMessage name="stylist_id" component="div" />
            </div>
            <div>
              <label className='form-label' htmlFor="date">Date: </label>
              <Field
                as="input"
                type="date"
                name="date"
                id="date"/>
              <ErrorMessage name="date" component="div" />
            </div>
            <div>
              <label className='form-label' htmlFor="time">Time: </label>
              <Field as="select" name="time" id="time">
                <option value="">Select a time</option>
                {availableTimes.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="time" component="div" />
            </div>
            <div>
              <FieldArray name="services">
                {({ remove, push }) => (
                  <div>
                    <label className='form-label'>Services:</label>
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
                            ) : (<option value="">No services available</option>)}
                          </Field>
                          <ErrorMessage name={`services.${index}.service_id`} component="div" />
                          <Field
                            name={`services.${index}.notes`}
                            type="text"
                            placeholder="Special notes..."/>
                          <ErrorMessage name={`services.${index}.notes`} component="div" />
                          <button className='button' type="button" onClick={() => remove(index)}>Remove Service</button>
                        </div>
                      ))}
                    <button
                      className='button' type="button" onClick={() => push({ service_id: '', notes: '' })}>
                      Add Additional Service
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
            <div>
              <button className="button "type="submit" onClick={onUpdate}>{appointmentToEdit ? 'Update Appointment' : 'Confirm Appointment'}</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AppointmentForm;