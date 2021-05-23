import React, { useState, useEffect } from "react";
import CalculatorForm from "./CalculatorForm";
import CalculatorDisplay from "./CalculatorDisplay";
import { StyledButton } from "../../components/Button";
import Form from "react-bootstrap/Form";

function Calculator(props) {
  const defaultReceiptState = {
    id: 0,
    purchaseDate: "",
    storeName: "",
    total: 0,
    buyer: "Me",
    balanceOwed: 0,
    myDeductions: {
      list: [],
      inputValue: 0,
      sum: 0,
    },
    theirDeductions: {
      list: [],
      inputValue: 0,
      sum: 0,
    },
  };

  const [receipt, setReceipt] = useState(defaultReceiptState);

  useEffect(() => {
    function calculateBalanceOwed() {
      const myDeductionsSum = receipt.myDeductions.sum;
      const theirDeductionsSum = receipt.theirDeductions.sum;
      // console.log("myDeductionsSum: " + myDeductionsSum);
      // console.log("theirDeductionsSum: " + theirDeductionsSum);
      const deductionSumToInclude =
        receipt.buyer === "Me" ? theirDeductionsSum : myDeductionsSum;
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
  }, [
    receipt.theirDeductions.list,
    receipt.total,
    receipt.myDeductions.list,
    receipt.buyer,
  ]);

  function handleInputChange(event, isDeductionInputChange = false) {
    const { name, value, type } = event.target;

    setReceipt((prevValue) => {
      // Handle number input.
      if (type === "number") {
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

        // Update nested deductions object.
        if (isDeductionInputChange) {
          return {
            ...prevValue,
            [name]: {
              ...prevValue[name],
              inputValue: formattedFloat,
            },
          };
        }

        // Update regular number input.
        return {
          ...prevValue,
          [name]: formattedFloat,
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
    const { name, value } = event.target;
    const floatValue = parseFloat(value).toFixed(2);

    setReceipt((prevValue) => {
      const deductionsObj = prevValue[[name]];
      const deductionsList = deductionsObj.list;
      const deductionsSum =
        deductionsList.reduce((a, b) => a * 1 + b * 1, 0) + floatValue * 1;

      return {
        ...prevValue,
        [name]: {
          list: [...deductionsList, floatValue],
          inputValue: 0,
          sum: deductionsSum,
        },
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
      <CalculatorForm
        receipt={receipt}
        onInputChange={handleInputChange}
        onBuyerChange={handleBuyerButtonChange}
        onDeductionAdd={handleDeductionAdd}
      />

      <hr />

      <CalculatorDisplay receipt={receipt} />

      {/* Submit Button */}
      <StyledButton $primary type="submit" block className="mt-2">
        Submit
      </StyledButton>
    </Form>
  );
}

export default Calculator;
