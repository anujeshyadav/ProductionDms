import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  FormGroup,
  CustomInput,
  Table,
} from "reactstrap";

import { Route } from "react-router-dom";
import { useLocation, useHistory } from "react-router-dom";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import swal from "sweetalert";
import "../../../../../src/layouts/assets/scss/pages/users.scss";

import {
  CreateAccountList,
  Edit_StatusDispatchList,
  Save_GoodDispatch,
} from "../../../../ApiEndPoint/ApiCalling";

import "../../../../assets/scss/pages/users.scss";
import UserContext from "../../../../context/Context";

const CreateDispach = (args) => {
  const [DeliveryBoy, setDeliveryBoy] = useState([]);
  const [formData, setFormData] = useState({});
  const [DispatchData, setDispatchData] = useState({});
  const [modal, setModal] = useState(false);
  const [Loader, setLoader] = useState(false);

  const toggle = () => setModal(!modal);

  // const Context = useContext(UserContext);
  let history = useHistory();
  let location = useLocation();

  const handleFileChange = (e, type, i) => {
    const { name, value, files } = e.target;
    // let allimages = Array.from(e.target.files[0]);
    setFormData({
      ...formData,
      [name]: e.target.files[0],
    });
  };
  const handleInputChange = (e, type, i) => {
    const { name, value, checked } = e.target;
    if (type == "checkbox") {
      if (checked) {
        setFormData({
          ...formData,
          [name]: checked,
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else {
      if (type == "number") {
        if (/^\d{0,10}$/.test(value)) {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      } else if (type == "file") {
        if (e.target.files) {
          setFormData({
            ...formData,
            [name]: e.target.files[0],
          });
        }
      } else {
        if (value.length <= 10) {
          setFormData({
            ...formData,
            [name]: value,
          });
        } else {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!!location?.state?.data) {
      setDispatchData(location?.state.data);
      // console.log(location?.state.data);
    } else {
      history?.goBack();
    }
  }, []);

  useEffect(() => {
    (async () => {
      let userData = JSON.parse(localStorage.getItem("userData"));
      await CreateAccountList(userData?._id, userData?.database)
        .then((res) => {
          let value = res?.adminDetails;
          let Delevery = value?.filter(
            (ele) => ele?.rolename?.roleName == "Delivery Boy"
          );
          if (Delevery?.length > 0) {
            setDeliveryBoy(Delevery);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoader(true);

    let formdata = new FormData();
    formdata.append(`created_by`, DispatchData?.userId);
    formdata.append(`userId`, DispatchData?.userId);
    formdata.append(`partyId`, DispatchData?.partyId?._id);
    formdata.append(`orderId`, DispatchData?._id);

    formdata.append(`grandTotal`, DispatchData?.grandTotal);
    formdata.append(`status`, "InProcess");
    formdata.append(`orderItems`, JSON.stringify(DispatchData?.orderItems));
    formdata.append("file", formData?.CNUpload);
    formdata.append("AssignDeliveryBoy", formData?.AssignDeliveryBoy);
    formdata.append("CNDetails", formData?.CNDetails);

    Save_GoodDispatch(formdata)
      .then((res) => {
        console.log(res);
        let payload = { status: "Inprocess" };
        Edit_StatusDispatchList(DispatchData?._id, payload)
          .then((res) => {
            setLoader(false);

            console.log(res);
            history.goBack();
          })
          .catch((err) => {
            setLoader(false);
            console.log(err);
          });
        if (res.status) {
          setLoader(false);

          swal("Good Dispatch Created Successfully");
        }
      })
      .catch((err) => {
        setLoader(false);
        console.log(err.response);
        swal("Something went wrong Please Try again After Some Time");
      });
  };

  return (
    <div>
      <div>
        <Card>
          <Row className="m-2">
            <Col>
              <h1 className="float-left">Create Dispatch</h1>
            </Col>
            <Col>
              <div className="float-right">
                <Route
                  render={({ history }) => (
                    <Button
                      style={{ cursor: "pointer" }}
                      className="float-right mr-1"
                      color="danger"
                      size="sm"
                      onClick={() => history.goBack()}>
                      Back
                    </Button>
                  )}
                />
              </div>
            </Col>
          </Row>
          {/* <hr /> */}

          <CardBody>
            <Form className="m-1" onSubmit={submitHandler}>
              <Row className="mb-2">
                <Col lg="3" md="3" sm="12">
                  <FormGroup>
                    <Label className="mb-1">CN Upload</Label>
                    <Input
                      className="form-control"
                      type="file"
                      name="CNUpload"
                      onChange={(e) => {
                        handleFileChange(e, "file", 0);
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="3" md="3" sm="12">
                  <Label className="mb-1">Fetch Sales Invoice</Label>

                  <Input
                    disabled
                    className="form-control"
                    type="text"
                    placeholder="Click to fetch Details"
                    name="FetchSalesInvoice"
                    value={formData?.FetchSalesInvoice}
                    onChange={(e) => {
                      handleInputChange(e, "text", 0);
                    }}
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      toggle();
                    }}
                    style={{
                      position: "absolute",
                      right: 18,
                      top: 36,
                      padding: "18px",
                    }}
                    className="lookupview"
                    color="primary">
                    Fetch
                  </Button>
                </Col>
                <Col lg="3" md="3" sm="12">
                  <FormGroup>
                    <Label className="mb-1">CN Details</Label>
                    <textarea
                      className="form-control"
                      type="text"
                      name="CNDetails"
                      value={formData.CNDetails}
                      onChange={(e) => {
                        handleInputChange(e, "text", 0);
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="3" md="3" sm="12">
                  <div className="mt-1">
                    <FormGroup>
                      <Label>Assign Delivery Boy *</Label>
                      <CustomInput
                        required
                        type="select"
                        name="AssignDeliveryBoy"
                        value={formData?.AssignDeliveryBoy}
                        onChange={handleInputChange}>
                        <option value="">--Assign Delivery Boy--</option>
                        {DeliveryBoy &&
                          DeliveryBoy?.map((option, index) => {
                            return (
                              <option key={option?._id} value={option?._id}>
                                {`${option?.firstName} ${option?.lastName}`}
                              </option>
                            );
                          })}
                      </CustomInput>
                    </FormGroup>
                  </div>
                </Col>
                <Row>
                  {/* {!Loader ? <></> : <></>} */}
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button.Ripple
                        color="primary"
                        disabled={!Loader ? false : true}
                        type="submit"
                        className="mr-1 mt-2 mx-2">
                        {!Loader ? "Submit" : "Updating..."}
                      </Button.Ripple>
                    </div>
                  </Col>
                </Row>
                <hr />
              </Row>
            </Form>
          </CardBody>
        </Card>
        <Modal
          size="xl"
          // centered="true"
          isOpen={modal}
          toggle={toggle}
          {...args}
          // style={{ maxWidth: "1050px" }}
        >
          <ModalHeader toggle={toggle}>Invoice Details</ModalHeader>
          <ModalBody>
            <div className="p-3">
              <Row>
                <Col>
                  <Label>Party Name :</Label>
                  <h5 className="mx-1">
                    {DispatchData && DispatchData?.fullName}
                  </h5>
                </Col>
                <Col>
                  <Label>Date Created :</Label>
                  <h5>
                    {DispatchData && DispatchData?.createdAt?.split("T")[0]}
                  </h5>
                </Col>
                <Col>
                  <Label>Taxable:</Label>
                  <h5>
                    <strong>
                      {DispatchData && DispatchData?.amount?.toFixed(2)}
                    </strong>
                    Rs/-
                  </h5>
                </Col>
                {DispatchData?.igstTaxType && DispatchData?.igstTaxType == 1 ? (
                  <>
                    <Col>
                      <Label>IGST:</Label>
                      <h5>
                        <strong>
                          {DispatchData && DispatchData?.igstTotal}
                        </strong>
                        Rs/-
                      </h5>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col>
                      <Label>SGST:</Label>
                      <h5>
                        <strong>
                          {DispatchData && DispatchData?.sgstTotal}
                        </strong>
                        Rs/-
                      </h5>
                    </Col>
                    <Col>
                      <Label>CGST:</Label>
                      <h5>
                        <strong>
                          {DispatchData && DispatchData?.cgstTotal}
                        </strong>
                        Rs/-
                      </h5>
                    </Col>
                  </>
                )}
                {DispatchData?.otherCharges && (
                  <Col>
                    <Label>Other Charges :</Label>
                    <h5>
                      <strong>
                        {DispatchData && DispatchData?.otherCharges}{" "}
                      </strong>
                    </h5>
                  </Col>
                )}
                <Col>
                  <Label>Address :</Label>
                  <h5>
                    <strong>{DispatchData && DispatchData?.address} </strong>
                  </h5>
                </Col>
                <Col>
                  <Label>Grand Total :</Label>
                  <h5>
                    <strong>{DispatchData && DispatchData?.grandTotal} </strong>
                    Rs/-
                  </h5>
                </Col>
              </Row>
              <Row className="p-2">
                <Col>
                  <div className="d-flex justify-content-center">
                    <h4>Product Details</h4>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table style={{ cursor: "pointer" }} responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>HSN CODE</th>
                        <th>Price</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>TAXABLE</th>
                        {DispatchData?.igstTaxType &&
                        DispatchData?.igstTaxType == 1 ? (
                          <>
                            <th>IGST</th>
                          </>
                        ) : (
                          <>
                            <th>SGST</th>
                            <th>CGST</th>
                          </>
                        )}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DispatchData?.orderItems &&
                        DispatchData?.orderItems?.map((ele, i) => (
                          <>
                            <tr>
                              <th scope="row">{i + 1}</th>
                              <td>{ele?.productId?.Product_Title}</td>
                              <td>{ele?.productId?.HSN_Code}</td>
                              <td>{ele?.productId?.Product_MRP}</td>
                              <td>{ele?.Size}</td>
                              <td>{ele?.qty}</td>
                              <td>{ele?.unitType}</td>
                              <td>{ele?.taxableAmount}</td>
                              {DispatchData?.igstTaxType &&
                              DispatchData?.igstTaxType == 1 ? (
                                <>
                                  <td>{ele?.igstRate}</td>
                                </>
                              ) : (
                                <>
                                  <td>{ele?.sgstRate}</td>
                                  <td>{ele?.cgstRate}</td>
                                </>
                              )}
                              <td>{ele?.grandTotal}</td>
                            </tr>
                          </>
                        ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};
export default CreateDispach;
