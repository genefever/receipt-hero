import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Input from "../components/Input";
import { Separator } from "../components/Separator";
import { SignInContainer } from "../components/Container";
import { StyledCard } from "../components/Card";
import { StyledButton } from "../components/Button";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import axios from "axios";

function Auth(props) {
  const [isSignup, setIsSignup] = useState(props.isSignup);

  const [formInput, setFormInputChange] = useState({
    username: "",
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
        username: formInput.username,
        email: formInput.email,
        password: formInput.password,
      },
      withCredentials: true, // Make axios send cookies in its requests
      url: "http://localhost:4000/signup",
    }).then((res) => console.log(res));
  }

  // function login() {
  //   axios({
  //     method: "post",
  //     data: {
  //       username: formInput.username,
  //       password: formInput.password,
  //     },
  //     withCredentials: true, // Make axios send cookies in its requests
  //     url: "http://localhost:4000/login",
  //   }).then((res) => console.log(res));
  // }

  function switchMode() {
    setIsSignup((prevIsSignup) => !prevIsSignup);
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
          {isSignup ? " Sign up " : " Log in "}
          with Google
        </StyledButton>
        <StyledButton $facebook size="lg" block>
          <i className="fab fa-facebook-square"></i>
          {isSignup ? " Sign up " : " Log in "} with Facebook
        </StyledButton>

        <Separator className="my-3">or</Separator>

        <StyledCard>
          <form
            onSubmit={(event) => {
              signUp();
              event.preventDefault();
            }}
          >
            {/* Username */}
            <Input
              name="username"
              value={formInput.username}
              label="Username"
              handleChange={(event) => handleFormInputChange(event)}
              controlId={"formBasicUsername"}
            />

            {/* Email */}
            {isSignup && (
              <Input
                name="email"
                value={formInput.email}
                label="Email"
                type="email"
                handleChange={(event) => handleFormInputChange(event)}
                controlId={"formBasicEmail"}
              />
            )}

            {/* Password */}
            <Input
              name="password"
              value={formInput.password}
              label="Password"
              type="password"
              handleChange={(event) => handleFormInputChange(event)}
              controlId={"formBasicPassword"}
            />

            {!isSignup && (
              <div className="mb-4">
                <Link to="/signup">Forgot password?</Link>
              </div>
            )}

            {/* Sign up button */}
            <StyledButton $primary type="submit" size="lg" block>
              {isSignup ? "Sign up" : "Log in"}
            </StyledButton>
          </form>
        </StyledCard>
      </Card.Body>

      <div className="d-flex align-items-center justify-content-center">
        {isSignup ? "Already" : "Don't"} have an account?
        <StyledButton className="py-0" variant="link" onClick={switchMode}>
          {isSignup ? "Log in" : "Sign up"}
        </StyledButton>
      </div>
    </SignInContainer>
  );
}

export default Auth;
