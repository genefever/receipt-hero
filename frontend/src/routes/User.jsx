import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import { StyledCard } from "../components/Card";
import inkpot from "../assets/inkpot.svg";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as api from "../api";
import Spinner from "react-bootstrap/Spinner";
import { useHistory } from "react-router-dom";
import { StyledButton } from "../components/Button";

function User(props) {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getUserObject(id) {
      try {
        const res = await api.getUser(id);
        if (res.data) {
          setUserProfile(res.data);
        }
        setLoading(false);
      } catch (err) {
        history.push("/not-found");
      }
    }

    getUserObject(id);
  }, [id, history]);

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
  ];

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-75">
          <Spinner animation="grow" variant="success" />
        </div>
      ) : (
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
                <h4 className="mb-4">{userProfile.firstName}'s Calculations</h4>
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
      )}
    </>
  );
}

export default User;
