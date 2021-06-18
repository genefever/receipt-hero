import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import logo from "../assets/logo.svg";
import Input from "../components/Input";
import { SignInContainer } from "../components/Container";
import { StyledButton } from "../components/Button";
import { StyledCard } from "../components/Card";
import { Link } from "react-router-dom";
import * as api from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  async function handleSubmit() {
    try {
      await api.forgotPassword({ email: email });
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
        <h3>Forgot Password</h3>
        <hr />
        <p className="small">
          Please enter the email address associated with your account.
        </p>
        {/* <hr /> */}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Email */}
          <Input
            name="email"
            value={email}
            label="Email"
            type="email"
            handleChange={(e) => handleEmailChange(e)}
            controlId={"formBasicEmail"}
          />
          {/* Submit button */}
          <StyledButton $primary type="submit" size="lg" className="mt-4" block>
            Request a recovery link
          </StyledButton>
          <Link to="/login">
            <StyledButton variant="link" size="lg" block className="pb-0 mt-2">
              Back to login
            </StyledButton>
          </Link>
        </Form>
      </StyledCard>
    </SignInContainer>
  );
}

export default ForgotPassword;
