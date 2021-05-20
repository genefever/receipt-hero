import React from "react";
import { StyledButton } from "../components/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function Calculator() {
  return (
    <Form>
      <Form.Group>
        <Form.Label>Date of Purchase</Form.Label>
        <Form.Control type="date" />
      </Form.Group>

      <Form.Group>
        <Form.Label>Store Name</Form.Label>
        <Form.Control />
      </Form.Group>

      <Form.Group>
        <Form.Label>Receipt Total</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>$</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" />
        </InputGroup>
      </Form.Group>

      <Form.Group>
        <ButtonToolbar className="justify-content-between">
          <Form.Label>Who Paid?</Form.Label>
          <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
            <ToggleButton value={1}>Me</ToggleButton>
            <ToggleButton value={2}>Other Person</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
      </Form.Group>

      <Form.Group>
        <Form.Label>Personal Deductions</Form.Label>

        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>$</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" />
          <StyledButton variant="outline-dark">Add</StyledButton>
        </InputGroup>

        <Form.Text className="text-muted">
          Enter prices of items you bought for yourself.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Other Person's Deductions</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>$</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" />
          <StyledButton variant="outline-dark">Add</StyledButton>
        </InputGroup>
        <Form.Text className="text-muted">
          Enter prices of items bought for the other person.
        </Form.Text>
      </Form.Group>

      <StyledButton $primary size="lg" block>
        Submit
      </StyledButton>
    </Form>
  );
}

export default Calculator;
