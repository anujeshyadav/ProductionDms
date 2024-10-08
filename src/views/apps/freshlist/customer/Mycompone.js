// import React, { useState, useEffect } from "react";
// import xml2js from "xml2js";

// const MyComponent = () => {
//   const [dropdownData, setDropdownData] = useState([]);

//   useEffect(() => {
//     const xmlData = `
//       <data>
//         <dropdown>
//           <option>Option 1</option>
//           <option>Option 2</option>
//         </dropdown>
//         <dropdown>
//           <option>Option A</option>
//           <option>Option B</option>
//         </dropdown>
//       </data>
//     `;

//     const parseXml = () => {
//       xml2js.parseString(xmlData, (err, result) => {
//         if (err) {
//           console.error(err);
//         } else {
//           // Assuming your XML structure matches the example
//           setDropdownData(result.data.dropdown);
//         }
//       });
//     };

//     parseXml();
//   }, []);

//   return (
//     <div>
//       <div>
//         {dropdownData &&
//           dropdownData?.map((dropdown, index) => (
//             <div className="py-1" key={index}>
//               <select className="form-control">
//                 {dropdown?.option?.map((option, optionIndex) => (
//                   <option key={optionIndex}>{option}</option>
//                 ))}
//               </select>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default MyComponent;
