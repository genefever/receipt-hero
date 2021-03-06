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
import { IoWarningOutline } from "react-icons/io5";
import { UserContext } from "../UserContext";
import { useHistory, useParams } from "react-router-dom";
import * as api from "../api";
import { useStateCallback, usePrevious } from "../hooks";
import { v1 as uuidv1 } from "uuid";

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
          name: "Me",
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

  const [calculationObject, setCalculationObject] = useStateCallback(
    defaultCalculationObject
  );
  const prevState = usePrevious({ calculationObject });
  const [showAlert, setShowAlert] = useState(true);
  const [editMode, setEditMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
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
            userObject?.calculations?.some(
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
    history.location, // This tracks URL name change (i.e. from edit to not edit)
    setCalculationObject,
  ]);

  // Adds a new receipt to the calculation's receipts list.
  function addReceipt(newReceipt) {
    setCalculationObject(
      (prevCalcObj) => {
        const prevReceipts = prevCalcObj.receipts;
        newReceipt.total = parseFloat(newReceipt.total).toFixed(2);
        newReceipt.id = uuidv1(); // Creates an RFC version 1 (timestamp) UUID.

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
      },
      (latestCalcObjectState) => {
        if (id) updateCalculationObject(latestCalcObjectState);
      }
    );
  }

  // Edits a receipt in the receipts list with updated balance calculation.
  function editReceipt(newReceipt) {
    setCalculationObject(
      (prevCalcObj) => {
        let updatedPeople = [...prevCalcObj.people];

        const updatedReceipts = [...prevCalcObj.receipts].map((receipt) => {
          if (receipt.id !== newReceipt.id) {
            return receipt;
          }

          // Remove from totalAmount for each person the old receipt value.
          updatedPeople = updatedPeople.map((person) => {
            return {
              ...person,
              totalAmount:
                person.totalAmount - receipt.people[person.idx].amount,
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
      },
      (latestCalcObjectState) => {
        if (id) updateCalculationObject(latestCalcObjectState);
      }
    );
  }

  // Deletes a receipt from the calculation's receipts list.
  function deleteReceipt(idToDelete) {
    setCalculationObject(
      (prevCalcObj) => {
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
      },
      (latestCalcObjectState) => {
        if (id) updateCalculationObject(latestCalcObjectState);
      }
    );
  }

  // Sets the calculationObject's title.
  function editCalculationTitle(event) {
    const value = event.target.value ? event.target.value : "Untitled";

    setCalculationObject((prevCalcObj) => {
      return { ...prevCalcObj, title: value };
    });
  }

  // TODO needs to update receipts people
  function updateCalculationPeople(updatedPeople) {
    setCalculationObject((prevCalcObj) => {
      return {
        ...prevCalcObj,
        people: updatedPeople,
      };
    });
  }

  // Called when a calculationObject person's name changes.
  // function editPersonName(event, personIdx) {
  //   const value = event.target.value;
  //
  //   setCalculationObject(
  //     (prevCalcObj) => {
  //       // Change the name of the person in calculationObject.people array.
  //       let updatedPeople = [...prevCalcObj.people];
  //       updatedPeople[personIdx].name = value;
  //
  //       // Change every occurence of the name in calculationObject's receipts.people.
  //       const updatedReceipts = [...prevCalcObj.receipts].map((receipt) => {
  //         let updatedReceiptPeople = [...receipt.people];
  //         let updatedReceiptBuyer = receipt.buyer;
  //
  //         updatedReceiptPeople[personIdx].name = value;
  //
  //         // Update the buyer's name if need be.
  //         if (updatedReceiptPeople[personIdx].isBuyer) {
  //           updatedReceiptBuyer = value;
  //         }
  //
  //         return {
  //           ...receipt,
  //           people: updatedReceiptPeople,
  //           buyer: updatedReceiptBuyer,
  //         };
  //       });
  //
  //       return {
  //         ...prevCalcObj,
  //         people: updatedPeople,
  //         receipts: updatedReceipts,
  //       };
  //     },
  //     (latestCalcObjectState) => {
  //       if (id) updateCalculationObject(latestCalcObjectState);
  //     }
  //   );
  // }

  // Creates and saves a calculation object for the user.
  async function createCalculationObject() {
    try {
      await api.createCalculation(calculationObject);
      // Refresh the userObject when making changes to it.
      await getAuthenticatedUserObject();
      history.push(`/user/${userObject._id}`);
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  }

  // Updates the user's calculation object.
  async function updateCalculationObject(latestCalcObjectState) {
    try {
      await api.updateCalculation(latestCalcObjectState);
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  }

  // Sets the current calculation object's state in the DB.
  // Called when user is done editing the calculation title.
  function saveCurrentCalculationObject() {
    // Only save to the database if the calcObject state actually got updated.
    if (
      prevState &&
      JSON.stringify(prevState.calculationObject) !==
        JSON.stringify(calculationObject)
    ) {
      setCalculationObject(
        (prevCalcObj) => {
          return { ...prevCalcObj };
        },
        (latestCalcObjectState) => {
          if (id) updateCalculationObject(latestCalcObjectState);
        }
      );
    }
  }

  return (
    <>
      {loadingUserObject ? (
        <StyledSpinner />
      ) : (
        <>
          {/* Alert message - login/signup */}
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

          {errorMessage && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setErrorMessage(null)}
              className="d-flex align-items-center"
            >
              <IoWarningOutline className="mr-2" />
              {errorMessage}
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
                  onUpdatePeople={updateCalculationPeople}
                  onSaveCalculationObject={saveCurrentCalculationObject}
                />

                {userObject && !id && (
                  <StyledButton
                    $primary
                    size="lg"
                    onClick={createCalculationObject}
                  >
                    Publish
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
