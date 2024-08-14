import React from 'react';
import { Formik, Form, Field } from 'formik';

function StylistForm({ onSubmit }) {
  return (
    <div>
    <h2 className="title">Add New Stylist</h2>
    <Formik
      initialValues={{ name: '' }}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      <Form className='form'>
        <div>
          <label className='form-label' htmlFor="name">Name: </label>
          <Field id="name" name="name" placeholder="Name" />
        </div>
        <button className='button' type="submit">Add Stylist</button>
      </Form>
    </Formik>
    </div>
  );
};

export default StylistForm;

