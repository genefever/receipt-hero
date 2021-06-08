import React from "react";
import Form from "react-bootstrap/Form";

const Input = ({
  name,
  handleChange,
  label,
  type,
  value,
  controlId,
  as,
  size,
  autoFocus,
  onKeyPress,
  defaultValue,
  onFocus,
}) => {
  return (
    <Form.Group as={as} controlId={controlId}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        name={name}
        onChange={handleChange}
        required
        type={type}
        value={value}
        size={size}
        autoFocus={autoFocus}
        onKeyPress={onKeyPress}
        defaultValue={defaultValue}
        onFocus={onFocus}
      />
    </Form.Group>
  );
};

export default Input;
