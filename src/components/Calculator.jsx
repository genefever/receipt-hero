import React, { useState, useEffect } from "react";
import { StyledButton } from "../components/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Tooltip from "react-bootstrap/Tooltip";
import { Separator } from "./Separator";

function Calculator(props) {
  const defaultReceiptState = {
    id: 0,
    purchaseDate: "",
    storeName: "",
    total: 0,
    buyer: "Me",
    myDeduction: 0,
    theirDeduction: 0,
    myDeductionsList: [],
    theirDeductionsList: [],
    balanceOwed: 0,
  };

  const [receipt, setReceipt] = useState(defaultReceiptState);

  useEffect(() => {
    function calculateBalanceOwed() {
      const myDeductionsSum = receipt.myDeductionsList.reduce(
        (a, b) => a * 1 + b * 1,
        0
      );
      const theirDeductionsSum = receipt.theirDeductionsList.reduce(
        (a, b) => a * 1 + b * 1,
        0
      );
      // console.log("myDeductionsSum: " + myDeductionsSum);
      // console.log("theirDeductionsSum: " + theirDeductionsSum);
      const deductionSumToInclude =
        receipt.buyer === 1 ? theirDeductionsSum : myDeductionsSum;
      // console.log("deductionSumToInclude: " + deductionSumToInclude);
      const sharedCost = receipt.total - myDeductionsSum - theirDeductionsSum;
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
  }, [receipt.theirDeductionsList, receipt.total, receipt.myDeductionsList]);

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

  function resetMyDeduction() {
    setReceipt((prevValue) => {
      return { ...prevValue, myDeduction: 0 };
    });
  }

  function resetTheirDeduction() {
    setReceipt((prevValue) => {
      return { ...prevValue, theirDeduction: 0 };
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
          <ButtonToolbar className="d-flex flex-column">
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
              <ToggleButton value={"Their"} variant="outline-dark" size="sm">
                Them
              </ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        {/* Personal Deductions */}
        <Form.Group as={Col} lg="6">
          <Form.Label>My Deductions</Form.Label>
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
                name="myDeduction"
                onChange={handleInputChange}
                value={receipt.myDeduction || ""}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <InputGroup.Append>
                <StyledButton
                  name="myDeductionsList"
                  value={receipt.myDeduction}
                  variant="outline-dark"
                  onClick={(event) => {
                    onDeductionAdd(event);
                    resetMyDeduction();
                  }}
                >
                  Add
                </StyledButton>
              </InputGroup.Append>
            </InputGroup>
          </OverlayTrigger>
        </Form.Group>

        {/* Their Deductions */}
        <Form.Group as={Col} lg="6">
          <Form.Label>Their Deductions</Form.Label>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 150, hide: 150 }}
            overlay={
              <Tooltip>Deduct the other person's personal item costs.</Tooltip>
            }
          >
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name="theirDeduction"
                onChange={handleInputChange}
                value={receipt.theirDeduction || ""}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                size="sm"
              />
              <InputGroup.Append>
                <StyledButton
                  name="theirDeductionsList"
                  value={receipt.theirDeduction}
                  variant="outline-dark"
                  onClick={(event) => {
                    onDeductionAdd(event);
                    resetTheirDeduction();
                  }}
                >
                  Add
                </StyledButton>
              </InputGroup.Append>
            </InputGroup>
          </OverlayTrigger>
        </Form.Group>
      </Form.Row>

      <hr />

      <div>
        <h6>Calculation:</h6>
        <Container fluid>
          <Row>
            <Col md={5}>
              <small>Receipt total:</small>
            </Col>
            <Col md={7} className="text-right">
              $ {receipt.total}
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <small>My deductions:</small>
            </Col>
            <Col md={7} className="text-right">
              - ${" "}
              <StyledButton size="sm" variant="link" className="px-0">
                myDeduction
              </StyledButton>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <small>Their deductions:</small>
            </Col>
            <Col md={7} className="text-right">
              - ${" "}
              <StyledButton size="sm" variant="link" className="px-0">
                theirDeduction
              </StyledButton>
            </Col>
          </Row>
          <Separator className="my-2" />
          <Row>
            <Col md={6}>
              <small>Shared cost (split): </small>
            </Col>
            <Col className="text-right" md={6}>
              $ {receipt.balanceOwed}
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <small>
                {receipt.buyer === "Me" ? "Their" : "My"} deductions:{" "}
              </small>
            </Col>
            <Col className="text-right" md={6}>
              + $ {receipt.balanceOwed}
            </Col>
          </Row>
          <Separator className="my-3" />
          <Row>
            <Col md={6}>
              {receipt.buyer === "Me" ? "They owe you" : "You owe them"} :{" "}
            </Col>
            <Col className="text-right" md={6}>
              <h4>$ {receipt.balanceOwed}</h4>
            </Col>
          </Row>
        </Container>
        {/* Submit Button */}
        <StyledButton $primary type="submit" block size="sm" className="mt-2">
          Submit
        </StyledButton>
      </div>
    </Form>
  );
}

export default Calculator;
