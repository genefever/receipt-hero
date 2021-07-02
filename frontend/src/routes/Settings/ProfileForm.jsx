import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Input from "../../components/Input";
import {
  createAvatarComponent,
  SrcSource,
  GoogleSource,
  FacebookSource,
} from "react-avatar";

const Avatar = createAvatarComponent({
  sources: [SrcSource, GoogleSource, FacebookSource],
});

function ProfileForm(props) {
  return (
    <>
      <Form.Group>
        <Avatar
          size={150}
          src={"http://www.fillmurray.com/400/400"}
          googleId={props.userObject.googleId}
          facebookId={props.userObject.facebookId}
          name={`${props.userObject.firstName} ${props.userObject.lastName}`}
          round={true}
          className="my-2"
        />

        <Form.File className="mt-3" />
      </Form.Group>
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
            handleChange={props.handleChange}
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

export default ProfileForm;
