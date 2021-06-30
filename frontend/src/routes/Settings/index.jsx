import React, { useState, useContext, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { StyledButton } from "../../components/Button";
import { StyledCard } from "../../components/Card";
import { UserContext } from "../../UserContext";
import ProfilePanel from "./ProfilePanel";

function Settings() {
  const [paneName, setPaneName] = useState("Profile");
  const defaultUserSettings = {
    firstName: "",
    lastName: "",
    email: "",
  };
  const [userSettings, setUserSettings] = useState(defaultUserSettings);
  const { userObject } = useContext(UserContext);

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

  // Save userSettings to userObject.
  function handleSubmit() {}

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
              <Form onSubmit={handleSubmit}>
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
                <StyledButton $primary type="submit" className="mt-2" size="lg">
                  Save
                </StyledButton>
              </Form>
            </Col>
          </Row>
        </Tab.Container>
      </StyledCard>
    </>
  );
}

export default Settings;
