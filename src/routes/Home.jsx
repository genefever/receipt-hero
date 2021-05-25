import React, { useState } from "react";
import Calculator from "../components/Calculator";
import Table from "../components/Table";
import { StyledCard } from "../components/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { TestTableData } from "./TestTableData";

function Home() {
  const [receipts, setReceipts] = useState(TestTableData);

  function addReceipt(newReceipt) {
    setReceipts((prevReceipts) => {
      newReceipt.total = parseFloat(newReceipt.total).toFixed(2);
      newReceipt.id = prevReceipts.length + 1;

      return [...prevReceipts, newReceipt];
    });
  }

  function calculateDeductionsSum(list) {
    return list.reduce((acc, item) => acc * 1 + item * 1, 0);
  }

  function editReceipt(newReceipt) {
    setReceipts((prevReceipts) => {
      const newReceipts = prevReceipts.map((receipt) => {
        if (receipt.id !== newReceipt.id) {
          return receipt;
        }
        const myDeductionsSum = calculateDeductionsSum(
          newReceipt.myDeductions.list
        );
        const theirDeductionsSum = calculateDeductionsSum(
          newReceipt.theirDeductions.list
        );
        const deductionSumToInclude =
          newReceipt.buyer === "Me" ? theirDeductionsSum : myDeductionsSum;
        const sharedCost =
          newReceipt.total - myDeductionsSum - theirDeductionsSum;
        const splitReceiptCost = sharedCost / 2;

        const calculatedBalanceOwed = (
          splitReceiptCost + deductionSumToInclude
        ).toFixed(2);

        return {
          ...newReceipt,
          meToPay: newReceipt.buyer === "Me" ? "" : calculatedBalanceOwed,
          themToPay: newReceipt.buyer === "Me" ? calculatedBalanceOwed : "",
          myDeductions: {
            ...newReceipt["myDeductions"],
            sum: myDeductionsSum,
          },
          theirDeductions: {
            ...newReceipt["theirDeductions"],
            sum: theirDeductionsSum,
          },
        };
      });

      return newReceipts;
    });
  }

  function deleteReceipt(idToDelete) {
    setReceipts((prevReceipts) => {
      return prevReceipts.filter((receipt) => {
        return idToDelete !== receipt.id;
      });
    });
  }

  return (
    <div className="mt-4">
      <Row>
        <Col md={4}>
          <StyledCard $main>
            <Calculator onAdd={addReceipt} />
          </StyledCard>
        </Col>
        <Col md={8}>
          <StyledCard $main className="pb-3">
            <Table
              receipts={receipts}
              onDelete={deleteReceipt}
              onEdit={editReceipt}
            />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
