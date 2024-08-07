import React from 'react';
import { Formik, Form, Field } from 'formik';

const StylistForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ name: '' }}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      {() => (
        <Form>
          <div>
            <label htmlFor="name">Name:</label>
            <Field id="name" name="name" placeholder="Name" />
          </div>
          <button type="submit">Add Stylist</button>
        </Form>
      )}
    </Formik>
  );
};

export default StylistForm;

