import React, { useState, useEffect, useContext } from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import { FormTextField } from "../components/Form";
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
import { useDocumentTitle } from "../hooks";

const defaultFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Auth(props) {
  const { setUserObject, getAuthenticatedUserObject } = useContext(UserContext);

  const history = useHistory();

  const [isSignUp, setIsSignUp] = useState(props.isSignUp);
  const [errorMessage, setErrorMessage] = useState();

  // Formik validation schema
  const validationSchema = isSignUp
    ? yup.object({
        firstName: yup
          .string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        lastName: yup
          .string()
          .max(20, "Must be 20 characters or less")
          .required("Required"),
        email: yup.string().email("Invalid email address").required("Required"),
        password: yup.string().required("Required"),
        confirmPassword: yup
          .string()
          .test("passwords-match", "Passwords must match", function (value) {
            return this.parent.password === value;
          }),
      })
    : yup.object({
        email: yup.string().email("Invalid email address").required("Required"),
        password: yup.string().required("Required"),
      });

  // Update authentication page based on props.isSignUp change.
  useEffect(() => {
    setIsSignUp(props.isSignUp);
  }, [props.isSignUp]);

  // Sets the document title
  useDocumentTitle(`Receipt Hero - ${isSignUp ? "Sign Up" : "Log In"}`);

  function handleSubmit(formData) {
    if (isSignUp) {
      signUp(formData);
    } else {
      login(formData);
    }
  }

  async function signUp(formData) {
    try {
      const res = await api.signUp(formData);
      setUserObject(res.data.userObject);
      getAuthenticatedUserObject();
      history.push("/");
    } catch (err) {
      if (err.response?.data?.message)
        setErrorMessage(err.response.data.message);
    }
  }

  async function login(formData) {
    try {
      const res = await api.login(formData);
      setUserObject(res.data.userObject);
      getAuthenticatedUserObject();
      history.push("/");
    } catch (err) {
      if (err.response?.data?.message)
        setErrorMessage(err.response.data.message);
    }
  }

  function googleLogin() {
    window.open(`${process.env.REACT_APP_BASE_URL}/auth/google`, "_self");
  }

  function facebookLogin() {
    window.open(`${process.env.REACT_APP_BASE_URL}/auth/facebook`, "_self");
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
          <Formik
            validationSchema={validationSchema}
            initialValues={defaultFormData}
            onSubmit={(values, { setSubmitting }) => {
              handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form noValidate onSubmit={handleSubmit}>
                {/* Name */}
                {isSignUp && (
                  <Form.Row>
                    <FormTextField
                      as={Col}
                      name="firstName"
                      label="First Name"
                    />

                    <FormTextField as={Col} name="lastName" label="Last Name" />
                  </Form.Row>
                )}

                {/* Email */}
                <FormTextField name="email" label="Email" type="email" />

                {/* Password */}
                <FormTextField
                  name="password"
                  label="Password"
                  type="password"
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
                <StyledButton
                  $primary
                  type="submit"
                  size="lg"
                  block
                  disabled={isSubmitting}
                  className="mt-4"
                >
                  {isSignUp ? "Sign up" : "Log in"}
                </StyledButton>
              </Form>
            )}
          </Formik>
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
