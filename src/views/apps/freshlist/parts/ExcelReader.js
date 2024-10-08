import React from "react";
import XLSX from "xlsx";

function ExcelReader() {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        console.log(workbook);
        // Assuming you have a single sheet, access it by name (e.g., 'Sheet1')
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // The first row of jsonData contains column headings
        const headings = jsonData[0];

        // The rest of the rows contain data
        const dataRows = jsonData.slice(1);

        // Now you can work with the headings and data
        console.log("Headings:", headings);
        console.log("Data:", dataRows);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <div>
        <input type="file" onChange={handleFileUpload} />

        <h3>Headings:</h3>
        {/* <ul>
          {headings &&
            headings.map((heading, index) => <li key={index}>{heading}</li>)}
        </ul> */}

        <h3>Data:</h3>
        <table>
          <thead>
            {/* <tr>
              {headings &&
                headings.map((heading, index) => (
                  <th key={index}>{heading}</th>
                ))}
            </tr> */}
          </thead>
          {/* <tbody>
            {dataRows &&
              dataRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
          </tbody> */}
        </table>
      </div>
    </div>
  );
}

export default ExcelReader;
