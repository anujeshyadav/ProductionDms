export const B2B = [
  {
    headerName: "UID",
    valueGetter: "node.rowIndex + 1",
    field: "node.rowIndex + 1",
    width: 80,
    filter: true,
  },

  {
    headerName: "Invoice Number",
    field: "invoiceId",
    filter: true,
    width: 200,
  },
  {
    headerName: "Sales Date",
    field: "updatedAt",
    filter: true,
    width: 180,
  },
  {
    headerName: "Party Name",
    field: "partyId.CompanyName",
    filter: true,
    resizable: true,
    width: 210,
  },
  {
    headerName: "GST Number",
    field: "partyId.gstNumber",
    filter: true,
    width: 250,
  },

  {
    headerName: "SGST",
    field: "sgstTotal",
    filter: true,

    width: 180,
  },
  {
    headerName: "CGST",
    field: "cgstTotal",
    filter: true,
    width: 180,
  },
  {
    headerName: "IGST",
    field: "igstTotal",
    filter: true,
    width: 180,
  },
  {
    headerName: "Amount",
    field: "amount",
    filter: true,
    width: 150,
  },
  {
    headerName: "RoundOff",
    field: "roundOff",
    filter: true,
    width: 150,
  },
  {
    headerName: "Grand Total",
    field: "grandTotal",
    filter: true,
    width: 150,
  },
];
