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
    buyer: "Me",
    people: [
      {
        idx: 0,
        name: "Me",
        amount: 0,
        isBuyer: true,
        deductions: [],
      },
      {
        idx: 1,
        name: "Them",
        amount: 0,
        isBuyer: false,
        deductions: [],
      },
    ],
    //TODO Delete below when done
    meToPay: 0,
    themToPay: 0,
    myDeductions: {
      list: [],
      inputValue: {
        price: 0,
        itemName: "",
        isTaxed: false,
      },
      sum: 0,
    },
    theirDeductions: {
      list: [],
      inputValue: 0,
      sum: 0,
    },
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
    calculateBalanceOwed: calculateBalanceOwed,
  }));

  // Adds every number in the list and returns the sum.
  function calculateDeductionsSum(list) {
    return list.reduce((acc, item) => acc * 1 + item * 1, 0);
  }

  function calcBalanceOwed(receiptToCalculate) {
    // Calculate the credit/debit balance of each user
    let sharedCost = receiptToCalculate.total;
    const numPeople = receiptToCalculate.people.length;

    for (var i = 0; i < numPeople; i++) {
      let person = receiptToCalculate.people[i];
      const personDeductionTotal = calculateDeductionsSum(person.deductions);
      receiptToCalculate.people[i].amount = -1 * personDeductionTotal;
      sharedCost -= personDeductionTotal;
    }

    const splitReceiptCost = sharedCost / numPeople;

    for (i = 0; i < numPeople; i++) {
      if (!receiptToCalculate.people[i].isBuyer) {
        receiptToCalculate.people[i].amount = (-1 * splitReceiptCost).toFixed(
          2
        );
      }
    }

    console.log(receiptToCalculate.people);
  }

  function calculateBalanceOwed(receiptToCalculate) {
    calcBalanceOwed(receiptToCalculate);
    const myDeductionsSum = calculateDeductionsSum(
      receiptToCalculate.myDeductions.list
    );
    const theirDeductionsSum = calculateDeductionsSum(
      receiptToCalculate.theirDeductions.list
    );
    const deductionSumToInclude =
      receiptToCalculate.buyer === "Me" ? theirDeductionsSum : myDeductionsSum;
    const sharedCost =
      receiptToCalculate.total - myDeductionsSum - theirDeductionsSum;
    const splitReceiptCost = sharedCost / 2;

    const calculatedBalanceOwed = (
      splitReceiptCost + deductionSumToInclude
    ).toFixed(2);

    return {
      meToPay: receiptToCalculate.buyer === "Me" ? "" : calculatedBalanceOwed,
      themToPay: receiptToCalculate.buyer === "Me" ? calculatedBalanceOwed : "",
      myDeductions: {
        ...receiptToCalculate["myDeductions"],
        sum: myDeductionsSum,
      },
      theirDeductions: {
        ...receiptToCalculate["theirDeductions"],
        sum: theirDeductionsSum,
      },
    };
  }

  useEffect(() => {
    const updatedCalculations = calculateBalanceOwed(receipt);
    setReceipt((prevValue) => {
      return {
        ...prevValue,
        ...updatedCalculations,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt.total, receipt.deductions, receipt.buyer]);

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

  function handleBuyerChange(event) {
    setReceipt((prevReceipt) => {
      let updatedPeople = prevReceipt.people;
      for (var i = 0; i < updatedPeople.length; i++) {
        i === event.idx
          ? (updatedPeople[i].isBuyer = true)
          : (updatedPeople[i].isBuyer = false);
      }

      return { ...prevReceipt, buyer: event, people: updatedPeople };
    });
  }

  function handleBuyerButtonChange(event) {
    setReceipt((prevValue) => {
      return { ...prevValue, buyer: event };
    });
  }

  function handleDeductionAdd(event) {
    setReceipt((prevReceipt) => {
      let updatedPeople = prevReceipt.people;
      updatedPeople[deduction.personIdx].push(deduction);
    });

    setDeduction(defaultDeductionState);
  }

  // Update deduction object state.
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
        return { ...prevDeduction, price: formatFloat(value) };
      else if (type === "checkbox") {
        const taxRate = 1.0925; // TODO update to be dynamic
        const newAmount = checked
          ? prevDeduction.price * taxRate
          : prevDeduction.price / taxRate;

        return {
          ...prevDeduction,
          isTaxed: checked,
          amount: newAmount.toFixed(2),
        };
      } else {
        return { ...prevDeduction, [name]: value };
      }
    });
  }

  function handleDeductionsListChange(name, updatedList) {
    setReceipt((prevValue) => {
      return {
        ...prevValue,
        [name]: { ...prevValue[name], list: updatedList },
      };
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
        onDeductionsListChange={handleDeductionsListChange}
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
