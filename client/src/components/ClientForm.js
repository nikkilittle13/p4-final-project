import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ClientForm({ onSubmit }) {
  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  return (
    <div>
      <h2 className="title">Add New Client</h2>
      <Formik
        initialValues={{ first_name: '', last_name: '', email: '', phone_number: '' }}
        validationSchema={Yup.object({
          first_name: Yup.string().required('Required'),
          last_name: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email address').required('Required'),
          phone_number: Yup.string().required('Required').matches(phoneRegExp, 'Phone number is not valid').min(10, "too short").max(10, "too long"),
        })}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
        }}
      >
        <Form className='form'>
          <div>
            <label className='form-label' htmlFor="first_name">First Name: </label>
            <Field name="first_name" type="text" />
            <ErrorMessage name="first_name" component="div" />
          </div>
          <div>
            <label className='form-label' htmlFor="last_name">Last Name: </label>
            <Field name="last_name" type="text" />
            <ErrorMessage name="last_name" component="div" />
          </div>
          <div>
            <label className='form-label' htmlFor="email">Email: </label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label className='form-label' htmlFor="phone_number">Phone Number: </label>
            <Field name="phone_number" type="text" />
            <ErrorMessage name="phone_number" component="div" />
          </div>
          <button className='button' type="submit">Add Client</button>
        </Form>
      </Formik>
    </div>
  );
};

export default ClientForm;