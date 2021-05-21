import React, { useState } from "react";
import Calculator from "../components/Calculator";
import Table from "../components/Table";
import { StyledCard } from "../components/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function Home() {
  const [receipts, setReceipts] = useState([]);

  function addReceipt(newReceipt) {
    setReceipts((prevReceipts) => {
      console.log("receipts Called");
      newReceipt.id = prevReceipts.length + 1;
      return [...prevReceipts, newReceipt];
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
            <Table receipts={receipts} />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
