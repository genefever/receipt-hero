import React, { useState, useContext, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { StyledButton } from "../../components/Button";
import { StyledCard } from "../../components/Card";
import { UserContext } from "../../UserContext";
import ProfilePanel from "./ProfilePanel";
import { IoWarningOutline } from "react-icons/io5";
import { FcCheckmark } from "react-icons/fc";
import { StyledModal } from "../../components/Modal";
import * as api from "../../api";

function Settings() {
  const [paneName, setPaneName] = useState("Profile");
  const defaultUserSettings = {
    firstName: "",
    lastName: "",
    email: "",
  };
  const [userSettings, setUserSettings] = useState(defaultUserSettings);
  const { userObject, getAuthenticatedUserObject } = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  // Sets userSettings with userObject values.
  useEffect(() => {
    setUserSettings((prevValue) => {
      return {
        ...prevValue,
        firstName: userObject.firstName,
        lastName: userObject.lastName,
        email: userObject.email,
      };
    });
  }, [userObject]);

  // Save userSettings to backend.
  async function handleSubmit() {
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

  // Called when input textfield value changes.
  function handleChange(event) {
    const { name, value } = event.target;

    setUserSettings((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  // Called when a tab is pressed.
  function handleSelect(eventKey) {
    setPaneName(eventKey);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      <StyledCard $main>
        <h4>Edit {paneName}</h4>
        <hr />
        <Tab.Container defaultActiveKey="Profile">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link
                    eventKey="Profile"
                    onSelect={(eventKey) => {
                      handleSelect(eventKey);
                    }}
                  >
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="Settings"
                    onSelect={(eventKey) => {
                      handleSelect(eventKey);
                    }}
                  >
                    Settings
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              {/* Alert Error Message */}
              {errorMessage && (
                <Col lg={5} md={6} sm={8} className="px-0">
                  <Alert
                    variant="danger"
                    onClose={() => setErrorMessage(null)}
                    className="d-flex align-items-center"
                    dismissible
                  >
                    <IoWarningOutline className="mr-2" />
                    {errorMessage}
                  </Alert>
                </Col>
              )}
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
                <Tab.Content>
                  <Tab.Pane eventKey="Profile">
                    <ProfilePanel
                      userSettings={userSettings}
                      handleChange={handleChange}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="Settings">
                    <p>Settings</p>
                  </Tab.Pane>
                </Tab.Content>
                {/* Save Button */}
                <StyledButton
                  $primary
                  type="submit"
                  className="mt-2"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Save"}
                </StyledButton>
              </Form>
            </Col>
          </Row>
        </Tab.Container>
      </StyledCard>

      {/* Modal - Successful update */}
      <StyledModal show={showModal} onHide={handleCloseModal} size="sm">
        <StyledModal.Body>
          <div className="text-center">
            <FcCheckmark className="mt-3" size={56} />
            <h4 className="mt-3">Success!</h4>
            <p className="mt-3 mb-0">Your settings have been saved.</p>
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
