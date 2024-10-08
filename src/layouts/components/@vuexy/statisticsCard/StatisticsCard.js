// import React from "react";
// import {
//   Card,
//   CardBody,
//   Row,
//   Col,
//   Modal,
//   ModalHeader,
//   ModalBody,
// } from "reactstrap";
// // import Chart from "react-apexcharts";
// import { Edit } from "react-feather";
// class StatisticsCards extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // modal: false,
//     };
//   }
//   handleEditModal = e => {
//     e.preventDefault();
//     this.LookupviewStartModal();
//   };
//   LookupviewStartModal = () => {
//     this.setState(prevState1 => ({
//       modal: !prevState1.modal,
//     }));
//   };
//   render() {
//     return (
//       <>
//         <Card>
//           <div style={{ textAlign: "end" }}>
//             <Edit
//               color="red"
//               style={{ cursor: "pointer" }}
//               size={18}
//               className=""
//               onClick={this.handleEditModal}
//             />
//           </div>
//           <CardBody
//             className="LowStockcssheight"
//             style={{
//               // backgroundColor: "rgb(8, 91, 245)",
//               borderRadius: "30px",
//             }}
//             // className={`${
//             //   this.props.className ? this.props.className : "stats-card-body"
//             // } d-flex ${
//             //   !this.props.iconRight && !this.props.hideChart
//             //     ? "flex-column align-items-center"
//             //     : this.props.iconRight
//             //     ? "justify-content-between flex-row-reverse align-items-center"
//             //     : this.props.hideChart && !this.props.iconRight
//             //     ? "justify-content-center flex-column text-center"
//             //     : null
//             // } ${!this.props.hideChart ? "pb-0" : "pb-2"} pt-2`}
//           >
//             {this.props.statTitle && (
//               <div className="">
//                 <div>
//                   <h3
//                     className="mb-1 text-center  text-bold-600"
//                     style={{
//                       textDecoration: "underline",
//                       textDecorationColor: "red",
//                     }}
//                   >
//                     {this.props.statTitle}
//                   </h3>
//                 </div>

//                 <h5 className="mb-0 pb-1">{this.props.statTitle1}</h5>
//                 <h5
//                   className="mb-0 pb-1"
//                   // style={{ color: "#fff" }}
//                 >
//                   {this.props.statTitle2}
//                 </h5>
//                 <h5
//                   className="mb-0 pb-1"
//                   // style={{ color: "#fff" }}
//                 >
//                   {this.props.statTitle3}
//                 </h5>
//                 <h5
//                   className="mb-0 pb-1"
//                   // style={{ color: "#fff" }}
//                 >
//                   {this.props.statTitle4}
//                 </h5>
//                 <h5
//                   className="mb-0 pb-1"
//                   // style={{ color: "#fff" }}
//                 >
//                   {this.props.statTitle5}
//                 </h5>
//                 <h5
//                   className="mb-0 pb-1"
//                   // style={{ color: "#fff" }}
//                 >
//                   {this.props.statTitle6}
//                 </h5>
//               </div>
//             )}

//             {this.props.productName && (
//               <>
//                 <Col>
//                   <h3
//                     className="mb-1 text-center  text-bold-600"
//                     style={{
//                       textDecoration: "underline",
//                       textDecorationColor: "red",
//                     }}
//                   >
//                     {this.props.heading}
//                   </h3>
//                 </Col>

//                 <Row>
//                   <Col md="6" lg="6" className="text-bold-600">
//                     ProductName
//                   </Col>
//                   <Col md="3" lg="3" className="text-bold-600">
//                     Alert
//                   </Col>
//                   <Col md="3" lg="3" className="text-bold-600">
//                     Grade
//                   </Col>
//                 </Row>
//                 <Row className="tablescroll">
//                   <Col md="6" lg="6">
//                     {this.props.productName}
//                   </Col>
//                   <Col md="3" lg="3">
//                     {this.props.alert}
//                   </Col>
//                   <Col md="3" lg="3">
//                     {this.props.grade}
//                   </Col>
//                 </Row>
//               </>
//             )}
//             {this.props.partyName && (
//               <>
//                 <Col>
//                   <h3
//                     className="mb-1 text-center  text-bold-600"
//                     style={{
//                       textDecoration: "underline",
//                       textDecorationColor: "red",
//                     }}
//                   >
//                     {this.props.heading}
//                   </h3>
//                 </Col>
//                 <Row>
//                   <Col md="5" lg="5" className="text-bold-600">
//                     PartyName
//                   </Col>
//                   <Col md="4" lg="4" className="text-bold-600">
//                     SalesPersonName
//                   </Col>
//                   <Col md="3" lg="3" className="text-bold-600">
//                     Inactive
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col md="6" lg="6">
//                     {this.props.partyName}
//                   </Col>
//                   <Col md="3" lg="3">
//                     {this.props.SalesPersonName}
//                   </Col>
//                   <Col md="3" lg="3">
//                     {this.props.Inactive}
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </CardBody>
//         </Card>
//         <Modal
//           isOpen={this.state.modal}
//           toggle={this.LookupviewStartModal}
//           // className={this.props.className}
//           style={{ maxWidth: "700px" }}
//         >
//           <ModalHeader toggle={this.LookupviewStartModal}>
//             Dahboard Card Fileds
//           </ModalHeader>
//           <ModalBody className="modalbodyhead">
//             <div className="d-flex justify-content-center mb-1">
//               <h4>Edit Dashboard Data</h4>
//             </div>

//             {/* <Row>
//               <Col>
//                 {this.state.basicList &&
//                   this.state.basicList?.map((ele, i) => (
//                     <div key={i}>
//                       <div>
//                         <Input
//                           checked={ele?.Show}
//                           type="checkbox"
//                           className="mx-1 p-2"
//                           onChange={e => this.hanldeSetBox(e, ele, i)}
//                         />
//                       </div>
//                       <div>
//                         <h4 className="item mx-3">{ele?.Name}</h4>
//                       </div>
//                     </div>
//                   ))}

//                 <div className="d-flex justify-content-center">
//                   <Button color="primary"
//                     // onClick={this.handleSubmitBottomData}
//                   >
//                     Submit
//                   </Button>
//                 </div>
//               </Col>
//             </Row> */}
//           </ModalBody>
//         </Modal>
//       </>
//     );
//   }
// }
// export default StatisticsCards;
import React from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Edit } from "react-feather";
import { _Get } from "../../../../ApiEndPoint/ApiCalling";
import { stock_calculate } from "../../../../ApiEndPoint/Api";

class StatisticsCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false,
    };
  }

  handleEditModal = (e) => {
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      modalEdit: !prevState.modalEdit,
    }));
  };
  componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    _Get(stock_calculate, userInfo?.database)
      .then((res) => {
        this.setState({ stock: res?.WarehouseStock });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <>
        <Card>
          <div style={{ textAlign: "end" }}>
            <Edit
              color="red"
              style={{ cursor: "pointer" }}
              size={18}
              onClick={() => this.handleEditModal()}
            />
          </div>
          <CardBody
            className="LowStockcssheight"
            style={{
              borderRadius: "30px",
            }}>
            {this.props.statTitle && (
              <div>
                <h3
                  className="mb-1 text-center text-bold-600"
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: "red",
                  }}>
                  {this.props.statTitle}
                </h3>
                <h5 className="mb-0 pb-1">{this.props.statTitle1}</h5>

                <h5 className="mb-0 pb-1">{this.props.statTitle2}</h5>
                <h5 className="mb-0 pb-1">{this.props.statTitle3}</h5>
                <h5 className="mb-0 pb-1">{this.props.statTitle4}</h5>
                <h5 className="mb-0 pb-1">{this.props.statTitle5}</h5>
                <h5 className="mb-0 pb-1">{this.props.statTitle6}</h5>
              </div>
            )}

            {this.props.productName && (
              <>
                <Col>
                  <h3
                    className="mb-1 text-center text-bold-600"
                    style={{
                      textDecoration: "underline",
                      textDecorationColor: "red",
                    }}>
                    {this.props.heading}
                  </h3>
                </Col>

                <Row>
                  <Col md="6" lg="6" className="text-bold-600">
                    ProductName
                  </Col>
                  <Col md="3" lg="3" className="text-bold-600">
                    Alert
                  </Col>
                  <Col md="3" lg="3" className="text-bold-600">
                    Grade
                  </Col>
                </Row>
                <Row className="tablescroll">
                  <Col md="6" lg="6">
                    {this.props.productName}
                  </Col>
                  <Col md="3" lg="3">
                    {this.props.alert}
                  </Col>
                  <Col md="3" lg="3">
                    {this.props.grade}
                  </Col>
                </Row>
              </>
            )}

            {this.props.partyName && (
              <>
                <Col>
                  <h3
                    className="mb-1 text-center text-bold-600"
                    style={{
                      textDecoration: "underline",
                      textDecorationColor: "red",
                    }}>
                    {this.props.heading}
                  </h3>
                </Col>
                <Row>
                  <Col md="5" lg="5" className="text-bold-600">
                    PartyName
                  </Col>
                  <Col md="4" lg="4" className="text-bold-600">
                    SalesPersonName
                  </Col>
                  <Col md="3" lg="3" className="text-bold-600">
                    Inactive
                  </Col>
                </Row>
                <Row>
                  <Col md="6" lg="6">
                    {this.props.partyName}
                  </Col>
                  <Col md="3" lg="3">
                    {this.props.SalesPersonName}
                  </Col>
                  <Col md="3" lg="3">
                    {this.props.Inactive}
                  </Col>
                </Row>
              </>
            )}
          </CardBody>
        </Card>

        <Modal
          isOpen={this.state.modalEdit}
          toggle={this.toggleModal}
          style={{ maxWidth: "700px" }}>
          <ModalHeader toggle={this.toggleModal}>
            Dashboard Card Fields
          </ModalHeader>
          <ModalBody className="modalbodyhead">
            <div className="d-flex justify-content-center mb-1">
              <h4>Edit Dashboard Data</h4>
            </div>
            {/* Add your form or other modal content here */}
          </ModalBody>
        </Modal>
      </>
    );
  }
}
export default StatisticsCards;
