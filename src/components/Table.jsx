import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";

const products = ["apple", "pear", "banana"];
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
    />
  );
}

export default Table;
