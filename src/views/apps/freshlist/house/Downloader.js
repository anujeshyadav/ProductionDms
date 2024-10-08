import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "../../../../assets/img/profile/pages/logomain.png";
import Papa from "papaparse";

import * as XLSX from "xlsx";

export const exportDataToPDF = async (csvData, Heading) => {
  try {
    const parsedData = await parseCsv(csvData, Heading);
    generatePDF(parsedData, Heading);
  } catch (error) {
    console.error("Error parsing CSV:", error);
  }
};
const parseCsv = (csvData, Heading) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data && result.data.length > 0) {
          result.data.forEach((ele) => {
            // if (!!ele?.Actions) {
            delete ele?.Actions;
            // }
          });
          resolve(result.data);
        } else {
          reject(new Error("No data found in the CSV"));
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
const generatePDF = (parsedData, Heading) => {
  let pdfsize = [Object.keys(parsedData[0])][0].length;
  let size = pdfsize > 15 ? "a1" : pdfsize < 14 > 10 ? "a3" : "a4";

  const doc = new jsPDF("landscape", "mm", size, false);
  doc.setTextColor(5, 87, 97);
  const tableData = parsedData.map((row) => Object.values(row));
  doc.addImage(Logo, "JPEG", 10, 10, 50, 30);
  let date = new Date();
  doc.setCreationDate(date);
  doc.text(`${Heading}`, 14, 51);
  doc.autoTable({
    head: [Object.keys(parsedData[0])],
    body: tableData,
    startY: 60,
  });

  doc.save(`${Heading}.pdf`);
};

// csv to Excel

export const convertDataCSVtoExcel = (CsvData, Heading, rowData) => {
  Papa.parse(CsvData, {
    complete: (result) => {
      const ws = XLSX.utils.json_to_sheet(result.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, Heading);
      const excelType = "xls";
      XLSX.writeFile(wb, `${Heading}.${excelType}`);
    },
  });
};
export const exportDataToExcel = async (CsvData, Heading, rowData) => {
  const blob = await convertCsvToExcel(CsvData, Heading, rowData);
  downloadExcelFile(blob, Heading);
};
// export const exportDataToExcel = async (CsvData, Heading, rowData) => {
//   const ws = XLSX.utils.json_to_sheet(rowData);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, Heading);
//   const excelType = "xls";
//   XLSX.writeFile(wb, `ProductList.${excelType}`);
// };

const convertCsvToExcel = (csvData, Heading, data) => {
  return new Promise((resolve) => {
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (result) {
        const worksheet = XLSX.utils.json_to_sheet(result.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        resolve(blob);
      },
    });
  });
};
const downloadExcelFile = (blob, Heading) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${Heading}.xlsx`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

export const HandleDataSampleDownload = (rowData, CsvData) => {
  let headings;
  let maxKeys = 0;
  let elementWithMaxKeys = null;
  for (const element of rowData) {
    const numKeys = Object.keys(element).length; // Get the number of keys in the current element
    if (numKeys > maxKeys) {
      maxKeys = numKeys; // Update the maximum number of keys
      elementWithMaxKeys = element; // Update the element with maximum keys
    }
  }
  let findheading = Object.keys(elementWithMaxKeys);
  let index = findheading.indexOf("_id");
  if (index > -1) {
    findheading.splice(index, 1);
  }
  let index1 = findheading.indexOf("__v");
  if (index1 > -1) {
    findheading.splice(index1, 1);
  }
  headings = findheading?.map((ele) => {
    return {
      headerName: ele,
      field: ele,
      filter: true,
      sortable: true,
    };
  });

  let CCvData = headings?.map((ele, i) => {
    return ele?.field;
  });

  const formattedHeaders = CCvData.join(",");

  let myrow = CsvData?.slice();

  const rows = CsvData.split("\n");
  rows?.splice(0, 1, formattedHeaders);
  const headers = rows[0].split(",");
  let mydata = rows.join(",");
  // Extract headers from the first row
  Papa.parse(mydata, {
    complete: (result) => {
      const ws = XLSX.utils.json_to_sheet(result.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const excelType = "xlsx";
      XLSX.writeFile(wb, `CreateUserSample.${excelType}`);
    },
  });
};
export const convertDataCsvToXml = async (CsvData, Heading) => {
  Papa.parse(CsvData, {
    complete: (result) => {
      const rows = result.data;
      let xmlString = "<root>\n";
      rows.forEach((row) => {
        xmlString += "  <row>\n";
        row.forEach((cell, index) => {
          xmlString += `    <field${index + 1}>${cell}</field${index + 1}>\n`;
        });
        xmlString += "  </row>\n";
      });
      xmlString += "</root>";
      const blob = new Blob([xmlString], { type: "text/xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${Heading}.xml`;
      link.click();
    },
  });
};
