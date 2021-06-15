import React, { useState, useRef, useContext, useEffect, useMemo } from "react";
import Calculator from "../components/Calculator";
import ReceiptsTable from "../components/ReceiptsTable";
import { StyledButton } from "../components/Button";
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
  const {
    userObject,
    loadingUserObject,
    getAuthenticatedUserObject,
  } = useContext(UserContext);

  const defaultCalculationObject = useMemo(() => {
    return {
      title: "Untitled",
      _id: null,
      receipts: [],
      people: [
        {
          idx: 0,
          name: "You",
          totalAmount: 0,
        },
        {
          idx: 1,
          name: "User 2",
          totalAmount: 0,
        },
      ],
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
    async function getCalculationObject(id) {
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
      getCalculationObject(id);

      // Check if URL contains 'edit'
      if (window.location.href.indexOf("edit") !== -1) {
        if (!loadingUserObject) {
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
        setEditMode(false);
      }
    } else {
      // Show a brand new calculate page.
      setCalculationObject(defaultCalculationObject);
      setEditMode(true);
    }
  }, [
    id,
    history,
    userObject,
    loadingUserObject,
    defaultCalculationObject,
    history.location,
  ]);

  // Adds a new receipt to the calculation's receipts list.
  function addReceipt(newReceipt) {
    setCalculationObject((prevCalcObj) => {
      const prevReceipts = prevCalcObj.receipts;
      newReceipt.total = parseFloat(newReceipt.total).toFixed(2);
      newReceipt.id = prevReceipts.length + 1;

      // Add the new receipt's people amount to the calc object's people's totalAmount.
      const updatedPeople = [...prevCalcObj.people].map((person) => {
        return {
          ...person,
          totalAmount:
            person.totalAmount + newReceipt.people[person.idx].amount,
        };
      });

      return {
        ...prevCalcObj,
        receipts: [...prevReceipts, newReceipt],
        people: updatedPeople,
      };
    });
  }

  // Edits a receipt in the receipts list with updated balance calculation.
  function editReceipt(newReceipt) {
    setCalculationObject((prevCalcObj) => {
      let updatedPeople = [...prevCalcObj.people];

      const updatedReceipts = [...prevCalcObj.receipts].map((receipt) => {
        if (receipt.id !== newReceipt.id) {
          return receipt;
        }

        // Remove from totalAmount for each person the old receipt value.
        updatedPeople = updatedPeople.map((person) => {
          return {
            ...person,
            totalAmount: person.totalAmount - receipt.people[person.idx].amount,
          };
        });

        const updatedCalculations = calculatorRef.current.calculateBalanceOwed(
          newReceipt
        );

        return {
          ...newReceipt,
          ...updatedCalculations,
        };
      });

      // Add to totalAmount for each person the new receipt value.
      updatedPeople = updatedPeople.map((person) => {
        return {
          ...person,
          totalAmount:
            person.totalAmount + newReceipt.people[person.idx].amount,
        };
      });

      return {
        ...prevCalcObj,
        receipts: updatedReceipts,
        people: updatedPeople,
      };
    });
  }

  // Deletes a receipt from the calculation's receipts list.
  function deleteReceipt(idToDelete) {
    setCalculationObject((prevCalcObj) => {
      let updatedPeople = [...prevCalcObj.people];

      const updatedReceipts = [...prevCalcObj.receipts].filter((receipt) => {
        if (idToDelete === receipt.id) {
          // Update the totalAmount for each person.
          updatedPeople = updatedPeople.map((person) => {
            return {
              ...person,
              totalAmount:
                person.totalAmount - receipt.people[person.idx].amount,
            };
          });
        }

        return idToDelete !== receipt.id;
      });

      return {
        ...prevCalcObj,
        receipts: updatedReceipts,
        people: updatedPeople,
      };
    });
  }

  function editCalculationTitle(event) {
    const value = event.target.value ? event.target.value : "Untitled";
    setCalculationObject((prevCalcObj) => {
      return { ...prevCalcObj, title: value };
    });
  }

  // TODO: handle error
  async function createCalculationObject() {
    try {
      await api.createCalculation(calculationObject);
      // Refresh the userObject when making changes to it.
      await getAuthenticatedUserObject();
      history.push(`/user/${userObject._id}`);
    } catch (err) {
      console.log(err);
    }
  }

  // TODO: handle error
  async function updateCalculationObject() {
    try {
      await api.updateCalculation(calculationObject);
      // Refresh the userObject when making changes to it.
      await getAuthenticatedUserObject();
      history.push(`/user/${userObject._id}`);
    } catch (err) {
      console.log(err);
    }
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
                  <Calculator
                    onAdd={addReceipt}
                    ref={calculatorRef}
                    calculationObject={calculationObject}
                  />
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

                {userObject && editMode && (
                  <StyledButton
                    $primary
                    size="lg"
                    onClick={
                      id ? updateCalculationObject : createCalculationObject
                    }
                  >
                    {id ? "Save" : "Publish"}
                  </StyledButton>
                )}
              </StyledCard>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default Home;
