import React, { useState, useContext } from "react";
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
import { useDocumentTitle } from "../../hooks";

function Settings() {
  const { userObject, getAuthenticatedUserObject } = useContext(UserContext);
  const themeContext = useContext(ThemeContext);

  const [showModal, setShowModal] = useState(false); // "Successfully Saved" modal
  const [errorMessage, setErrorMessage] = useState();
  const [documentTitle, setDocumentTitle] = useState(
    "Receipt Hero - Edit Profile"
  );

  // Sets the document title
  useDocumentTitle(documentTitle);

  // Saves userSettings to backend.
  async function handleSubmitUserSettings(userSettings) {
    try {
      await api.updateUser({ ...userObject, ...userSettings });
      getAuthenticatedUserObject();
      setShowModal(true);
    } catch (err) {
      if (err.response?.data?.message)
        setErrorMessage(err.response.data.message);
    }
  }

  // Saves new password to backend.
  async function handleSubmitPassword(password) {
    try {
      await api.updatePassword(password);
      setShowModal(true);
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      }
    }
  }

  // Called when a tab is pressed.
  function handleSelect(eventKey) {
    setDocumentTitle(`Receipt Hero - ${eventKey}`);
    setErrorMessage(null);
  }

  // Closes the "Successfully saved" modal.
  function handleCloseModal() {
    setErrorMessage(null);
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
        <Tab.Container defaultActiveKey="Edit Profile">
          <Row>
            <Col
              sm={3}
              style={{ borderRight: "1px solid" + themeContext.borderColor }}
            >
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="Edit Profile" onSelect={handleSelect}>
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Change Password" onSelect={handleSelect}>
                    Password
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9} className="pl-4">
              <Tab.Content>
                <Tab.Pane eventKey="Edit Profile">
                  <h3 className="mb-2">Edit Profile</h3>
                  <hr />
                  <AlertMessage />
                  <ProfilePane
                    userObject={userObject}
                    setErrorMessage={setErrorMessage}
                    handleSubmitUserSettings={handleSubmitUserSettings}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="Change Password">
                  <h3 className="mb-2">Change Password</h3>
                  <hr />
                  <AlertMessage />
                  <PasswordPane handleSubmitPassword={handleSubmitPassword} />
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
