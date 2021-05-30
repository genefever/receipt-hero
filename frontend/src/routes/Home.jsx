import React, { useState, useRef, useContext } from "react";
import Calculator from "../components/Calculator";
import ReceiptsTable from "../components/ReceiptsTable";
import { StyledCard } from "../components/Card";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { TestTableData } from "./TestTableData";
import { UserContext } from "../UserContext";

function Home(props) {
  const [receipts, setReceipts] = useState(TestTableData);
  const [showAlert, setShowAlert] = useState(true);
  const calculatorRef = useRef();
  const userObject = useContext(UserContext);

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
    <>
      {/* Alert message - login/signup */}
      {!userObject && showAlert && (
        <Alert variant="info" onClose={() => setShowAlert(false)} dismissible>
          You are not logged in. <Alert.Link href="/login">Log in</Alert.Link>{" "}
          or <Alert.Link href="/signup">sign up</Alert.Link> to save your
          calculations.
        </Alert>
      )}

      {/* Main dashboard */}
      <Row>
        <Col md={4}>
          <StyledCard $main>
            <Calculator onAdd={addReceipt} ref={calculatorRef} />
          </StyledCard>
        </Col>
        <Col md={8}>
          <StyledCard $main className="pb-3">
            <ReceiptsTable
              receipts={receipts}
              onDelete={deleteReceipt}
              onEdit={editReceipt}
            />
          </StyledCard>
        </Col>
      </Row>
    </>
  );
}

export default Home;
