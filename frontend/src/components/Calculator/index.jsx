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

const Calculator = forwardRef((props, ref) => {
  const themeContext = useContext(ThemeContext);

  const defaultReceiptState = {
    id: 0,
    purchaseDate: "",
    storeName: "",
    total: 0,
    sharedTotal: 0,
    buyer: "You",
    settlement: { amount: 0 },
    people: [
      {
        idx: 0,
        name: "You",
        amount: 0,
        isBuyer: true,
        deductions: [],
      },
      {
        idx: 1,
        name: "User 2",
        amount: 0,
        isBuyer: false,
        deductions: [],
      },
    ],
  };

  const [receipt, setReceipt] = useState(defaultReceiptState);

  const defaultDeductionState = {
    id: null,
    amount: 0,
    itemName: "",
    personIdx: 0,
    personName: receipt.people[0].name,
    isTaxed: false,
  };

  const [deduction, setDeduction] = useState(defaultDeductionState);

  useImperativeHandle(ref, () => ({
    calcBalanceOwed: calcBalanceOwed,
  }));

  // Adds every number in the list and returns the sum.
  function calculateDeductionsSum(list) {
    return list.reduce((acc, item) => acc * 1 + item.amount * 1, 0);
  }

  function calcBalanceOwed(receiptToCalculate) {
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
    const updatedCalculations = calcBalanceOwed(receipt);
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
      let updatedPeople = prevReceipt.people;
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
      let updatedPeople = prevReceipt.people;
      updatedPeople[deduction.personIdx].deductions.push(deduction);
      return { ...prevReceipt, people: updatedPeople };
    });

    setDeduction(defaultDeductionState);
  }

  // Deletes a deduction item from the person's deductions list.
  function handleDeductionDelete(personIdx, idxToDelete) {
    setReceipt((prevReceipt) => {
      let updatedPeople = prevReceipt.people;
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
          personName: dropDownValue.name,
          personIdx: dropDownValue.idx,
        };
      }

      const { name, value, type, checked } = event.target;

      if (type === "number")
        return { ...prevDeduction, amount: formatFloat(value) };
      else if (type === "checkbox") {
        const taxRate = 1.0925; // TODO update to be dynamic
        const newAmount = checked
          ? prevDeduction.amount * taxRate
          : prevDeduction.amount / taxRate;

        return {
          ...prevDeduction,
          isTaxed: checked,
          amount: 1 * newAmount.toFixed(2),
        };
      } else {
        return { ...prevDeduction, [name]: value };
      }
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
      <h4>Add a Receipt</h4>
      <hr />
      <CalculatorForm
        receipt={receipt}
        deduction={deduction}
        onInputChange={handleInputChange}
        onBuyerChange={handleBuyerChange}
        onDeductionInputChange={handleDeductionInputChange}
        onDeductionAdd={handleDeductionAdd}
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
