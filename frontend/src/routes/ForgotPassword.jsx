import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import { FormTextField } from "../components/Form";
import logo from "../assets/logo.svg";
import { IoWarningOutline } from "react-icons/io5";
import { SignInContainer } from "../components/Container";
import { StyledButton } from "../components/Button";
import { StyledCard } from "../components/Card";
import { Link, useParams, useHistory } from "react-router-dom";
import * as api from "../api";
import { useDocumentTitle } from "../hooks";

const defaultFormData = {
  email: "",
  password: "",
};

function ForgotPassword(props) {
  const [isResetPassword, setIsResetPassword] = useState(props.isResetPassword);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const { token } = useParams();
  const history = useHistory();

  // Formik validation schema
  const schema = isResetPassword
    ? yup.object({
        password: yup.string().required("Required"),
        confirmPassword: yup
          .string()
          .test("passwords-match", "Passwords must match", function (value) {
            return this.parent.password === value;
          })
          .required("Required"),
      })
    : yup.object({
        email: yup.string().email("Invalid email address").required("Required"),
      });

  // Update authentication page based on props.isSignUp change.
  useEffect(() => {
    setIsResetPassword(props.isResetPassword);
  }, [props.isResetPassword]);

  // Check URL to see if it contains "done". Set isDone based on URL.
  useEffect(() => {
    if (window.location.href.indexOf("done") !== -1) {
      setIsDone(true);
    } else {
      setIsDone(false);
    }
  }, [history.location]);

  // Sets the document title
  useDocumentTitle(
    `Receipt Hero - ${isResetPassword ? "Reset" : "Forgot"} Password`
  );

  function handleSubmit(formData, setSubmitting) {
    if (isResetPassword) {
      resetPassword(formData);
    } else {
      forgotPassword(formData);
    }
    setSubmitting(false);
  }

  async function resetPassword(formData) {
    try {
      await api.resetPassword(formData, token);
      history.push(`/reset/${token}/done`);
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      }
    }
  }

  async function forgotPassword(formData) {
    try {
      await api.forgotPassword(formData);
      history.push("/forgot/done");
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      }
    }
  }

  return (
    <SignInContainer>
      <Card.Body>
        <img
          className="mx-auto d-block mb-3"
          src={logo}
          width="72"
          height="72"
          alt="logo"
        />
      </Card.Body>

      {/* Alert Error Message */}
      {errorMessage && (
        <Alert
          variant="danger"
          onClose={() => setErrorMessage(null)}
          className="d-flex align-items-center"
        >
          <IoWarningOutline className="mr-3" />
          {errorMessage}
        </Alert>
      )}
      <StyledCard>
        {isDone ? (
          <h3>Password Reset {isResetPassword ? "Complete" : "Sent"}</h3>
        ) : (
          <h3>{isResetPassword ? "Reset" : "Forgot"} Password</h3>
        )}
        <hr />
        {!isDone && !isResetPassword && (
          <p className="small">
            Please enter the email address associated with your account.
          </p>
        )}

        {isDone ? (
          isResetPassword ? (
            <p>Your password has been set.</p>
          ) : (
            <p>
              If your submission matches our records, a link will be sent to the
              provided email address with information on how to reset your
              password. The link will only be valid for 15 minutes.
            </p>
          )
        ) : (
          <Formik
            validationSchema={schema}
            initialValues={defaultFormData}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values, setSubmitting);
            }}
          >
            {({ handleSubmit, isSubmitting, errors, values }) => (
              <Form noValidate onSubmit={handleSubmit}>
                {/* Reset Password or Confirm Email */}
                {isResetPassword ? (
                  <div>
                    <FormTextField
                      name="password"
                      label="New password"
                      type="password"
                      isValid={!errors.confirmPassword && values.password}
                    />

                    <FormTextField
                      name="confirmPassword"
                      label="Confirm New Password"
                      type="password"
                      className="mb-3"
                      isValid={
                        !errors.confirmPassword && values.confirmPassword
                      }
                    />
                  </div>
                ) : (
                  <FormTextField name="email" label="Email" />
                )}
                {/* Submit button */}
                <StyledButton
                  $primary
                  type="submit"
                  size="lg"
                  className="mt-4"
                  block
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Loading..."
                    : isResetPassword
                    ? "Update password"
                    : "Email me a recovery link"}
                </StyledButton>
              </Form>
            )}
          </Formik>
        )}
        <Link to="/login">
          <StyledButton
            variant={isDone ? "success" : "link"}
            size="lg"
            block
            className={isDone ? "mt-4" : "pb-0 mt-3"}
          >
            Back to login
          </StyledButton>
        </Link>
      </StyledCard>
    </SignInContainer>
  );
}

export default ForgotPassword;
