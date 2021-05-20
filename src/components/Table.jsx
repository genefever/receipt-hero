import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

const products = [
  {
    id: 1,
    date: "12/01/2020",
    storeName: "Raley's",
    buyer: "Me",
    total: "$12.20",
    balanceDue: 5.0,
  },
];
const columns = [
  {
    dataField: "id",
    text: "ID",
  },
  {
    dataField: "date",
    text: "Purchase Date",
  },
  {
    dataField: "storeName",
    text: "Store Name",
  },
  {
    dataField: "buyer",
    text: "Buyer",
  },
  {
    dataField: "total",
    text: "Receipt Total",
  },
  {
    dataField: "balanceDue",
    text: "Balance Due",
  },
];

function Table() {
  return (
    <BootstrapTable
      keyField="id"
      bootstrap4
      data={products}
      columns={columns}
      pagination={paginationFactory()}
    />
  );
}

export default Table;
