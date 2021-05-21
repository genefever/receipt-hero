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
          <StyledCard $main>
            <Table receipts={receipts} onDelete={deleteReceipt} />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
