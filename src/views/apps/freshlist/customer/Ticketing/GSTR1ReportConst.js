export const B2B = [
  {
    headerName: "UID",
    valueGetter: "node.rowIndex + 1",
    field: "node.rowIndex + 1",
    width: 80,
    filter: true,
  },
  {
    headerName: "GSTIN",
    field: "order.partyId.gstNumber",
    filter: true,
    width: 250,
  },
  {
    headerName: "Party Name",
    field: "order.partyId.CompanyName",
    filter: true,
    resizable: true,
    width: 210,
  },
  {
    headerName: "Invoice Date",
    field: "order.updatedAt",
    filter: true,
    width: 180,
  },

  {
    headerName: "Invoice Value",
    field: "grandTotal",
    filter: true,
    width: 200,
  },
  {
    headerName: "Place of Supply",
    field: "order.partyId.address1",
    filter: true,
    width: 240,
  },
  {
    headerName: "Place of Supply",
    field: "order.partyId.address2",
    filter: true,
    width: 240,
  },
  {
    headerName: "Reverse Charges",
    field: "invoiceId",
    filter: true,
    width: 200,
  },
  {
    headerName: "Invoice Type",
    field: "invoiceId",
    filter: true,
    width: 200,
  },
  {
    headerName: "E-commerce GSTIN",
    field: "invoiceId",
    filter: true,
    width: 200,
  },
  {
    headerName: "Rate",
    field: "gstPercentage",
    filter: true,
    width: 200,
  },
  {
    headerName: "Taxable Value",
    field: "taxableAmount",
    filter: true,
    width: 250,
  },
  {
    headerName: "SGST",
    field: "sgstRate",
    filter: true,

    width: 180,
  },
  {
    headerName: "CGST",
    field: "cgstRate",
    filter: true,
    width: 180,
  },
  {
    headerName: "IGST",
    field: "igstRate",
    filter: true,
    width: 180,
  },

  {
    headerName: "Grand Total",
    field: "grandTotal",
    filter: true,
    width: 150,
  },
];
export const B2CL = [
  {
    headerName: "INVOICE No.",
    field: "invoiceId",
    filter: true,
    width: 200,
  },
  {
    headerName: "Invoice Date",
    field: "updatedAt",
    filter: true,
    width: 180,
  },

  {
    headerName: "Invoice Value",
    field: "amount",
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
    headerName: "Grand Total",
    field: "grandTotal",
    filter: true,
    width: 150,
  },
];
export const B2CS = [
  {
    headerName: "UID",
    valueGetter: "node.rowIndex + 1",
    field: "node.rowIndex + 1",
    width: 80,
    filter: true,
  },

  {
    headerName: "Place of Supply",
    field: "invoiceId",
    filter: true,
    width: 200,
  },
  {
    headerName: "INVOICE NO.",
    field: "invoiceId",
    filter: true,
    width: 200,
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
    headerName: "Grand Total",
    field: "grandTotal",
    filter: true,
    width: 150,
  },
];
export const CDNR = [
  {
    headerName: "UID",
    valueGetter: "node.rowIndex + 1",
    field: "node.rowIndex + 1",
    width: 80,
    filter: true,
  },

  {
    headerName: "Party Name",
    field: "partyId.CompanyName",
    filter: true,
    resizable: true,
    width: 210,
  },
  {
    headerName: "GSTIN/UIN of Recipient",
    field: "partyId.gstNumber",
    filter: true,
    width: 250,
  },
  {
    headerName: "Note Number",
    field: "_id",
    filter: true,
    width: 250,
  },
  {
    headerName: "Note date",
    field: "updatedAt",
    filter: true,
    width: 250,
  },
  {
    headerName: "Note Value",
    field: "totalAmount",
    filter: true,
    width: 250,
  },

  //   {
  //     headerName: "SGST",
  //     field: "updatedAt",
  //     filter: true,
  //   },
  //   {
  //     headerName: "CGST",
  //     field: "updatedAt",
  //     filter: true,
  //     width: 180,
  //   },
  //   {
  //     headerName: "IGST",
  //     field: "updatedAt",
  //     filter: true,
  //     width: 180,
  //   },
  //   {
  //     headerName: "Amount",
  //     field: "amount",
  //     filter: true,
  //     width: 150,
  //   },
  //   {
  //     headerName: "RoundOff",
  //     field: "roundOff",
  //     filter: true,
  //     width: 150,
  //   },
  {
    headerName: "Grand Total",
    field: "totalAmount",
    filter: true,
    width: 150,
  },
];
export const CDNUR = [
  {
    headerName: "UID",
    valueGetter: "node.rowIndex + 1",
    field: "node.rowIndex + 1",
    width: 80,
    filter: true,
  },

  {
    headerName: "Party Name",
    field: "partyId.CompanyName",
    filter: true,
    resizable: true,
    width: 210,
  },
  {
    headerName: "GSTIN/UIN of Recipient",
    field: "partyId.gstNumber",
    filter: true,
    width: 250,
  },
  {
    headerName: "Note Number",
    field: "_id",
    filter: true,
    width: 250,
  },
  {
    headerName: "Note date",
    field: "updatedAt",
    filter: true,
    width: 250,
  },
  {
    headerName: "Note Value",
    field: "totalAmount",
    filter: true,
    width: 250,
  },

  //   {
  //     headerName: "SGST",
  //     field: "updatedAt",
  //     filter: true,
  //   },
  //   {
  //     headerName: "CGST",
  //     field: "updatedAt",
  //     filter: true,
  //     width: 180,
  //   },
  //   {
  //     headerName: "IGST",
  //     field: "updatedAt",
  //     filter: true,
  //     width: 180,
  //   },
  //   {
  //     headerName: "Amount",
  //     field: "amount",
  //     filter: true,
  //     width: 150,
  //   },
  //   {
  //     headerName: "RoundOff",
  //     field: "roundOff",
  //     filter: true,
  //     width: 150,
  //   },
  {
    headerName: "Grand Total",
    field: "totalAmount",
    filter: true,
    width: 150,
  },
];
export const CONSOLIDATED = [
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
    headerName: "Invoice date",
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
    headerName: "GSTIN/UIN of Recipient",
    field: "partyId.gstNumber",
    filter: true,
    width: 250,
  },
  {
    headerName: "Reverse Charge",
    field: "address",
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
    headerName: "Grand Total",
    field: "grandTotal",
    filter: true,
    width: 150,
  },
];
export const HSN = [
  {
    headerName: "UID",
    valueGetter: "node.rowIndex + 1",
    field: "node.rowIndex + 1",
    width: 80,
    filter: true,
  },

  {
    headerName: "Description",
    field: "Product_Desc",
    filter: true,
    width: 180,
  },
  {
    headerName: "HSN",
    field: "HSN_Code",
    filter: true,
    width: 180,
  },
  {
    headerName: "Price",
    field: "Product_MRP",
    filter: true,
    width: 150,
  },
  {
    headerName: "SGST",
    field: "updatedAt",
    filter: true,
    width: 180,
  },
  {
    headerName: "CGST",
    field: "updatedAt",
    filter: true,
    width: 180,
  },
  {
    headerName: "IGST",
    field: "updatedAt",
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
    headerName: "Grand Total",
    field: "grandTotal",
    filter: true,
    width: 150,
  },
];
