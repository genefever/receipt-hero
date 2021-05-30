import React from "react";
import Form from "react-bootstrap/Form";

const Input = ({ name, handleChange, label, type, value, controlId, as }) => {
  return (
    <Form.Group as={as} controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        name={name}
        onChange={handleChange}
        required
        type={type}
        value={value}
      />
    </Form.Group>
  );
};

export default Input;
