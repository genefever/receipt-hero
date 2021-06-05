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

function User(props) {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    async function getUserObject(id) {
      const res = await api.getUserObject(id);

      if (res.data) {
        setUserProfile(res.data);
      }
    }

    getUserObject(id);
  }, [id]);

  const { SearchBar } = Search;
  const cellStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  // const data = [{ dateCreated: "2021-05-10" }];
  const data = [];

  const columns = [
    {
      dataField: "dateCreated",
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
    { dataField: "calculationName", text: "Name", sort: true },
  ];

  return (
    <>
      <StyledCard $main>
        <ToolkitProvider
          keyField="purchaseDate"
          bootstrap4={true}
          data={data}
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
    </>
  );
}

export default User;
