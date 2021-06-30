import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Input from "../../components/Input";

function ProfilePanel(props) {
  return (
    <>
      <Form.Row>
        <Col lg={5} md={6} sm={8}>
          <Input
            label="First Name"
            required
            name="firstName"
            value={props.userSettings.firstName}
            handleChange={props.handleChange}
          />
        </Col>
      </Form.Row>
      <Form.Row>
        <Col lg={5} md={6} sm={8}>
          <Input
            label="Last Name"
            required
            name="lastName"
            value={props.userSettings.lastName}
          />
        </Col>
      </Form.Row>
      <Form.Row>
        <Col lg={5} md={6} sm={8}>
          <Input
            label="Email"
            required
            name="email"
            value={props.userSettings.email}
            handleChange={props.handleChange}
          />
        </Col>
      </Form.Row>
    </>
  );
}

export default ProfilePanel;
