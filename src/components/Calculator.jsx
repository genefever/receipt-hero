import React, { useState, useEffect } from "react";
import { StyledButton } from "../components/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Tooltip from "react-bootstrap/Tooltip";

function Calculator(props) {
  const defaultReceiptState = {
    id: 0,
    purchaseDate: "",
    storeName: "",
    total: 0,
    buyer: "Me",
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
          [name]: formattedFloat < 0 ? formattedFloat * -1 : formattedFloat * 1,
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
      <Form.Row>
        {/* Date of Purchase */}
        <Form.Group as={Col} lg="6">
          <Form.Label>Purchase Date</Form.Label>
          <Form.Control
            name="purchaseDate"
            onChange={handleInputChange}
            value={receipt.purchaseDate}
            type="date"
            required
            size="sm"
          />
        </Form.Group>

        {/* Store Name */}
        <Form.Group as={Col} lg="6">
          <Form.Label>Store Name</Form.Label>
          <Form.Control
            name="storeName"
            onChange={handleInputChange}
            value={receipt.storeName}
            required
            size="sm"
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        {/* Receipt Total */}
        <Form.Group as={Col} lg="6">
          <Form.Label>Receipt Total</Form.Label>
          <InputGroup size="sm">
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
              placeholder="0.00"
            />
          </InputGroup>
        </Form.Group>

        {/* Buyer */}
        <Form.Group as={Col} lg="6">
          <ButtonToolbar className="justify-content-between">
            <Form.Label>Who Paid?</Form.Label>
            <ToggleButtonGroup
              type="radio"
              name="buyer"
              defaultValue={receipt.buyer}
              value={receipt.buyer}
              onChange={handleBuyerButtonChange}
            >
              <ToggleButton value={"Me"} variant="outline-dark" size="sm">
                Me
              </ToggleButton>
              <ToggleButton value={"Other"} variant="outline-dark" size="sm">
                Other Person
              </ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        {/* Personal Deductions */}
        <Form.Group as={Col} lg="6">
          <Form.Label>Personal Deductions</Form.Label>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 150, hide: 150 }}
            overlay={
              <Tooltip>
                Deduct any personal item costs from the shared receipt.
              </Tooltip>
            }
          >
            <InputGroup size="sm">
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
                placeholder="0.00"
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
          </OverlayTrigger>
        </Form.Group>

        {/* Other Person's Deductions */}
        <Form.Group as={Col} lg="6">
          <Form.Label>Other Person's Deductions</Form.Label>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 150, hide: 150 }}
            overlay={
              <Tooltip>Deduct other person's personal item costs.</Tooltip>
            }
          >
            <InputGroup size="sm">
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
                placeholder="0.00"
                size="sm"
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
          </OverlayTrigger>
        </Form.Group>
      </Form.Row>

      {/* Submit Button */}
      <StyledButton $primary type="submit" size="sm" block>
        Submit
      </StyledButton>
    </Form>
  );
}

export default Calculator;
