import React from "react";
import { StyledButton } from "../../components/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Separator } from "../Separator";

function CalculatorDisplay(props) {
  const reincludeDeductions =
    (props.receipt.buyer === "Me" &&
      props.receipt.theirDeductionsList.length) ||
    (props.receipt.buyer === "Them" && props.receipt.myDeductionsList.length);

  return (
    <div>
      <h6>Calculation:</h6>

      <Container fluid>
        <Row>
          <Col md={5}>
            <small>Receipt total:</small>
          </Col>
          <Col md={7} className="text-right">
            $ {props.receipt.total}
          </Col>
        </Row>

        {/* Show / hide myDeductions */}
        {props.receipt.myDeductionsList.length > 0 ? (
          <Row>
            <Col md={5}>
              <small>My deductions:</small>
            </Col>
            <Col md={7} className="text-right">
              - ${" "}
              <StyledButton size="sm" variant="link" className="px-0">
                myDeduction
              </StyledButton>
            </Col>
          </Row>
        ) : null}

        {/* Show / hide otherDeductions */}
        {props.receipt.theirDeductionsList.length > 0 ? (
          <Row>
            <Col md={5}>
              <small>Their deductions:</small>
            </Col>
            <Col md={7} className="text-right">
              - ${" "}
              <StyledButton size="sm" variant="link" className="px-0">
                theirDeduction
              </StyledButton>
            </Col>
          </Row>
        ) : null}

        <Separator className="my-2" />

        <Row>
          <Col md={6}>
            <small>Shared cost (split): </small>
          </Col>
          <Col className="text-right" md={6}>
            $ {props.receipt.balanceOwed}
          </Col>
        </Row>

        {reincludeDeductions ? (
          <Row>
            <Col md={6}>
              <small>
                {props.receipt.buyer === "Me" ? "Their" : "My"} deductions:{" "}
              </small>
            </Col>
            <Col className="text-right" md={6}>
              + $ {props.receipt.balanceOwed}
            </Col>
          </Row>
        ) : null}

        <Separator className="mt-2 mb-3" />

        <Row>
          <Col md={6}>
            {props.receipt.buyer === "Me" ? "They owe you" : "You owe them"} :{" "}
          </Col>
          <Col className="text-right" md={6}>
            <h4>$ {props.receipt.balanceOwed}</h4>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CalculatorDisplay;
