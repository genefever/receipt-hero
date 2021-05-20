import React from "react";
import Calculator from "../components/Calculator";
import Table from "../components/Table";
import { StyledCard } from "../components/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function Home() {
  return (
    <div className="mt-4">
      <Row>
        <Col md={4}>
          <StyledCard $main>
            <Calculator />
          </StyledCard>
        </Col>
        <Col md={8}>
          <StyledCard $main>
            <Table />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
