import React, { useState, useEffect } from "react";
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
    personalDeduction: 0,
    otherDeduction: 0,
    personalDeductionsList: [],
    otherDeductionsList: [],
    balanceOwed: 0,
  };

  const [receipt, setReceipt] = useState(defaultReceiptState);

  useEffect(() => {
    function calculateBalanceOwed() {
      const personalDeductionsSum = receipt.personalDeductionsList.reduce(
        (a, b) => a * 1 + b * 1,
        0
      );
      const otherDeductionsSum = receipt.otherDeductionsList.reduce(
        (a, b) => a * 1 + b * 1,
        0
      );
      // console.log("personalDeductionsSum: " + personalDeductionsSum);
      // console.log("otherDeductionsSum: " + otherDeductionsSum);
      const deductionSumToInclude =
        receipt.buyer === 1 ? otherDeductionsSum : personalDeductionsSum;
      // console.log("deductionSumToInclude: " + deductionSumToInclude);
      const sharedCost =
        receipt.total - personalDeductionsSum - otherDeductionsSum;
      // console.log("sharedCost: " + sharedCost);
      const splitReceiptCost = sharedCost / 2;
      // console.log("splitReceiptCost: " + splitReceiptCost);
      const calculatedBalanceOwed = (
        splitReceiptCost + deductionSumToInclude
      ).toFixed(2);
      // console.log("calculatedBalanceOwed: " + calculatedBalanceOwed);

      setReceipt((prevValue) => {
        return { ...prevValue, balanceOwed: calculatedBalanceOwed };
      });
    }

    calculateBalanceOwed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    receipt.otherDeductionsList,
    receipt.total,
    receipt.personalDeductionsList,
  ]);

  function handleInputChange(event) {
    const { name, value, type } = event.target;

    setReceipt((prevValue) => {
      if (type === "number") {
        let formattedFloat =
          value.indexOf(".") >= 0
            ? value.substr(0, value.indexOf(".")) +
              value.substr(value.indexOf("."), 3)
            : value;

        return {
          ...prevValue,
          [name]: formattedFloat < 0 ? formattedFloat * -1 : formattedFloat,
        };
      } else {
        return { ...prevValue, [name]: value };
      }
    });
  }

  function handleBuyerButtonChange(event) {
    setReceipt((prevValue) => {
      return { ...prevValue, buyer: event };
    });
  }

  function onDeductionAdd(event) {
    const { name, value } = event.target;

    setReceipt((prevValue) => {
      const deductionList = prevValue[[name]];
      const floatValue = parseFloat(value).toFixed(2);

      return {
        ...prevValue,
        [name]: [...deductionList, floatValue],
      };
    });
  }

  function resetPersonalDeduction() {
    setReceipt((prevValue) => {
      return { ...prevValue, personalDeduction: 0 };
    });
  }

  function resetOtherDeduction() {
    setReceipt((prevValue) => {
      return { ...prevValue, otherDeduction: 0 };
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
          required
        />
      </Form.Group>

      {/* Store Name */}
      <Form.Group>
        <Form.Label>Store Name</Form.Label>
        <Form.Control
          name="storeName"
          onChange={handleInputChange}
          value={receipt.storeName}
          required
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
            value={receipt.total || ""}
            type="number"
            min="0.01"
            step="0.01"
            required
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
            name="personalDeduction"
            onChange={handleInputChange}
            value={receipt.personalDeduction || ""}
            type="number"
            min="0"
            step="0.01"
          />
          <InputGroup.Append>
            <StyledButton
              name="personalDeductionsList"
              value={receipt.personalDeduction}
              variant="outline-dark"
              onClick={(event) => {
                onDeductionAdd(event);
                resetPersonalDeduction();
              }}
            >
              Add
            </StyledButton>
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
            name="otherDeduction"
            onChange={handleInputChange}
            value={receipt.otherDeduction || ""}
            type="number"
            min="0"
            step="0.01"
          />
          <InputGroup.Append>
            <StyledButton
              name="otherDeductionsList"
              value={receipt.otherDeduction}
              variant="outline-dark"
              onClick={(event) => {
                onDeductionAdd(event);
                resetOtherDeduction();
              }}
            >
              Add
            </StyledButton>
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
