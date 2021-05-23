import React from "react";
import { StyledButton } from "../../components/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Separator } from "../Separator";

function CalculatorDisplay(props) {
  const reincludeDeductions =
    (props.receipt.buyer === "Me" &&
      props.receipt.theirDeductions.list.length) ||
    (props.receipt.buyer === "Them" && props.receipt.myDeductions.list.length);

  return (
    <div>
      <h6>Calculation:</h6>

      <Container fluid>
        <Row>
          <Col md={5}>
            <small>Receipt total:</small>
          </Col>
          <Col md={7} className="text-right">
            $ {props.receipt.total.toFixed(2)}
          </Col>
        </Row>

        {/* Show / hide myDeductions */}
        {props.receipt.myDeductions.list.length > 0 ? (
          <Row>
            <Col md={5}>
              <small>My deductions:</small>
            </Col>
            <Col md={7} className="text-right">
              - ${" "}
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 0, hide: 0 }}
                overlay={<Tooltip>Edit</Tooltip>}
              >
                <StyledButton size="sm" variant="link" className="px-0">
                  {props.receipt.myDeductions.sum.toFixed(2)}
                </StyledButton>
              </OverlayTrigger>
            </Col>
          </Row>
        ) : null}

        {/* Show / hide otherDeductions */}
        {props.receipt.theirDeductions.list.length > 0 ? (
          <Row>
            <Col md={5}>
              <small>Their deductions:</small>
            </Col>
            <Col md={7} className="text-right">
              - ${" "}
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 0, hide: 0 }}
                overlay={<Tooltip>Edit</Tooltip>}
              >
                <StyledButton size="sm" variant="link" className="px-0">
                  {props.receipt.theirDeductions.sum.toFixed(2)}
                </StyledButton>
              </OverlayTrigger>
            </Col>
          </Row>
        ) : null}

        <Separator className="my-2" />

        <Row>
          <Col md={6}>
            <small>Shared cost (split): </small>
          </Col>
          <Col className="text-right" md={6}>
            $ {(props.receipt.total / 2).toFixed(2)}
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
              + ${" "}
              {props.receipt.buyer === "Me"
                ? props.receipt.theirDeductions.sum.toFixed(2)
                : props.receipt.myDeductions.sum.toFixed(2)}
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
