import React, { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FaDownload } from "react-icons/fa";
import { Button } from "reactstrap";

const GenericPdfDownloader = ({ rootElementId, downloadFileName }) => {
  const [Loader, setLoader] = useState(false);
  const downloadPdfDocument = () => {
    setLoader(true);
    const input = document.getElementById(rootElementId);
    const canvas = document.createElement("canvas");
    debugger;
    canvas.width = input.scrollWidth; // Capture entire width
    canvas.height = input.scrollHeight + window.scrollY;
    html2canvas(input, { canvas, scale: 1 }).then((capturedCanvas) => {
      const imgData = capturedCanvas.toDataURL("image/png");
      const pdf = new jsPDF();

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight =
        (capturedCanvas.height * imgWidth) / capturedCanvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

      pdf.save(`${downloadFileName}.pdf`);
      setLoader(false);
    });
  };
  // const downloadPdfDocument = () => {
  //   const input = document.getElementById(rootElementId);

  //   // Set a delay before capturing the content

  //     const canvas = document.createElement("canvas");
  //     canvas.width = input.scrollWidth; // Capture entire width
  //     canvas.height = input.scrollHeight + window.scrollY; // Capture entire height

  //     html2canvas(input, { canvas, scale: 1 }) // Increase the scale (DPI)
  //       .then((capturedCanvas) => {
  //         const imgData = capturedCanvas.toDataURL("image/png");

  //         const pdf = new jsPDF();
  //         const imgWidth = pdf.internal.pageSize.getWidth();
  //         const imgHeight =
  //           (capturedCanvas.height * imgWidth) / capturedCanvas.width;

  //         let page = 1; // Initialize page number

  //         // Function to add a page to the PDF
  //         const addPageToPDF = () => {
  //           pdf.addPage();
  //           pdf.setPage(page);
  //           pdf.rect(5, 5, imgWidth - 10, imgHeight - 15);
  //           pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
  //           pdf.text(`Page ${page}`, imgWidth / 2, imgHeight - 10, {
  //             align: "center",
  //           });
  //         };

  //         // Add the first page
  //         addPageToPDF();

  //         // Determine the number of remaining pages based on content height
  //         let remainingHeight = capturedCanvas.height - imgHeight;
  //         while (remainingHeight > 0) {
  //           page++;
  //           addPageToPDF();
  //           remainingHeight -= imgHeight;
  //         }

  //         pdf.save(`${downloadFileName}.pdf`);
  //       });

  // };

  return (
    <div
      color="primary"
      className="downloadledger"
      onClick={downloadPdfDocument}>
      {Loader && Loader ? (
        <>Downloading.</>
      ) : (
        <>
          <FaDownload
            className="mt-2"
            title="DownLoad"
            size={35}
            color="#00c0ef"
            style={{ cursor: "pointer" }}
          />
        </>
      )}
    </div>
  );
};

export default GenericPdfDownloader;
