// import React, { Component } from "react";
// import { Input } from "reactstrap";
// import xml2js from "xml2js";
// import axios from "axios";
// import MyComponent from "./Mycompone";

// class XmlInputForm extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dropdownData: null,
//       label: null,
//       xmlContentnew: `
//       <form>
//         <label for="name">Name:</label>
//         <input type="text" id="name" name="name" />

//         <label for="email">Email:</label>
//         <input type="email" id="email" name="email" />

//         <label for="message">Message:</label>
//         <textarea id="message" name="message"></textarea>

//         <button type="submit">Submit</button>
//       </form>
//     `,
//       formElements: [],
//       xmlContenta: `
//       <dropdown>
//         <select name="fruit">
//           <option value="apple">Apple</option>
//           <option value="banana">Banana</option>
//           <option value="cherry">Cherry</option>
//           <option value="orange">Orange</option>
//         </select>
//       </dropdown>
//     `,
//       xmlContent:
//         '<userInput><input type="text" name="user" value="johndoe" /><input type="text" name="email" value="sanuje@gmail.com" /><input type="text" name="username" value="john_doe" /><input type="checkbox" name="username" value="john_doe" /><input type="password" name="password" value="secretpassword" /><input type="checkbox" name="subscribe" checked="true" /></userInput>',
//       formData: {},
//     };
//   }

//   componentDidMount() {
//     axios
//       .get(`http://3.110.118.102:5000/part-config/data`)
//       .then((res) => {
//         console.log(res?.data?.data);
//         xml2js.parseString(res?.data?.data, (err, result) => {
//           if (err) {
//             console.error("Error parsing XML:", err);
//           } else {
//             console.log(result);
//           }
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     xml2js.parseString(this.state.xmlContenta, (err, result) => {
//       if (err) {
//         console.error("Error parsing XML:", err);
//       } else {
//         // Extract the dropdown content from the parsed XML
//         // const dropdownDaa = result.dropdown.select[0].option.map((ele) => {
//         //   console.log(ele);
//         // });
//         console.log(result);
//         const label = result?.dropdown.select[0].$.name;
//         const dropdownData = result.dropdown.select[0].option.map((option) => ({
//           value: option.$.value,
//           label: option._,
//         }));
//         console.log(result);

//         // Set the dropdown data in the component state
//         this.setState({ dropdownData });
//         this.setState({ label });
//       }
//     });
//     // Parse the XML content and convert it to a JavaScript object
//     xml2js.parseString(this.state.xmlContent, (err, result) => {
//       if (err) {
//         console.error("Error parsing XML:", err);
//       } else {
//         // Extract the input values from the parsed XML
//         const formData = {};
//         const inputs = result.userInput.input;
//         inputs.forEach((input) => {
//           const { name, type, value } = input.$;
//           formData[name] = type === "checkbox" ? value === "true" : value;
//         });

//         // Set the form data in the component state
//         this.setState({ formData });
//       }
//     });
//   }

//   render() {
//     const { formData, dropdownData, label } = this.state;

//     return (
//       <div>
//         <MyComponent />
//         <form>
//           <div>
//             <h1>XML Dropdown</h1>
//             {dropdownData && (
//               <>
//                 <label>{label}</label>
//                 <select className="form-control" name="fruit">
//                   {dropdownData.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </>
//             )}
//           </div>
//         </form>

//         <form>
//           <h1>XML Input Form</h1>
//           {Object.keys(formData).map((name) => (
//             <div key={name}>
//               <label htmlFor={name}>{name}</label>
//               {formData[name] === "checkbox" ? (
//                 <Input
//                   className="form-control"
//                   type="checkbox"
//                   name={name}
//                   checked={formData[name]}
//                 />
//               ) : (
//                 <Input
//                   className="form-control"
//                   type="text"
//                   name={name}
//                   value={formData[name]}
//                 />
//               )}
//             </div>
//           ))}
//         </form>
//       </div>
//     );
//   }
// }

// export default XmlInputForm;
