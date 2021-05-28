import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Separator } from "../components/Separator";
import { SignInContainer } from "../components/Container";
import { StyledCard } from "../components/Card";
import { StyledButton } from "../components/Button";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [formInput, setFormInputChange] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleFormInputChange(event) {
    const { name, value } = event.target;
    setFormInputChange((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function signUp() {
    axios({
      method: "post",
      data: {
        name: formInput.name,
        email: formInput.email,
        password: formInput.password,
      },
      withCredentials: true, // Make axios send cookies in its requests
      url: "http://localhost:4000/signup",
    }).then((res) => console.log(res));
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

        {/* Social buttons */}

        <StyledButton $google size="lg" block className="mb-3">
          <i className="fab fa-google"></i> Sign up with Google
        </StyledButton>
        <StyledButton $facebook size="lg" block>
          <i className="fab fa-facebook-square"></i> Sign up with Facebook
        </StyledButton>

        <Separator className="my-3">or</Separator>

        <StyledCard>
          <Form
            onSubmit={(event) => {
              signUp();
              event.preventDefault();
            }}
          >
            {/* Name */}
            <Form.Group controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                name="name"
                value={formInput.name}
                onChange={(event) => handleFormInputChange(event)}
              />
            </Form.Group>

            {/* Email */}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                value={formInput.email}
                onChange={(event) => handleFormInputChange(event)}
              />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                name="password"
                value={formInput.password}
                onChange={(event) => handleFormInputChange(event)}
              />
            </Form.Group>

            {/* Sign up button */}
            <StyledButton $primary type="submit" size="lg" block>
              Sign up
            </StyledButton>
          </Form>
        </StyledCard>
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
