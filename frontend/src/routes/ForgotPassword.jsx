import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import logo from "../assets/logo.svg";
import Input from "../components/Input";
import { SignInContainer } from "../components/Container";
import { StyledButton } from "../components/Button";
import { StyledCard } from "../components/Card";
import { Link } from "react-router-dom";
import * as api from "../api";

function ForgotPassword(props) {
  const [isResetPassword, setIsResetPassword] = useState(props.isSignUp);
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

  function handleSubmit(event) {
    event.preventDefault();

    if (isResetPassword) {
      resetPassword();
    } else {
      forgotPassword();
    }
  }

  async function resetPassword() {
    try {
      await api.resetPassword(formData);
    } catch (err) {
      console.log(err);
    }
  }

  async function forgotPassword() {
    try {
      await api.forgotPassword(formData);
    } catch (err) {
      console.log(err);
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
      <StyledCard>
        <h3>{isResetPassword ? "Reset" : "Forgot"} Password</h3>
        <hr />
        {!isResetPassword && (
          <p className="small">
            Please enter the email address associated with your account.
          </p>
        )}
        {/* <hr /> */}
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
            {isResetPassword ? "Update password" : "Request a recovery link"}
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
