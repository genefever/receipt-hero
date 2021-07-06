import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Input from "../../components/Input";
import { StyledButton } from "../../components/Button";

function PasswordPane(props) {
  return (
    <>
      <Form
        onSubmit={
          !props.isLoading
            ? (e) => {
                e.preventDefault();
                props.handleSubmitPassword();
              }
            : null
        }
      >
        <Row>
          <Col md={7}>
            <Input
              label="Current Password"
              required
              name="currentPassword"
              type="password"
              value={props.password.currentPassword}
              handleChange={(e) => props.handlePasswordChange(e)}
            />

            <Input
              label="New Password"
              required
              name="newPassword"
              type="password"
              value={props.password.newPassword}
              handleChange={(e) => props.handlePasswordChange(e)}
            />

            <Input
              label="Confirm New Password"
              required
              name="confirmNewPassword"
              type="password"
              value={props.password.confirmNewPassword}
              handleChange={(e) => props.handlePasswordChange(e)}
            />
          </Col>
          <Col md={5} />
        </Row>
        {/* Save Button */}
        <StyledButton
          $primary
          type="submit"
          className="mt-2"
          size="lg"
          disabled={props.isLoading}
        >
          {props.isLoading ? "Loading..." : "Save"}
        </StyledButton>
      </Form>
    </>
  );
}
export default PasswordPane;
