import React, { useContext } from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Tooltip from "react-bootstrap/Tooltip";
import { StyledButton } from "../Button";
import { ThemeContext } from "styled-components";
import Input from "../Input";

function CalculatorForm(props) {
  const themeContext = useContext(ThemeContext);

  return (
    <>
      <Form.Row>
        {/* Date of Purchase */}
        <Input
          as={Col}
          lg="6"
          label="Purchase Date"
          name="purchaseDate"
          handleChange={(event) => props.onInputChange(event)}
          value={props.receipt.purchaseDate}
          type="date"
          required
          size="sm"
        />

        {/* Store Name */}
        <Input
          as={Col}
          lg="6"
          label="Store Name"
          name="storeName"
          handleChange={(event) => props.onInputChange(event)}
          value={props.receipt.storeName}
          required
          size="sm"
        />
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
        <Form.Group as={Col}>
          <Form.Label>Deductions</Form.Label>
          {/* <OverlayTrigger
            placement="bottom"
            delay={{ show: 0, hide: 0 }}
            overlay={
              <Tooltip>
            Deduct any personal item costs from the shared receipt.
              </Tooltip>
            }
          > */}
          <InputGroup size="sm">
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              name="price"
              onChange={(event) => props.onDeductionInputChange(event)}
              value={props.deduction.price || ""}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <Form.Control
              name="name"
              onChange={(e) => props.onDeductionInputChange(e)}
              value={props.deduction.name}
              placeholder="Item name"
            />
            <DropdownButton
              name="user"
              as={InputGroup.Append}
              variant={themeContext.toggleButton}
              value={props.deduction.user}
              title={props.deduction.user}
              onSelect={(eventKey, event) =>
                props.onDeductionInputChange(event, eventKey)
              }
            >
              <Dropdown.Item eventKey="Me">Me</Dropdown.Item>
              <Dropdown.Item eventKey="Them">Them</Dropdown.Item>
            </DropdownButton>
            <InputGroup.Append>
              <StyledButton
                variant={themeContext.toggleButton}
                onClick={(event) => {
                  props.deduction.price && props.onDeductionAdd(event);
                }}
              >
                Add
              </StyledButton>
            </InputGroup.Append>
          </InputGroup>
          {/* </OverlayTrigger> */}

          <Form.Check
            type="checkbox"
            checked={props.deduction.isTaxed}
            label="Include tax with item price"
            className="mt-1 small text-muted"
            onChange={(e) => {
              props.onDeductionInputChange(e);
            }}
          />
        </Form.Group>
      </Form.Row>
    </>
  );
}

export default CalculatorForm;
