import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";
import CalculatorForm from "./CalculatorForm";
import CalculatorDisplay from "./CalculatorDisplay";
import { StyledButton } from "../../components/Button";
import Form from "react-bootstrap/Form";
import { ThemeContext } from "styled-components";
import { UserContext } from "../../UserContext";
import * as api from "../../api";

const Calculator = forwardRef((props, ref) => {
  const themeContext = useContext(ThemeContext);

  const defaultReceiptState = {
    id: 0,
    purchaseDate: "",
    storeName: "",
    total: 0,
    sharedTotal: 0,
    buyer: props.calculationObject.people[0].name,
    settlement: { amount: 0 },
    people: props.calculationObject.people.map((person) => ({
      idx: person.idx,
      name: person.name,
      amount: 0,
      isBuyer: person.idx === 0 ? true : false,
      deductions: [],
    })),
  };

  const [receipt, setReceipt] = useState(defaultReceiptState);

  const defaultDeductionState = {
    id: null,
    amount: 0,
    amountWithTax: 0,
    itemName: "",
    personIdx: 0,
    isTaxed: false,
  };

  const [deduction, setDeduction] = useState(defaultDeductionState);

  useImperativeHandle(ref, () => ({
    calculateBalanceOwed: calculateBalanceOwed,
  }));

  // Adds every number in the list and returns the sum.
  function calculateDeductionsSum(list) {
    return list.reduce(
      (acc, item) =>
        acc * 1 + (item.isTaxed ? item.amountWithTax : item.amount) * 1,
      0
    );
  }

  function calculateBalanceOwed(receiptToCalculate) {
    // Calculate the credit/debit balance of each user
    let updatedPeople = receiptToCalculate.people;
    let sharedCost = receiptToCalculate.total;
    const numPeople = receiptToCalculate.people.length;

    for (var i = 0; i < numPeople; i++) {
      let person = updatedPeople[i];

      // Buyer has a positive amount, which means they spent that much.
      // Other people have a 0 amount because they didn't spend anything.
      updatedPeople[i].amount = person.isBuyer ? receiptToCalculate.total : 0;

      // Subtract any personal deductions from each person and the total receipt.
      const personDeductionTotal = calculateDeductionsSum(person.deductions);
      updatedPeople[i].amount -= 1 * personDeductionTotal;
      sharedCost -= 1 * personDeductionTotal;
    }

    const splitReceiptCost = sharedCost / numPeople;

    // Subtract the shared cost from each person who is not the buyer.
    // This calculates how much each person owes the buyer.
    for (i = 0; i < numPeople; i++) {
      updatedPeople[i].amount -= (1 * splitReceiptCost).toFixed(2);
    }

    // Person 0 is always 'you'.
    const selfAmount = updatedPeople[0].amount;
    let selfDoesOwe = selfAmount < 0;
    const settlement = {
      message: selfDoesOwe
        ? `You owe ${receiptToCalculate.buyer} $${Math.abs(selfAmount).toFixed(
            2
          )}`
        : `You lent $${Math.abs(selfAmount).toFixed(2)}`,
      amount: Math.abs(selfAmount).toFixed(2),
      doesOwe: selfDoesOwe,
    };

    return {
      sharedTotal: sharedCost,
      people: updatedPeople,
      settlement: settlement,
    };
  }

  useEffect(() => {
    const updatedCalculations = calculateBalanceOwed(receipt);
    setReceipt((prevReceipt) => {
      return {
        ...prevReceipt,
        ...updatedCalculations,
      };
    });
    // eslint-disable-next-line
  }, [
    receipt.total,
    receipt.deductions,
    receipt.buyer,
    // eslint-disable-next-line
    JSON.stringify(receipt.people),
  ]);

  // Updates the name of receipt's people when a calculationObject's person name changes.
  useEffect(() => {
    setReceipt((prevReceipt) => {
      let updatedPeople = [...prevReceipt.people];
      for (var i = 0; i < updatedPeople.length; i++) {
        updatedPeople[i].name = props.calculationObject.people[i].name;

        if (
          updatedPeople[i].isBuyer &&
          updatedPeople[i].name !== prevReceipt.buyer
        ) {
          handleBuyerChange(updatedPeople[i]);
        }
      }
      return { ...prevReceipt, people: updatedPeople };
    });
    // eslint-disable-next-line
  }, [JSON.stringify(props.calculationObject.people)]);

  function formatFloat(value) {
    let formattedFloat =
      value.indexOf(".") >= 0
        ? value.substr(0, value.indexOf(".")) +
          value.substr(value.indexOf("."), 3)
        : value;

    if (formattedFloat < 0) {
      formattedFloat *= -1;
    } else {
      formattedFloat *= 1;
    }

    return formattedFloat;
  }

  // Used for setting receipt's purchaseDate, storeName, and receipt total.
  function handleInputChange(event) {
    const { name, value, type } = event.target;

    setReceipt((prevValue) => {
      // Handle number input.
      if (type === "number") {
        // Update regular number input.
        return {
          ...prevValue,
          [name]: formatFloat(value),
        };
      }
      // Handle date / string input.
      else {
        return { ...prevValue, [name]: value };
      }
    });
  }

  // Sets the receipt's buyer and marks the buyers isBuyer to True.
  function handleBuyerChange(selectedPerson) {
    setReceipt((prevReceipt) => {
      let updatedPeople = [...prevReceipt.people];
      for (var i = 0; i < updatedPeople.length; i++) {
        updatedPeople[i].isBuyer = i === selectedPerson.idx ? true : false;
      }

      return {
        ...prevReceipt,
        buyer: selectedPerson.name,
        people: updatedPeople,
      };
    });
  }

  // Adds a deduction object to the person's deductions list.
  function handleDeductionAdd() {
    setReceipt((prevReceipt) => {
      let updatedPeople = [...prevReceipt.people];
      updatedPeople[deduction.personIdx].deductions.push(deduction);
      return { ...prevReceipt, people: updatedPeople };
    });

    setDeduction(defaultDeductionState);
  }

  // Deletes a deduction item from the person's deductions list.
  function handleDeductionDelete(personIdx, idxToDelete) {
    setReceipt((prevReceipt) => {
      let updatedPeople = [...prevReceipt.people];
      updatedPeople[personIdx].deductions = updatedPeople[
        personIdx
      ].deductions.filter((ele, idx) => {
        return idx !== idxToDelete;
      });

      return { ...prevReceipt, people: updatedPeople };
    });

    setDeduction(defaultDeductionState);
  }

  // Updates the deduction object's state.
  function handleDeductionInputChange(event, dropDownValue = null) {
    setDeduction((prevDeduction) => {
      // Set the deduction name from the dropdown.
      if (dropDownValue) {
        return {
          ...prevDeduction,
          personIdx: dropDownValue.idx,
        };
      }

      const { name, value, type, checked } = event.target;

      if (type === "number") {
        let amount = 0;
        let amountWithTax = 0;

        // Update amount and amountWithTax according to current isTaxed state.
        if (prevDeduction.isTaxed) {
          amountWithTax = formatFloat(value);
          amount = (amountWithTax / (taxRate / 100 + 1)).toFixed(2);
        } else {
          amount = formatFloat(value);
          amountWithTax = (amount * (taxRate / 100 + 1)).toFixed(2);
        }

        return {
          ...prevDeduction,
          amount: amount,
          amountWithTax: amountWithTax,
        };
      } else if (type === "checkbox") {
        const amountWithTax = 1 * (prevDeduction.amount * (taxRate / 100 + 1));

        return {
          ...prevDeduction,
          amountWithTax: amountWithTax.toFixed(2),
          isTaxed: checked,
        };
      } else {
        return { ...prevDeduction, [name]: value };
      }
    });
  }

  // Tax Rate
  const [taxRate, setTaxRate] = useState(9.25);
  const { userObject } = useContext(UserContext);

  // Set taxRate based on userObject's taxRate or local storage taxRate if available.
  useEffect(() => {
    if (userObject?.taxRate) {
      setTaxRate(userObject.taxRate);
    } else if (window.localStorage.getItem("taxRate")) {
      setTaxRate(window.localStorage.getItem("taxRate"));
    }
  }, [userObject]);

  // Called in CalculatorForm when taxRate input changes.
  const handleTaxRateChange = (event) => {
    setTaxRate(event.target.value);
  };

  // Called in CalculatorForm when taxRate input is submitted.
  const handleTaxRateSubmit = () => {
    if (userObject) {
      try {
        api.updateUser({ ...userObject, taxRate: taxRate });
      } catch (err) {
        console.log(err);
      }
    } else {
      window.localStorage.setItem("taxRate", taxRate);
    }

    // Update the deductions input field with the new tax rate.
    const dummyEvent = {
      target: {
        name: null,
        value: null,
        type: "checkbox",
        checked: deduction.isTaxed,
      },
    };
    handleDeductionInputChange(dummyEvent);
  };

  return (
    <Form
      onSubmit={(event) => {
        props.onAdd(receipt);
        event.preventDefault();
        setReceipt(defaultReceiptState);
      }}
    >
      <h4>Add a Receipt</h4>
      <hr />
      <CalculatorForm
        receipt={receipt}
        deduction={deduction}
        taxRate={taxRate}
        onInputChange={handleInputChange}
        onBuyerChange={handleBuyerChange}
        onDeductionInputChange={handleDeductionInputChange}
        onDeductionAdd={handleDeductionAdd}
        onTaxRateChange={handleTaxRateChange}
        onTaxRateSubmit={handleTaxRateSubmit}
      />

      <hr />

      <CalculatorDisplay
        receipt={receipt}
        calculateDeductionsSum={calculateDeductionsSum}
        onDeductionDelete={handleDeductionDelete}
      />

      {/* Add Button */}
      <StyledButton
        variant={themeContext.toggleButton}
        type="submit"
        block
        className="mt-2"
      >
        Add
      </StyledButton>
    </Form>
  );
});

export default Calculator;
