import React, { useState, useEffect } from "react";
import CalculatorForm from "./CalculatorForm";
import CalculatorDisplay from "./CalculatorDisplay";
import { StyledButton } from "../../components/Button";

function Calculator(props) {
  const defaultReceiptState = {
    id: 0,
    purchaseDate: "",
    storeName: "",
    total: 0,
    buyer: "Me",
    myDeduction: 0,
    theirDeduction: 0,
    myDeductionsList: [],
    theirDeductionsList: [],
    balanceOwed: 0,
  };

  const [receipt, setReceipt] = useState(defaultReceiptState);

  useEffect(() => {
    function calculateBalanceOwed() {
      const myDeductionsSum = receipt.myDeductionsList.reduce(
        (a, b) => a * 1 + b * 1,
        0
      );
      const theirDeductionsSum = receipt.theirDeductionsList.reduce(
        (a, b) => a * 1 + b * 1,
        0
      );
      // console.log("myDeductionsSum: " + myDeductionsSum);
      // console.log("theirDeductionsSum: " + theirDeductionsSum);
      const deductionSumToInclude =
        receipt.buyer === 1 ? theirDeductionsSum : myDeductionsSum;
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
  }, [receipt.theirDeductionsList, receipt.total, receipt.myDeductionsList]);

  function handleInputChange(event) {
    const { name, value, type } = event.target;

    setReceipt((prevValue) => {
      if (type === "number") {
        let formattedFloat =
          value.indexOf(".") >= 0
            ? value.substr(0, value.indexOf(".")) +
              value.substr(value.indexOf("."), 3)
            : value;

        return {
          ...prevValue,
          [name]: formattedFloat < 0 ? formattedFloat * -1 : formattedFloat * 1,
        };
      } else {
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

    setReceipt((prevValue) => {
      const deductionList = prevValue[[name]];
      const floatValue = parseFloat(value).toFixed(2);

      return {
        ...prevValue,
        [name]: [...deductionList, floatValue],
      };
    });
  }

  function resetMyDeduction() {
    setReceipt((prevValue) => {
      return { ...prevValue, myDeduction: 0 };
    });
  }

  function resetTheirDeduction() {
    setReceipt((prevValue) => {
      return { ...prevValue, theirDeduction: 0 };
    });
  }

  return (
    <>
      <CalculatorForm
        receipt={receipt}
        onInputChange={handleInputChange}
        onBuyerChange={handleBuyerButtonChange}
        onDeductionAdd={handleDeductionAdd}
      />

      <hr />

      <CalculatorDisplay receipt={receipt} />
      {/* Submit Button */}
      <StyledButton
        $primary
        type="submit"
        block
        size="sm"
        className="mt-2"
        onSubmit={(event) => {
          props.onAdd(receipt);
          event.preventDefault();
          setReceipt(defaultReceiptState);
        }}
      >
        Submit
      </StyledButton>
    </>
  );
}

export default Calculator;
