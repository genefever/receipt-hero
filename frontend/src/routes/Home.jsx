import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
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
  const { userObject, loadingUserObject } = useContext(UserContext);
  const defaultCalculationObject = useMemo(() => {
    return {
      title: "Untitled",
      _id: null,
      receipts: [],
    };
  }, []);
  const [calculationObject, setCalculationObject] = useState(
    defaultCalculationObject
  );
  const [showAlert, setShowAlert] = useState(true);
  const [editMode, setEditMode] = useState(true);
  const calculatorRef = useRef(); // Used to calculate balance owed
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    async function getcalculationObjectect(id) {
      try {
        const res = await api.getCalculation(id);
        if (res.data) {
          setCalculationObject(res.data);
        }
      } catch (err) {
        history.push("/not-found");
      }
    }

    if (id) {
      // Check if URL contains 'edit'
      if (window.location.href.indexOf("edit") > -1) {
        if (!loadingUserObject) {
          getcalculationObjectect(id);

          // If the user is logged in and the calculation id is owned by user,
          // allow the user to edit.
          if (
            userObject &&
            userObject.calculations.some(
              (calculationId) => calculationId === id
            )
          ) {
            setEditMode(true);
          } else {
            // Else redirect to login page.
            history.push("/login");
          }
        }
      } else {
        // Show a created calculation page.
        getcalculationObjectect(id);
        setEditMode(false);
      }
    } else {
      // Show a brand new calculate page.
      setCalculationObject(defaultCalculationObject);
      setEditMode(true);
    }
  }, [id, history, userObject, loadingUserObject, defaultCalculationObject]);

  // Adds a new receipt to the calculation's receipts list.
  function addReceipt(newReceipt) {
    setCalculationObject((prevValue) => {
      const prevReceipts = prevValue.receipts;
      newReceipt.total = parseFloat(newReceipt.total).toFixed(2);
      newReceipt.id = prevReceipts.length + 1;

      return { ...prevValue, receipts: [...prevReceipts, newReceipt] };
    });
  }

  // Edits a receipt in the receipts list with updated balance calculation.
  function editReceipt(newReceipt) {
    setCalculationObject((prevValue) => {
      const prevReceipts = prevValue.receipts;
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

      return { ...prevValue, receipts: updatedReceipts };
    });
  }

  // Deletes a receipt from the calculation's receipts list.
  function deleteReceipt(idToDelete) {
    setCalculationObject((prevValue) => {
      const prevReceipts = prevValue.receipts;
      const updatedReceipts = prevReceipts.filter((receipt) => {
        return idToDelete !== receipt.id;
      });

      return { ...prevValue, receipts: updatedReceipts };
    });
  }

  function editCalculationTitle(event) {
    const value = event.target.value ? event.target.value : "Untitled";
    setCalculationObject((prevValue) => {
      return { ...prevValue, title: value };
    });
  }

  return (
    <>
      {/* Alert message - login/signup */}
      {loadingUserObject ? (
        <StyledSpinner />
      ) : (
        <>
          {/* Show alert only when user is not logged and is in the homepage. */}
          {!userObject && showAlert && editMode && (
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
            {editMode && (
              <Col md={4}>
                <StyledCard $main>
                  <Calculator onAdd={addReceipt} ref={calculatorRef} />
                </StyledCard>
              </Col>
            )}
            <Col md={editMode && 8}>
              <StyledCard $main className="pb-3">
                <ReceiptsTable
                  calculationObject={calculationObject}
                  onDeleteReceipt={deleteReceipt}
                  onEditReceipt={editReceipt}
                  onEditCalculationTitle={editCalculationTitle}
                  editMode={editMode}
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
