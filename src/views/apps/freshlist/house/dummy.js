import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const MyComponent = ({ rowData }) => {
  //   const [data, setData] = useState(rowData);
  const exportToExcel = (data, fileName) => {
    // Convert JSON array to worksheet
    data?.forEach(ele => {
      delete ele?.Product_image;
      delete ele?.createdAt;
      delete ele?.created_by;
      delete ele?.updatedAt;
      delete ele?.status;
      delete ele?.warehouse;
      delete ele?.__v;
    });
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${fileName}.xlsx`);
  };
  const handleExport = () => {
    exportToExcel(rowData, "MyData");
  };

  return (
    <div>
      <button onClick={handleExport}>Export to Excel</button>
      {/* Your other component code here */}
    </div>
  );
};

export default MyComponent;
