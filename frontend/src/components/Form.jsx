import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useField } from "formik";

export const FormTextField = ({
  label,
  as,
  xs,
  md,
  lg,
  inputGroupPrepend,
  inputGroupAppend,
  inputGroupSize,
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <Form.Group as={as} xs={xs} md={md} lg={lg}>
      {label && <Form.Label htmlFor={props.name}>{label}</Form.Label>}
      <InputGroup size={inputGroupSize}>
        {inputGroupPrepend}
        <Form.Control
          {...field}
          // isValid={meta.touched && !meta.error} //TODO isValid for granular checks (i.e. password match)?
          isInvalid={meta.touched && meta.error}
          feedback={meta.error}
          {...props}
        />
        {meta.touched && meta.error ? (
          <Form.Control.Feedback type="invalid">
            {meta.error}
          </Form.Control.Feedback>
        ) : null}
        {inputGroupAppend}
      </InputGroup>
    </Form.Group>
  );
};
