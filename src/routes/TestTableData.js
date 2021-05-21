export const TestTableData = [
  {
    balanceOwed: "5.00",
    buyer: 1,
    id: 1,
    otherDeduction: 5,
    otherDeductionsList: [],
    personalDeduction: 3,
    personalDeductionsList: [],
    purchaseDate: "2021-05-20",
    storeName: "abc",
    total: "10.00",
  },
  {
    balanceOwed: "3.00",
    buyer: 2,
    id: 2,
    otherDeduction: 4,
    otherDeductionsList: [],
    personalDeduction: 3,
    personalDeductionsList: [],
    purchaseDate: "2021-05-20",
    storeName: "def",
    total: "12.00",
  },
  {
    // TODO: Math for splitting receipt is wrong. balanceOwed should be 5.00.
    balanceOwed: "4.50",
    buyer: 3,
    id: 3,
    otherDeduction: 0,
    otherDeductionsList: [3],
    personalDeduction: 0,
    personalDeductionsList: [2],
    purchaseDate: "2021-05-03",
    storeName: "efg",
    total: "9.00",
  },
];