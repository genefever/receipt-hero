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

function Login() {
  const [formInput, setFormInputChange] = useState({
    username: "",
    password: "",
  });

  function handleFormInputChange(event) {
    const { name, value } = event.target;
    setFormInputChange((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function login() {
    axios({
      method: "post",
      data: {
        username: formInput.username,
        password: formInput.password,
      },
      withCredentials: true, // Make axios send cookies in its requests
      url: "http://localhost:4000/login",
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
          <i className="fab fa-google"></i> Log in with Google
        </StyledButton>
        <StyledButton $facebook size="lg" block>
          <i className="fab fa-facebook-square"></i> Log in with Facebook
        </StyledButton>

        <Separator className="my-3">or</Separator>

        <StyledCard>
          <Form
            onSubmit={(event) => {
              login();
              event.preventDefault();
            }}
          >
            {/* Username */}
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                required
                type="text"
                name="username"
                value={formInput.username}
                onChange={(event) => handleFormInputChange(event)}
              />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>

              <Link className="float-right" to="/signup">
                Forgot password?
              </Link>

              <Form.Control
                required
                type="password"
                name="password"
                value={formInput.password}
                onChange={(event) => handleFormInputChange(event)}
              />
            </Form.Group>

            {/* Log in button */}
            <StyledButton $primary type="submit" size="lg" block>
              Log in
            </StyledButton>
          </Form>
        </StyledCard>
      </Card.Body>

      <div className="text-center mt-2">
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </SignInContainer>
  );
}

export default Login;