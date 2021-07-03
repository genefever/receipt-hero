import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Input from "../../components/Input";

function PasswordPane() {
  return (
    <>
      <Row>
        <Col md={7}>
          <Input
            label="Current Password"
            required
            name="oldPassword"
            type="password"
            // value={props.userSettings.lastName}
            // handleChange={props.handleChange}
          />

          <Input
            label="New Password"
            required
            name="newPassword"
            type="password"
            // value={props.userSettings.lastName}
            // handleChange={props.handleChange}
          />

          <Input
            label="Confirm New Password"
            required
            name="confirmNewPassword"
            type="password"
            // value={props.userSettings.lastName}
            // handleChange={props.handleChange}
          />
        </Col>
        <Col md={5} />
      </Row>
    </>
  );
}
export default PasswordPane;
