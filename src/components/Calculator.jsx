import React, { useState } from "react";
import { StyledButton } from "../components/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function Calculator(props) {
  const defaultReceiptState = {
    id: 0,
    purchaseDate: "",
    storeName: "",
    total: 0,
    buyer: 1,
    personalDeductions: 0,
    otherDeductions: 0,
  };

  const [receipt, setReceipt] = useState(defaultReceiptState);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setReceipt((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleBuyerButtonChange(event) {
    setReceipt((prevValue) => {
      return { ...prevValue, buyer: event };
    });
  }

  return (
    <Form
      onSubmit={(event) => {
        props.onAdd(receipt);
        event.preventDefault();
        setReceipt(defaultReceiptState);
      }}
    >
      {/* Date of Purchase */}
      <Form.Group>
        <Form.Label>Date of Purchase</Form.Label>
        <Form.Control
          name="purchaseDate"
          onChange={handleInputChange}
          value={receipt.purchaseDate}
          type="date"
        />
      </Form.Group>

      {/* Store Name */}
      <Form.Group>
        <Form.Label>Store Name</Form.Label>
        <Form.Control
          name="storeName"
          onChange={handleInputChange}
          value={receipt.storeName}
        />
      </Form.Group>

      {/* Receipt Total */}
      <Form.Group>
        <Form.Label>Receipt Total</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>$</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            name="total"
            onChange={handleInputChange}
            value={receipt.total}
            type="number"
          />
        </InputGroup>
      </Form.Group>

      {/* Buyer */}
      <Form.Group>
        <ButtonToolbar className="justify-content-between">
          <Form.Label>Who Paid?</Form.Label>
          <ToggleButtonGroup
            type="radio"
            name="buyer"
            defaultValue={receipt.buyer}
            value={receipt.buyer}
            onChange={handleBuyerButtonChange}
          >
            <ToggleButton value={1} variant="outline-dark">
              Me
            </ToggleButton>
            <ToggleButton value={2} variant="outline-dark">
              Other Person
            </ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
      </Form.Group>

      {/* Personal Deductions */}
      <Form.Group>
        <Form.Label>Personal Deductions</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>$</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            name="personalDeductions"
            onChange={handleInputChange}
            value={receipt.personalDeductions}
            type="number"
          />
          <InputGroup.Append>
            <StyledButton variant="outline-dark">Add</StyledButton>
          </InputGroup.Append>
        </InputGroup>
        <Form.Text className="text-muted">
          Deduct any personal item costs from the shared receipt.
        </Form.Text>
      </Form.Group>

      {/* Other Person's Deductions */}
      <Form.Group>
        <Form.Label>Other Person's Deductions</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>$</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            name="otherDeductions"
            onChange={handleInputChange}
            value={receipt.otherDeductions}
            type="number"
          />
          <InputGroup.Append>
            <StyledButton variant="outline-dark">Add</StyledButton>
          </InputGroup.Append>
        </InputGroup>
        <Form.Text className="text-muted">
          Deduct other person's personal item costs.
        </Form.Text>
      </Form.Group>

      {/* Submit Button */}
      <StyledButton $primary type="submit" size="lg" block>
        Submit
      </StyledButton>
    </Form>
  );
}

export default Calculator;
