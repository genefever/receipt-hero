import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Input from "../components/Input";
import { Separator } from "../components/Separator";
import { SignInContainer } from "../components/Container";
import { StyledCard } from "../components/Card";
import { StyledButton } from "../components/Button";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import * as api from "../api";

function Auth(props) {
  const [isSignUp, setIsSignUp] = useState(props.isSignUp);
  // Update authentication page based on props.isSignUp change.
  useEffect(() => {
    setIsSignUp(props.isSignUp);
  }, [props.isSignUp]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleFormDataChange(event) {
    const { name, value } = event.target;
    setFormData((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isSignUp) {
      signUp();
    } else {
      login();
    }
  }

  async function signUp() {
    try {
      const { data } = await api.signUp(formData);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function login() {
    try {
      const { data } = await api.login(formData);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  function switchMode() {
    setIsSignUp((prevIsSignup) => !prevIsSignup);
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
          <i className="fab fa-google"></i>{" "}
          {isSignUp ? " Sign up " : " Log in "}
          with Google
        </StyledButton>
        <StyledButton $facebook size="lg" block>
          <i className="fab fa-facebook-square"></i>
          {isSignUp ? " Sign up " : " Log in "} with Facebook
        </StyledButton>

        <Separator className="my-3">or</Separator>

        <StyledCard>
          <form onSubmit={(event) => handleSubmit(event)}>
            {/* Username */}
            <Input
              name="username"
              value={formData.username}
              label="Username"
              handleChange={(event) => handleFormDataChange(event)}
              controlId={"formBasicUsername"}
            />

            {/* Email */}
            {isSignUp && (
              <Input
                name="email"
                value={formData.email}
                label="Email"
                type="email"
                handleChange={(event) => handleFormDataChange(event)}
                controlId={"formBasicEmail"}
              />
            )}

            {/* Password */}
            <Input
              name="password"
              value={formData.password}
              label="Password"
              type="password"
              handleChange={(event) => handleFormDataChange(event)}
              controlId={"formBasicPassword"}
            />

            {!isSignUp && (
              <div className="mb-4">
                <Link to="/signup">Forgot password?</Link>
              </div>
            )}

            {/* Submit button */}
            <StyledButton $primary type="submit" size="lg" block>
              {isSignUp ? "Sign up" : "Log in"}
            </StyledButton>
          </form>
        </StyledCard>
      </Card.Body>

      {/* Have an account message */}
      <div className="d-flex align-items-center justify-content-center">
        {isSignUp ? "Already" : "Don't"} have an account?
        <Link
          to={{
            pathname: isSignUp ? "/login" : "/signup",
            state: { isSignUp: !isSignUp },
          }}
        >
          <StyledButton className="py-0" variant="link" onClick={switchMode}>
            {isSignUp ? "Log in" : "Sign up"}
          </StyledButton>
        </Link>
      </div>
    </SignInContainer>
  );
}

export default Auth;
