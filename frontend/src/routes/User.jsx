import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import inkpot from "../assets/inkpot.svg";
import { Link, useParams, useHistory } from "react-router-dom";
import { StyledButton, StyledIconButtonSpan } from "../components/Button";
import Alert from "react-bootstrap/Alert";
import { StyledCard } from "../components/Card";
import { StyledSpinner } from "../components/Spinner";
import { FaTrashAlt } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { StyledModal } from "../components/Modal";
import { useDocumentTitle } from "../hooks";
import * as api from "../api";

function User(props) {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState();
  const [documentTitle, setDocumentTitle] = useState(
    "Calculations - Receipt Hero"
  );
  const [calculationIdToDelete, setCalculationIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const history = useHistory();

  useEffect(() => {
    async function getUserObject(id) {
      try {
        const res = await api.getUser(id);
        if (res.data) {
          setUserProfile(res.data);
          setDocumentTitle(
            `${res.data.firstName}'s Calculations - Receipt Hero`
          );
        }
        setLoading(false);
      } catch (err) {
        history.push("/not-found");
      }
    }

    getUserObject(id);
  }, [id, history]);

  // Set the document title
  useDocumentTitle(documentTitle);

  const handleCloseModal = () => {
    setCalculationIdToDelete(null);
    setShowModal(false);
  };

  const handleShowModal = (calculationId = null) => {
    if (calculationId) setCalculationIdToDelete(calculationId);
    setShowModal(true);
  };

  const handleEditPressed = (id) => {
    history.push(`/calculation/${id}/edit`);
  };

  const deleteCalculationObject = async () => {
    if (calculationIdToDelete) {
      // State, before deleting anything.
      const currentCalculations = userProfile.calculations;

      // Remove deleted item from state.
      setUserProfile((prevValue) => {
        return {
          ...prevValue,
          calculations: currentCalculations.filter(
            (calculation) => calculation._id !== calculationIdToDelete
          ),
        };
      });

      try {
        // Fire delete API.
        await api.deleteCalculation(calculationIdToDelete);
      } catch (err) {
        // Something went wrong. Revert back to original state.
        setUserProfile((prevValue) => {
          return {
            ...prevValue,
            calculations: currentCalculations,
          };
        });

        if (err.response?.data?.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Whoops! An unexpected error occurred.");
        }
      }
    }
  };

  const { SearchBar } = Search;
  const cellStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const columns = [
    { dataField: "_id", hidden: "true" },
    {
      dataField: "title",
      text: "Name",
      sort: true,
      formatter: (cell, row) => (
        <StyledButton className="py-0 px-0" variant="link">
          {cell}
        </StyledButton>
      ),
      events: {
        onClick: (e, column, columnIndex, row, rowIndex) => {
          history.push("/calculation/" + row._id);
        },
      },
    },
    {
      dataField: "createdAt",
      text: "Created",
      type: "date",
      style: cellStyle,
      sort: true,
      formatter: (cell) => {
        let dateObj = cell;
        if (typeof cell !== "object") {
          dateObj = new Date(cell);
        }
        return `${("0" + (dateObj.getUTCMonth() + 1)).slice(-2)}/${(
          "0" + dateObj.getUTCDate()
        ).slice(-2)}/${dateObj.getUTCFullYear()}`;
      },
    },
    {
      dataField: "deleteButton",
      text: "",
      isDummyField: true,
      editable: false,
      searchable: false,
      align: "right",
      style: {
        paddingRight: "1rem",
      },
      formatter: (cellContent, row) => {
        return (
          <>
            <StyledIconButtonSpan
              onClick={() => handleEditPressed(row._id)}
              className="mr-3"
            >
              <MdEdit />
            </StyledIconButtonSpan>
            <StyledIconButtonSpan
              $delete
              onClick={() => handleShowModal(row._id)}
            >
              <FaTrashAlt />
            </StyledIconButtonSpan>
          </>
        );
      },
    },
  ];

  return (
    <>
      {loading ? (
        <StyledSpinner />
      ) : (
        <>
          {/* Alert Error Message */}
          {errorMessage && (
            <Alert
              variant="danger"
              onClose={() => setErrorMessage(null)}
              className="d-flex align-items-center"
              dismissible
            >
              <IoWarningOutline className="mr-2" />
              {errorMessage}
            </Alert>
          )}

          <StyledCard $main>
            <ToolkitProvider
              keyField="_id"
              bootstrap4={true}
              data={userProfile.calculations}
              columns={columns}
              search
            >
              {(props) => (
                <div>
                  <h4 className="mb-4">
                    {userProfile.firstName}'s Calculations
                  </h4>
                  <div className="form-inline mb-3">
                    <div className="form-group">
                      <SearchBar
                        className="form-control-sm"
                        {...props.searchProps}
                      />
                    </div>
                  </div>

                  <BootstrapTable
                    {...props.baseProps}
                    bordered={false}
                    condensed
                    noDataIndication={() => (
                      <div>
                        <h4 className="mt-4">
                          {props.searchProps.searchText
                            ? "No records found."
                            : "You have no calculations."}
                        </h4>
                        {!props.searchProps.searchText && (
                          <Link to="/">
                            <span className="mt-3">Create your first one.</span>
                          </Link>
                        )}

                        <img
                          className="mx-auto d-block my-4"
                          src={inkpot}
                          width="270"
                          height="270"
                          alt="Create a new calculation."
                        />
                      </div>
                    )}
                  />
                </div>
              )}
            </ToolkitProvider>
          </StyledCard>

          <StyledModal show={showModal} onHide={handleCloseModal}>
            <StyledModal.Header closeButton>
              <StyledModal.Title>Confirm deletion</StyledModal.Title>
            </StyledModal.Header>

            <StyledModal.Body>
              <p>
                Are you sure you want to permanently delete this calculation?
              </p>
            </StyledModal.Body>

            <StyledModal.Footer>
              <StyledButton variant="secondary" onClick={handleCloseModal}>
                Cancel
              </StyledButton>
              <StyledButton
                variant="danger"
                onClick={() => {
                  deleteCalculationObject();
                  handleCloseModal();
                }}
              >
                Delete
              </StyledButton>
            </StyledModal.Footer>
          </StyledModal>
        </>
      )}
    </>
  );
}

export default User;
