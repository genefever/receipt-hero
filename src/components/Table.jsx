import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import { FaTrashAlt } from "react-icons/fa";
import { StyledButton } from "../components/Button";

function Table(props) {
  const cellStyle = {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const cellEdit = cellEditFactory({
    mode: "click",
  });

  const pagination = paginationFactory({
    hideSizePerPage: true,
    sizePerPage: 10,
  });

  const columns = [
    {
      dataField: "purchaseDate",
      text: "Purchase Date",
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
      editor: {
        type: Type.DATE,
      },
      // headerStyle: (colum, colIndex) => {
      //   return { width: "110px" };
      // },
    },
    {
      dataField: "storeName",
      text: "Store Name",
      style: cellStyle,
      sort: true,
      // headerStyle: (colum, colIndex) => {
      //   return { width: "110px" };
      // },
    },
    {
      dataField: "buyer",
      text: "Buyer",
      style: cellStyle,
      sort: true,
      editor: {
        type: Type.SELECT,
        options: [
          { value: 1, label: "Me" },
          { value: 2, label: "Other" },
        ],
      },
      formatter: (cellContent) => {
        return cellContent === 1 ? "Me" : "Other";
      },
      // headerStyle: (colum, colIndex) => {
      //   return { width: "90px" };
      // },
    },
    {
      dataField: "total",
      text: "Receipt Total",
      type: "number",
      sort: true,
      style: cellStyle,
      formatter: (cellContent) => {
        return "$ " + cellContent;
      },
      // headerStyle: (colum, colIndex) => {
      //   return { width: "110px" };
      // },
    },
    {
      dataField: "balanceOwed",
      text: "Balance Owed",
      type: "number",
      sort: true,
      style: cellStyle,
      formatter: (cellContent) => {
        return "$ " + cellContent;
      },
      // headerStyle: (colum, colIndex) => {
      //   return { width: "110px" };
      // },
    },
    {
      dataField: "id",
      text: "",
      align: "center",
      editable: false,
      formatter: (cellContent, row) => {
        return (
          <StyledButton
            $google
            className="btn-sm"
            onClick={() => props.onDelete(row.id)}
          >
            <FaTrashAlt />
          </StyledButton>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: "60px" };
      },
    },
  ];

  return (
    <BootstrapTable
      keyField="id"
      bootstrap4
      data={props.receipts}
      columns={columns}
      pagination={pagination}
      cellEdit={cellEdit}
      hover
    />
  );
}

export default Table;
