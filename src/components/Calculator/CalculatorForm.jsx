import React from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Tooltip from "react-bootstrap/Tooltip";
import { StyledButton } from "../../components/Button";

function CalculatorForm(props) {
  return (
    <Form>
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
              <ToggleButton value={"Me"} variant="outline-dark" size="sm">
                Me
              </ToggleButton>
              <ToggleButton value={"Them"} variant="outline-dark" size="sm">
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
                onChange={(event) => props.onInputChange(event)}
                value={props.receipt.myDeduction || ""}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <InputGroup.Append>
                <StyledButton
                  name="myDeductionsList"
                  value={props.receipt.myDeduction}
                  variant="outline-dark"
                  onClick={(event) => {
                    props.onDeductionAdd(event);
                    // resetMyDeduction();
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
                onChange={(event) => props.onInputChange(event)}
                value={props.receipt.theirDeduction || ""}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                size="sm"
              />
              <InputGroup.Append>
                <StyledButton
                  name="theirDeductionsList"
                  value={props.receipt.theirDeduction}
                  variant="outline-dark"
                  onClick={(event) => {
                    props.onDeductionAdd(event);
                    // resetTheirDeduction();
                  }}
                >
                  Add
                </StyledButton>
              </InputGroup.Append>
            </InputGroup>
          </OverlayTrigger>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}

export default CalculatorForm;
