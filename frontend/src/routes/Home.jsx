import React, { useState, useRef, useContext, useEffect } from "react";
import Calculator from "../components/Calculator";
import ReceiptsTable from "../components/ReceiptsTable";
import { StyledCard } from "../components/Card";
import { StyledSpinner } from "../components/Spinner";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { BsInfoCircle } from "react-icons/bs";
import { UserContext } from "../UserContext";
import { useHistory, useParams } from "react-router-dom";
import * as api from "../api";

function Home(props) {
  const { userObject } = useContext(UserContext);
  const [receipts, setReceipts] = useState([]);
  const [showAlert, setShowAlert] = useState(true);
  const calculatorRef = useRef(); // Used to calculate balance owed
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getCalculationObject(id) {
      try {
        const res = await api.getCalculation(id);
        if (res.data) {
          setReceipts(res.data.receipts);
        }
      } catch (err) {
        history.push("/not-found");
      }
    }

    if (id) {
      getCalculationObject(id);
    }

    setLoading(false);
  }, [id, history]);

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
      {loading ? (
        <StyledSpinner />
      ) : (
        <>
          {!userObject && showAlert && !id && (
            <Alert
              variant="info"
              onClose={() => setShowAlert(false)}
              dismissible
              className="d-flex align-items-center"
            >
              <BsInfoCircle className="mr-2" /> You are not logged in.
              <Alert.Link href="/login" className="mx-1">
                Log in
              </Alert.Link>
              or
              <Alert.Link href="/signup" className="mx-1">
                sign up
              </Alert.Link>{" "}
              to save your calculations.
            </Alert>
          )}
          {/* Main dashboard */}
          <Row>
            {!id && (
              <Col md={4}>
                <StyledCard $main>
                  <Calculator onAdd={addReceipt} ref={calculatorRef} />
                </StyledCard>
              </Col>
            )}
            <Col md={!id && 8}>
              <StyledCard $main className="pb-3">
                <ReceiptsTable
                  receipts={receipts}
                  onDelete={deleteReceipt}
                  onEdit={editReceipt}
                  calculationId={id}
                />
              </StyledCard>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default Home;
