import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import logo from "../assets/logo.svg";
import Input from "../components/Input";
import { SignInContainer } from "../components/Container";
import { StyledButton } from "../components/Button";
import { StyledCard } from "../components/Card";
import { Link, useParams } from "react-router-dom";
import * as api from "../api";

function ForgotPassword(props) {
  const [isResetPassword, setIsResetPassword] = useState(props.isSignUp);
  const defaultAlertMessage = { message: "", variant: "", heading: "" };
  const [alertMessage, setAlertMessage] = useState(defaultAlertMessage);
  const { token } = useParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Update authentication page based on props.isSignUp change.
  useEffect(() => {
    setIsResetPassword(props.isResetPassword);
  }, [props.isResetPassword]);

  function handleFormDataChange(event) {
    const { name, value } = event.target;
    setFormData((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleSubmit() {
    if (isResetPassword) {
      resetPassword();
    } else {
      forgotPassword();
    }
  }

  async function resetPassword() {
    try {
      await api.resetPassword(token, formData);
    } catch (err) {
      if (err.response)
        setAlertMessage({
          message: err.response.data.message,
          variant: "danger",
          heading: "",
        });
    }
  }

  function forgotPassword() {
    try {
      api.forgotPassword(formData);
      setAlertMessage({
        message:
          "If your submission matches our records, a link will be sent to the provided email address with information on how to reset your password. The link will only be valid for a short period of time.",
        variant: "success",
        heading: "Reset Link Sent",
      });
    } catch (err) {
      if (err.response)
        setAlertMessage({
          message: err.response.data.message,
          variant: "danger",
        });
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
      {alertMessage.message && (
        <Alert
          variant={alertMessage.variant}
          onClose={() => setAlertMessage(defaultAlertMessage)}
          dismissible
        >
          {alertMessage.heading && (
            <>
              <Alert.Heading>{alertMessage.heading}</Alert.Heading>
              <hr />
            </>
          )}

          {alertMessage.message}
        </Alert>
      )}
      <StyledCard>
        <h3>{isResetPassword ? "Reset" : "Forgot"} Password</h3>
        <hr />
        {!isResetPassword && (
          <p className="small">
            Please enter the email address associated with your account.
          </p>
        )}

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Email / Password */}
          {isResetPassword ? (
            <div>
              <Input
                name="password"
                value={formData.password}
                label="New password"
                type="password"
                handleChange={(event) => handleFormDataChange(event)}
                controlId={"formBasicPassword"}
              />
            </div>
          ) : (
            <Input
              name="email"
              value={formData.email}
              label="Email"
              type="email"
              handleChange={(e) => handleFormDataChange(e)}
              controlId={"formBasicEmail"}
            />
          )}
          {/* Submit button */}
          <StyledButton $primary type="submit" size="lg" className="mt-4" block>
            {isResetPassword ? "Update password" : "Email me a recovery link"}
          </StyledButton>
          {!isResetPassword && (
            <Link to="/login">
              <StyledButton
                variant="link"
                size="lg"
                block
                className="pb-0 mt-2"
              >
                Back to login
              </StyledButton>
            </Link>
          )}
        </Form>
      </StyledCard>
    </SignInContainer>
  );
}

export default ForgotPassword;
