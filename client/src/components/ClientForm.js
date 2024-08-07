import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ClientForm = ({ onSubmit }) => {
  return (
    <div>
      <h2>Add New Client</h2>
      <Formik
        initialValues={{ first_name: '', last_name: '', email: '', phone_number: '' }}
        validationSchema={Yup.object({
          first_name: Yup.string().required('Required'),
          last_name: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email address').required('Required'),
          phone_number: Yup.string().required('Required'),
        })}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
        }}
      >
        <Form>
          <div>
            <label htmlFor="first_name">First Name</label>
            <Field name="first_name" type="text" />
            <ErrorMessage name="first_name" component="div" />
          </div>
          <div>
            <label htmlFor="last_name">Last Name</label>
            <Field name="last_name" type="text" />
            <ErrorMessage name="last_name" component="div" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label htmlFor="phone_number">Phone Number</label>
            <Field name="phone_number" type="text" />
            <ErrorMessage name="phone_number" component="div" />
          </div>
          <button type="submit">Add Client</button>
        </Form>
      </Formik>
    </div>
  );
};

export default ClientForm;