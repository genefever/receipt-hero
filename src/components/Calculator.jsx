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
          <InputGroup.Append>
            <StyledButton variant="outline-secondary">Add</StyledButton>
          </InputGroup.Append>
        </InputGroup>

        <Form.Text className="text-muted">
          Deduct any personal item costs from the shared receipt.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Other Person's Deductions</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>$</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control type="number" />
          <InputGroup.Append>
            <StyledButton variant="outline-secondary">Add</StyledButton>
          </InputGroup.Append>
        </InputGroup>
        <Form.Text className="text-muted">
          Deduct other person's personal item costs.
        </Form.Text>
      </Form.Group>

      <StyledButton $primary size="lg" block>
        Submit
      </StyledButton>
    </Form>
  );
}

export default Calculator;
