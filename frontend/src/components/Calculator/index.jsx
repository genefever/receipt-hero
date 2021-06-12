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
    buyer: "Me",
    meToPay: 0,
    themToPay: 0,
    deductions: [],
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

  const defaultDeductionState = {
    id: null,
    price: 0,
    name: "",
    user: "Me",
    isTaxed: false,
  };

  const [receipt, setReceipt] = useState(defaultReceiptState);
  const [deduction, setDeduction] = useState(defaultDeductionState);

  useImperativeHandle(ref, () => ({
    calculateBalanceOwed: calculateBalanceOwed,
  }));

  function calculateDeductionsSum(list) {
    return list.reduce((acc, item) => acc * 1 + item * 1, 0);
  }

  function calculateBalanceOwed(receiptToCalculate) {
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

  function handleBuyerButtonChange(event) {
    setReceipt((prevValue) => {
      return { ...prevValue, buyer: event };
    });
  }

  function handleDeductionAdd(event) {
    setReceipt((prevReceipt) => {
      const prevDeductionsList = prevReceipt.deductions;
      return { ...prevReceipt, deductions: [...prevDeductionsList, deduction] };
    });

    setDeduction(defaultDeductionState);
  }

  // Update nested deductions object.
  function handleDeductionInputChange(event, eventKey = null) {
    setDeduction((prevDeduction) => {
      if (eventKey) {
        return { ...prevDeduction, user: eventKey };
      }

      const { name, value, type, checked } = event.target;

      if (type === "number")
        return { ...prevDeduction, price: formatFloat(value) };
      else if (type === "checkbox") {
        const taxRate = 1.0925; // TODO update to be dynamic
        const newPrice = checked
          ? prevDeduction.price * taxRate
          : prevDeduction.price / taxRate;

        return {
          ...prevDeduction,
          isTaxed: checked,
          price: newPrice.toFixed(2),
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
        onBuyerChange={handleBuyerButtonChange}
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
