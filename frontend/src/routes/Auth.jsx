import React, { useState, useEffect, useContext } from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Input from "../components/Input";
import { Separator } from "../components/Separator";
import { SignInContainer } from "../components/Container";
import { StyledCard } from "../components/Card";
import { StyledButton } from "../components/Button";
import logo from "../assets/logo.svg";
import { IoWarningOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import * as api from "../api";
import { useHistory } from "react-router-dom";
import { UserContext } from "../UserContext";

function Auth(props) {
  const { setUserObject } = useContext(UserContext);

  const history = useHistory();
  const [isSignUp, setIsSignUp] = useState(props.isSignUp);
  const [errorMessage, setErrorMessage] = useState();

  // Update authentication page based on props.isSignUp change.
  useEffect(() => {
    setIsSignUp(props.isSignUp);
  }, [props.isSignUp]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    googleId: "",
    facebookId: "",
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
      const res = await api.signUp(formData);
      setUserObject(res.data.userObject);
      history.push("/");
    } catch (err) {
      if (err.response?.data?.message)
        setErrorMessage(err.response.data.message);
    }
  }

  async function login() {
    try {
      const res = await api.login(formData);
      setUserObject(res.data.userObject);
      history.push("/");
    } catch (err) {
      if (err.response?.data?.message)
        setErrorMessage(err.response.data.message);
    }
  }

  function googleLogin() {
    window.open("http://localhost:4000/auth/google", "_self");
  }

  function facebookLogin() {
    window.open("http://localhost:4000/auth/facebook", "_self");
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

        <StyledButton
          $google
          size="lg"
          block
          className="mb-3"
          onClick={googleLogin}
        >
          <i className="fab fa-google"></i>{" "}
          {isSignUp ? " Sign up " : " Log in "}
          with Google
        </StyledButton>
        <StyledButton $facebook size="lg" block onClick={facebookLogin}>
          <i className="fab fa-facebook-square"></i>
          {isSignUp ? " Sign up " : " Log in "} with Facebook
        </StyledButton>

        <Separator className="my-3">or</Separator>

        {/* Alert Error Message */}
        {errorMessage && (
          <Alert
            variant="danger"
            onClose={() => setErrorMessage(null)}
            dismissible
            className="d-flex align-items-center"
          >
            <IoWarningOutline className="mr-2" />
            {errorMessage}
          </Alert>
        )}

        <StyledCard>
          <Form onSubmit={(event) => handleSubmit(event)}>
            {/* Name */}
            {isSignUp && (
              <Form.Row>
                <Input
                  as={Col}
                  name="firstName"
                  value={formData.firstName}
                  label="First Name"
                  handleChange={(event) => handleFormDataChange(event)}
                  controlId={"formBasicFirstName"}
                />

                <Input
                  as={Col}
                  name="lastName"
                  value={formData.lastName}
                  label="Last Name"
                  handleChange={(event) => handleFormDataChange(event)}
                  controlId={"formBasicLastName"}
                />
              </Form.Row>
            )}

            {/* Email */}
            <Input
              name="email"
              value={formData.email}
              label="Email"
              type="email"
              handleChange={(event) => handleFormDataChange(event)}
              controlId={"formBasicEmail"}
            />

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
                <Link
                  to={{
                    pathname: "/forgot",
                    state: { isResetPassword: false },
                  }}
                >
                  Forgot password?
                </Link>
              </div>
            )}
            {/* Submit button */}
            <StyledButton $primary type="submit" size="lg" block>
              {isSignUp ? "Sign up" : "Log in"}
            </StyledButton>
          </Form>
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
