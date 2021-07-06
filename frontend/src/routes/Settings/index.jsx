import React, { useState, useContext, useEffect, useCallback } from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { StyledButton } from "../../components/Button";
import { StyledCard } from "../../components/Card";
import { UserContext } from "../../UserContext";
import { ThemeContext } from "styled-components";
import ProfilePane from "./ProfilePane";
import PasswordPane from "./PasswordPane";
import { IoWarningOutline } from "react-icons/io5";
import { FcCheckmark } from "react-icons/fc";
import { StyledModal } from "../../components/Modal";
import * as api from "../../api";

function Settings() {
  const { userObject, getAuthenticatedUserObject } = useContext(UserContext);
  const themeContext = useContext(ThemeContext);

  const defaultUserSettings = {
    firstName: "",
    lastName: "",
    email: "",
    profileImage: null,
  };

  const defaultPassword = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [userSettings, setUserSettings] = useState(defaultUserSettings);
  const [password, setPassword] = useState(defaultPassword);
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  // Sets userSettings with userObject values.
  const initializeUserSettings = useCallback(() => {
    setUserSettings((prevValue) => {
      return {
        ...prevValue,
        firstName: userObject.firstName,
        lastName: userObject.lastName,
        email: userObject.email,
        profileImage: userObject.profileImage,
      };
    });
  }, [userObject]);

  useEffect(() => {
    initializeUserSettings();
  }, [userObject, initializeUserSettings]);

  // Saves userSettings to backend.
  async function handleSubmitUserSettings() {
    setLoading(true);
    try {
      await api.updateUser({ ...userObject, ...userSettings });
      getAuthenticatedUserObject();
      setShowModal(true);
    } catch (err) {
      if (err.response?.data?.message)
        setErrorMessage(err.response.data.message);
    }
    setLoading(false);
  }

  // Saves new password to backend.
  async function handleSubmitPassword() {
    setLoading(true);
    try {
      await api.updatePassword(password);
      setShowModal(true);
    } catch (err) {
      if (err.response?.data?.message)
        setErrorMessage(err.response.data.message);
    }
    setLoading(false);
  }

  // Called when input textfield value changes.
  function handleChange(event) {
    const { name, value } = event.target;

    setUserSettings((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  // Called when profile image changes
  function handleChangeImage(imageUrl) {
    setUserSettings((prevValue) => {
      return { ...prevValue, profileImage: imageUrl };
    });
  }

  // Called when password input value changes.
  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPassword((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  // Called when a tab is pressed.
  function handleSelect() {
    setErrorMessage(null);
    initializeUserSettings(); // revert any unsaved changes.
    setPassword(defaultPassword);
  }

  // Closes the "Successfully saved" modal.
  function handleCloseModal() {
    setErrorMessage(null);
    setPassword(defaultPassword);
    setShowModal(false);
  }

  function AlertMessage() {
    return errorMessage ? (
      <Alert
        variant="danger"
        onClose={() => setErrorMessage(null)}
        className="d-flex align-items-center"
        dismissible
      >
        <IoWarningOutline className="mr-2" />
        {errorMessage}
      </Alert>
    ) : null;
  }

  return (
    <>
      <StyledCard $main>
        <Tab.Container defaultActiveKey="Profile">
          <Row>
            <Col
              sm={3}
              style={{ borderRight: "1px solid" + themeContext.borderColor }}
            >
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="Profile" onSelect={handleSelect}>
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Password" onSelect={handleSelect}>
                    Password
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9} className="pl-4">
              <Tab.Content>
                <Tab.Pane eventKey="Profile">
                  <h3 className="mb-2">Edit Profile</h3>
                  <hr />
                  <AlertMessage />
                  <ProfilePane
                    userObject={userObject}
                    userSettings={userSettings}
                    handleChange={handleChange}
                    handleChangeImage={handleChangeImage}
                    setErrorMessage={setErrorMessage}
                    isLoading={isLoading}
                    handleSubmitUserSettings={handleSubmitUserSettings}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="Password">
                  <h3 className="mb-2">Change Password</h3>
                  <hr />
                  <AlertMessage />
                  <PasswordPane
                    userObject={userObject}
                    userSettings={userSettings}
                    setErrorMessage={setErrorMessage}
                    password={password}
                    handlePasswordChange={handlePasswordChange}
                    isLoading={isLoading}
                    handleSubmitPassword={handleSubmitPassword}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </StyledCard>

      {/* Modal - Successful update */}
      <StyledModal show={showModal} onHide={handleCloseModal} size="sm">
        <StyledModal.Body>
          <div className="text-center">
            <FcCheckmark className="mt-3" size={56} />

            <h5 className="mt-4 mb-0">Your settings have been saved.</h5>
          </div>
        </StyledModal.Body>
        <StyledModal.Footer>
          <StyledButton variant="secondary" onClick={handleCloseModal}>
            OK
          </StyledButton>
        </StyledModal.Footer>
      </StyledModal>
    </>
  );
}

export default Settings;
