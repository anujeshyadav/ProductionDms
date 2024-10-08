import React from "react";
import { Row, Col } from "reactstrap";
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb";
import Datepickers from "./Datepickers";
import Timepickers from "./Timepicker";

import "flatpickr/dist/themes/light.css";
import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";

class Pickers extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Date & Time Picker"
          breadCrumbParent="Form Elements"
          breadCrumbActive="Date & Time Picker"
        />
        <Row>
          <Col sm="12">
            <Datepickers />
          </Col>
          <Col sm="12">
            <Timepickers />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default Pickers;
// import { useState, useRef } from "react";

// function anuj() {
//   const [imagePath, setImagePath] = useState("");
//   const [text, setText] = useState("aa");

//   const handleChange = (event) => {
//     setImage(URL.createObjectURL(event.target.files[0]));
//   };

//   return (
//     <div className="App">
//       <main className="App-main">
//         <h3>Actual image uploaded</h3>
//         {/* <img src={imagePath} className="App-logo" alt="logo" /> */}

//         <h3>Extracted text</h3>
//         <div className="text-box">
//           <p> {text} </p>
//         </div>
//         <input type="file" onChange={handleChange} />
//       </main>
//     </div>
//   );
// }

// export default anuj;
