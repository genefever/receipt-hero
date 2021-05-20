import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const cellEdit = cellEditFactory({
  mode: "click",
});

const pagination = paginationFactory({
  hideSizePerPage: true,
  sizePerPage: 10,
});

const columns = [
  {
    dataField: "id",
    text: "ID",
    type: "number",
    sort: true,
  },
  {
    dataField: "purchaseDate",
    text: "Purchase Date",
    type: "date",
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
  },
  {
    dataField: "storeName",
    text: "Store Name",
    sort: true,
  },
  {
    dataField: "buyer",
    text: "Buyer",
    sort: true,
    editor: {
      type: Type.SELECT,
      options: [
        // TODO: Figure out how to change numbers to "Me" or "Other".
        { value: 1, label: "Me" },
        { value: 2, label: "Other" },
      ],
    },
  },
  {
    dataField: "total",
    text: "Receipt Total",
    type: "number",
  },
  {
    dataField: "balanceOwed",
    text: "Balance Owed",
    type: "number",
  },
];

function Table(props) {
  return (
    <BootstrapTable
      keyField="id"
      bootstrap4
      data={props.receipts}
      columns={columns}
      pagination={pagination}
      cellEdit={cellEdit}
    />
  );
}

export default Table;
