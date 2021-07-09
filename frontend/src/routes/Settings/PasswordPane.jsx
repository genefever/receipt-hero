import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import { FormTextField } from "../../components/Form";
import { StyledButton } from "../../components/Button";

// Formik validation schema
const schema = yup.object({
  currentPassword: yup.string().required("Required"),
  newPassword: yup.string().required("Required"),
  confirmNewPassword: yup.string().required("Required"),
});

const defaultPassword = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function PasswordPane(props) {
  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={defaultPassword}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          props.handleSubmitPassword(values).then(() => {
            setSubmitting(false);
            resetForm(defaultPassword);
          });
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <FormTextField
                as={Col}
                md={7}
                label="Current Password"
                name="currentPassword"
                type="password"
              />

              <FormTextField
                as={Col}
                md={7}
                label="New Password"
                name="newPassword"
                type="password"
              />

              <FormTextField
                as={Col}
                md={7}
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
              />
            </Form.Row>

            {/* Save Button */}
            <StyledButton
              $primary
              type="submit"
              className="mt-2"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Save"}
            </StyledButton>
          </Form>
        )}
      </Formik>
    </>
  );
}
export default PasswordPane;
