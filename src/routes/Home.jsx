import React, { useState, useRef } from "react";
import Calculator from "../components/Calculator";
import Table from "../components/Table";
import { StyledCard } from "../components/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { TestTableData } from "./TestTableData";

function Home(props) {
  const [receipts, setReceipts] = useState(TestTableData);
  const calculatorRef = useRef();

  function addReceipt(newReceipt) {
    setReceipts((prevReceipts) => {
      newReceipt.total = parseFloat(newReceipt.total).toFixed(2);
      newReceipt.id = prevReceipts.length + 1;

      return [...prevReceipts, newReceipt];
    });
  }

  function editReceipt(newReceipt) {
    setReceipts((prevReceipts) => {
      const updatedReceipts = prevReceipts.map((receipt) => {
        if (receipt.id !== newReceipt.id) {
          return receipt;
        }

        const updatedCalculations = calculatorRef.current.calculateBalanceOwed(
          newReceipt
        );

        return {
          ...newReceipt,
          ...updatedCalculations,
        };
      });

      return updatedReceipts;
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
            <Calculator onAdd={addReceipt} ref={calculatorRef} />
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
