import React from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Separator } from "../components/Separator";
import { SignInContainer } from "../components/Container";
import { SignInCard } from "../components/Card";
import { StyledButton } from "../components/Button";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

function SignUp() {
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

        {/* Social buttons */}

        <StyledButton $google className="w-100 btn-lg btn-block mb-3">
          <i className="fab fa-google"></i> Sign up with Google
        </StyledButton>
        <StyledButton $facebook className="w-100 btn-lg btn-block">
          <i className="fab fa-facebook-square"></i> Sign up with Facebook
        </StyledButton>

        <Separator className="my-3">or</Separator>

        <SignInCard>
          <Form>
            {/* Email */}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control required type="email" />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" />
            </Form.Group>

            {/* Sign up button */}
            <StyledButton $primary className="w-100 btn-lg" type="submit">
              Sign up
            </StyledButton>
          </Form>
        </SignInCard>
      </Card.Body>

      <div className="text-center mt-2">
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </SignInContainer>
  );
}

export default SignUp;
