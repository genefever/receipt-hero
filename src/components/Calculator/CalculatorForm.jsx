import React, { useContext } from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Tooltip from "react-bootstrap/Tooltip";
import { StyledButton } from "../../components/Button";
import { ThemeContext } from "styled-components";

function CalculatorForm(props) {
  const themeContext = useContext(ThemeContext);

  return (
    <>
      <Form.Row>
        {/* Date of Purchase */}
        <Form.Group as={Col} lg="6">
          <Form.Label>Purchase Date</Form.Label>
          <Form.Control
            name="purchaseDate"
            onChange={(event) => props.onInputChange(event)}
            value={props.receipt.purchaseDate}
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
            onChange={(event) => props.onInputChange(event)}
            value={props.receipt.storeName}
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
              onChange={(event) => props.onInputChange(event)}
              value={props.receipt.total || ""}
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
              defaultValue={props.receipt.buyer}
              value={props.receipt.buyer}
              onChange={(event) => props.onBuyerChange(event)}
            >
              <ToggleButton
                value={"Me"}
                variant={themeContext.toggleButton}
                size="sm"
              >
                Me
              </ToggleButton>
              <ToggleButton
                value={"Them"}
                variant={themeContext.toggleButton}
                size="sm"
              >
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
            delay={{ show: 0, hide: 0 }}
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
                name="myDeductions"
                onChange={(event) => props.onInputChange(event, true)}
                value={props.receipt.myDeductions.inputValue || ""}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <InputGroup.Append>
                <StyledButton
                  name="myDeductions"
                  value={props.receipt.myDeductions.inputValue}
                  variant={themeContext.toggleButton}
                  onClick={(event) => {
                    props.receipt.myDeductions.inputValue &&
                      props.onDeductionAdd(event);
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
            delay={{ show: 0, hide: 0 }}
            overlay={
              <Tooltip>Deduct the other person's personal item costs.</Tooltip>
            }
          >
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name="theirDeductions"
                onChange={(event) => props.onInputChange(event, true)}
                value={props.receipt.theirDeductions.inputValue || ""}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                size="sm"
              />
              <InputGroup.Append>
                <StyledButton
                  name="theirDeductions"
                  value={props.receipt.theirDeductions.inputValue}
                  variant={themeContext.toggleButton}
                  onClick={(event) => {
                    props.receipt.theirDeductions.inputValue &&
                      props.onDeductionAdd(event);
                  }}
                >
                  Add
                </StyledButton>
              </InputGroup.Append>
            </InputGroup>
          </OverlayTrigger>
        </Form.Group>
      </Form.Row>
    </>
  );
}

export default CalculatorForm;
