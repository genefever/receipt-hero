import React, { useContext } from "react";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
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
          <Form.Label>Who Paid?</Form.Label>
          <DropdownButton
            name="buyer"
            size="sm"
            variant={themeContext.toggleButton}
            value={props.receipt.buyer}
            title={props.receipt.buyer}
          >
            {props.receipt.people.map((person, idx) => (
              <Dropdown.Item
                key={idx}
                onSelect={() => props.onBuyerChange(person)}
              >
                {person.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
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
              name="amount"
              onChange={(e) => props.onDeductionInputChange(e)}
              value={props.deduction.amount || ""}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <Form.Control
              name="itemName"
              onChange={(e) => props.onDeductionInputChange(e)}
              value={props.deduction.itemName}
              placeholder="Item name"
            />
            <DropdownButton
              name="personName"
              as={InputGroup.Append}
              variant={themeContext.toggleButton}
              value={props.deduction.personName}
              title={props.deduction.personName}
            >
              {props.receipt.people.map((person, idx) => (
                <Dropdown.Item
                  key={idx}
                  onSelect={(e) => props.onDeductionInputChange(e, person)}
                >
                  {person.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <InputGroup.Append>
              <StyledButton
                variant={themeContext.toggleButton}
                onClick={(e) => {
                  props.deduction.amount && props.onDeductionAdd(e);
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
