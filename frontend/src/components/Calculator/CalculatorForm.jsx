import React, { useContext, useState } from "react";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import * as yup from "yup";
import { FormTextField } from "../../components/Form";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { StyledButton } from "../Button";
import { ThemeContext } from "styled-components";
import { StyledModal } from "../Modal";
import * as api from "../../api";

// Formik validation schema
const validationSchema = yup.object({
  taxRate: yup
    .number()
    .test(
      "validNumberRange",
      "Number must be between 0 and 100",
      (value) => 0 < value && value <= 100
    )
    .test(
      "maxDigitsAfterDecimal",
      "Number must have 2 digits after decimal or less",
      (number) => /^\d+(\.\d{1,2})?$/.test(number)
    )
    .required(),
});

function CalculatorForm(props) {
  // Called in CalculatorForm when taxRate input is submitted.
  const handleTaxRateSubmit = (taxRate) => {
    if (props.userObject) {
      try {
        api.updateUser({ ...props.userObject, taxRate: taxRate });
      } catch (err) {
        console.log(err);
      }
    } else {
      window.localStorage.setItem("taxRate", taxRate);
    }

    handleCloseModal();
    props.setTaxRate(taxRate);

    // Update the deductions input field with the new tax rate.
    const dummyEvent = {
      target: {
        name: null,
        value: null,
        type: "checkbox",
        checked: props.deduction.isTaxed,
      },
    };
    props.onDeductionInputChange(dummyEvent);
  };

  const themeContext = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (personIdx) => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Form.Row>
        {/* Date of Purchase */}
        <Form.Group as={Col} lg="6">
          <Form.Control
            label="Purchase Date"
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
          <Form.Control
            label="Store Name"
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
              required
              step="any"
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
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 0, hide: 0 }}
            overlay={
              <Tooltip>Deduct any unshared items from the receipt.</Tooltip>
            }
          >
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name="amount"
                onChange={(e) => props.onDeductionInputChange(e)}
                value={
                  props.deduction.isTaxed
                    ? props.deduction.amountWithTax !== "0.00"
                      ? props.deduction.amountWithTax
                      : ""
                    : props.deduction.amount || ""
                }
                type="number"
                min="0"
                placeholder="0.00"
              />
              <Form.Control
                name="itemName"
                onChange={(e) => props.onDeductionInputChange(e)}
                value={props.deduction.itemName}
                placeholder="Item name"
              />
              <DropdownButton
                name="personIdx"
                as={InputGroup.Append}
                variant={themeContext.toggleButton}
                value={props.receipt.people[props.deduction.personIdx].name}
                title={props.receipt.people[props.deduction.personIdx].name}
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
                  onClick={() => {
                    props.deduction.amount && props.onDeductionAdd();
                  }}
                >
                  Add
                </StyledButton>
              </InputGroup.Append>
            </InputGroup>
          </OverlayTrigger>

          <Form.Check className="mt-1 text-muted">
            <div className="d-flex align-items-center">
              <Form.Check.Input
                id="taxRateCheckbox"
                type="checkbox"
                checked={props.deduction.isTaxed}
                onChange={(e) => {
                  props.onDeductionInputChange(e);
                }}
              />
              <Form.Check.Label htmlFor="taxRateCheckbox" className="mt-1">
                Include{" "}
                <StyledButton
                  variant="link"
                  className="py-0 px-0 pb-1"
                  onClick={handleShowModal}
                >
                  tax
                </StyledButton>{" "}
                with item price
              </Form.Check.Label>
            </div>
          </Form.Check>
        </Form.Group>
      </Form.Row>

      {/* Modal - Edit tax rate */}
      <StyledModal show={showModal} onHide={handleCloseModal} size="sm">
        <StyledModal.Header closeButton>
          <StyledModal.Title>Edit tax rate</StyledModal.Title>
        </StyledModal.Header>
        <StyledModal.Body>
          <Formik
            validationSchema={validationSchema}
            initialValues={{ taxRate: props.initialTaxRate }}
            onSubmit={(values) => handleTaxRateSubmit(values.taxRate)}
          >
            {({ handleSubmit }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <FormTextField
                  type="number"
                  name="taxRate"
                  className="text-right"
                  autoFocus
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  inputGroupPrepend={
                    <InputGroup.Prepend>
                      <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup.Prepend>
                  }
                />

                <StyledButton
                  type="submit"
                  variant="secondary"
                  className="mt-4 mb-1 float-right"
                >
                  Done
                </StyledButton>
              </Form>
            )}
          </Formik>
        </StyledModal.Body>
      </StyledModal>
    </>
  );
}

export default CalculatorForm;
