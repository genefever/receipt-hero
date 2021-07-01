import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import logo from "../assets/logo.svg";
import Input from "../components/Input";
import { IoWarningOutline } from "react-icons/io5";
import { SignInContainer } from "../components/Container";
import { StyledButton } from "../components/Button";
import { StyledCard } from "../components/Card";
import { Link, useParams, useHistory } from "react-router-dom";
import * as api from "../api";

function ForgotPassword(props) {
  const [isResetPassword, setIsResetPassword] = useState(props.isResetPassword);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setLoading] = useState(false);
  const { token } = useParams();
  const history = useHistory();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Update authentication page based on props.isSignUp change.
  useEffect(() => {
    setIsResetPassword(props.isResetPassword);
  }, [props.isResetPassword]);

  // Check URL to see if it contains "done". Set isDone based on URL.
  useEffect(() => {
    if (window.location.href.indexOf("done") !== -1) {
      setIsDone(true);
    } else {
      setIsDone(false);
    }
  }, [history.location]);

  function handleFormDataChange(event) {
    const { name, value } = event.target;
    setFormData((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleSubmit() {
    setLoading(true);
    if (isResetPassword) {
      resetPassword();
    } else {
      forgotPassword();
    }
    setLoading(false);
  }

  async function resetPassword() {
    try {
      await api.resetPassword(token, formData);
      history.push(`/reset/${token}/done`);
    } catch (err) {
      if (err.response?.data?.message)
        setErrorMessage(err.response.data.message);
    }
  }

  async function forgotPassword() {
    try {
      await api.forgotPassword(formData);
      history.push("/forgot/done");
    } catch (err) {
      if (err.response?.data?.message)
        setErrorMessage(err.response.data.message);
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

      {/* Alert Error Message */}
      {errorMessage && (
        <Alert
          variant="danger"
          onClose={() => setErrorMessage(null)}
          className="d-flex align-items-center"
        >
          <IoWarningOutline className="mr-2" />
          {errorMessage}
        </Alert>
      )}
      <StyledCard>
        {isDone ? (
          <h3>Password Reset {isResetPassword ? "Complete" : "Sent"}</h3>
        ) : (
          <h3>{isResetPassword ? "Reset" : "Forgot"} Password</h3>
        )}
        <hr />
        {!isDone && !isResetPassword && (
          <p className="small">
            Please enter the email address associated with your account.
          </p>
        )}

        {isDone ? (
          isResetPassword ? (
            <p>Your password has been set.</p>
          ) : (
            <p>
              If your submission matches our records, a link will be sent to the
              provided email address with information on how to reset your
              password. The link will only be valid for 15 minutes.
            </p>
          )
        ) : (
          <Form
            onSubmit={
              !isLoading
                ? (e) => {
                    e.preventDefault();
                    handleSubmit();
                  }
                : null
            }
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
            <StyledButton
              $primary
              type="submit"
              size="lg"
              className="mt-4"
              block
              disabled={isLoading}
            >
              {isLoading
                ? "Loading..."
                : isResetPassword
                ? "Update password"
                : "Email me a recovery link"}
            </StyledButton>
          </Form>
        )}

        {!isLoading && (
          <Link to="/login">
            <StyledButton
              variant={isDone ? "success" : "link"}
              size="lg"
              block
              className={isDone ? "mt-4" : "pb-0 mt-3"}
            >
              Back to login
            </StyledButton>
          </Link>
        )}
      </StyledCard>
    </SignInContainer>
  );
}

export default ForgotPassword;
