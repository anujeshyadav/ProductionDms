import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import {
  SubscriptinPlan,
  SubscriptinPlanList,
  SubscriptinPlan_by_id,
  Update_SubscriptinPlan_by_id,
  View_User_By_Id,
} from "../../../../ApiEndPoint/Api";
import {
  _Get,
  _GetList,
  _Post,
  _PostSave,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import swal from "sweetalert";
import { useHistory, useParams, useLocation } from "react-router-dom";

function ViewSuperAdmin() {
  const [Data, setData] = useState({});
  const [View, setView] = useState("Add");
  const [SubsCriptionList, setSubsCriptionList] = useState([]);

  let history = useHistory();
  let Params = useParams();
  let location = useLocation();
  // const handleCreateSubscription = async (e) => {
  //   setLoader(true);
  //   e.preventDefault();
  //   console.log(Data);
  //   if (View == "Add") {
  //     await _PostSave(SubscriptinPlan, Data)
  //       .then((res) => {
  //         setLoader(false);

  //         console.log(res);
  //         swal("Success", "Plan Created Successfully", "success");
  //         history.goBack();
  //       })
  //       .catch((err) => {
  //         setLoader(false);

  //         swal("error", "Plan Created Successfully", "error");

  //         console.log(err);
  //       });
  //   } else {
  //     await _Put(Update_SubscriptinPlan_by_id, Params?.id, Data)
  //       .then((res) => {
  //         setLoader(false);
  //         console.log(res);
  //         history.goBack();

  //         swal("Success", "Plan Updated Successfully", "success");
  //       })
  //       .catch((err) => {
  //         setLoader(false);

  //         swal("error", "Plan Created Successfully", "error");
  //         console.log(err);
  //       });
  //   }
  // };
  useEffect(() => {
    (async () => {
      await _Get(View_User_By_Id, Params?.id)
        .then((res) => {
          let value = res?.User;
          let a = value?.subscriptionPlan;
          let Data = {
            ...value,
            ...{
              annualMaintenanceCost: a?.annualMaintenanceCost,
              createdAt: a?.createdAt,
              days: a?.days,
              noOfUser: a?.noOfUser,
              planName: a?.planName,
              subscriptionPlan: a?._id,
              subscriptionCost: a?.subscriptionCost,
              subscriptionType: a?.subscriptionType,
            },
          };
          console.log(Data);
          setData(Data);
        })
        .catch((err) => {
          console.log(err);
        });
      let user = JSON.parse(localStorage.getItem("userData"));
      let url = SubscriptinPlanList;
      await _GetList(url, user?.database).then((res) => {
        let value = res?.Subscription;
        if (value?.length) {
          setSubsCriptionList(value);
        }
      });
    })();

    console.log(Data);
  }, []);

  const handleInputChange = (e) => {
    let { value, name } = e.target;
    // if (name == "planName" || name == "subscriptionType") {
    setData({ ...Data, [name]: value });
    // } else {
    //   setData({ ...Data, [name]: Number(value) });
    // }
  };
  return (
    <>
      <Card>
        <div className="d-flex justify-content-end">
          <Button
            style={{ cursor: "pointer" }}
            className="float-right mr-2 mt-1 mb-1"
            color="primary"
            onClick={() => history.goBack()}>
            Back
          </Button>
        </div>
        <div className="d-flex justify-content-center pt-1 mb-2">
          <h2> View Plans </h2>
        </div>
        <Form
          // onSubmit={handleCreateSubscription}
          className="p-2 mb-2">
          <Row>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>FirstName*</Label>
              <Input
                readOnly
                type="text"
                name="FirstName"
                placeholder="Enter FirstName"
                value={Data.firstName}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>LastName*</Label>
              <Input
                readOnly
                type="text"
                name="lastName"
                placeholder="Enter LastName"
                value={Data.lastName}
                onChange={handleInputChange}
              />
            </Col>

            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Email *</Label>
              <Input
                readOnly
                type="email"
                name="email"
                placeholder="Enter Email"
                value={Data.email}
                onChange={handleInputChange}
              />
            </Col>

            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Plan Status *</Label>
              <CustomInput
                readOnly
                type="select"
                name="planStatus"
                value={Data.planStatus}
                onChange={handleInputChange}>
                <option value="Paid">Paid</option>
                <option value="unPaid">unPaid</option>
                <option value="Expiry">Expiry</option>
              </CustomInput>
            </Col>
            <Col lg="4" md="4" sm="12" className="mb-1 mt-1">
              <FormGroup>
                <Label>Change Plan</Label>
                <CustomInput
                  readOnly
                  type="select"
                  value={Data["subscriptionPlan"]}
                  onChange={(e) => {
                    setData({
                      ...formData,
                      ["subscriptionPlan"]: e.target.value,
                    });
                  }}>
                  <option value="0">----select Plan----</option>
                  {SubsCriptionList?.length > 0 && (
                    <>
                      {SubsCriptionList?.map((ele, index) => (
                        <option key={index} value={ele?._id}>
                          {ele?.planName} (Price -{ele?.subscriptionCost})(
                          {ele?.subscriptionType == 1 ? "Yearly" : "One Time"})
                        </option>
                      ))}
                    </>
                  )}
                </CustomInput>
              </FormGroup>
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Plan Name *</Label>
              <Input
                readOnly
                type="text"
                name="planName"
                placeholder="Plan Name .. "
                value={Data.planName}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 " lg="4" md="4">
              <Label>Plan Price *</Label>
              <Input
                readOnly
                type="text"
                name="subscriptionCost"
                placeholder="Plan Price"
                value={Data.subscriptionCost}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 " lg="4" md="4">
              <Label>Plan StartDate *</Label>
              <Input
                readOnly
                type="text"
                name="planStart "
                placeholder="plan Start Date"
                value={Data.planStart}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 " lg="4" md="4">
              <Label>Plan EndDate*</Label>
              <Input
                readOnly
                type="text"
                name="planEnd"
                placeholder="plan End Date"
                value={Data.planEnd}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Total User Allowted*</Label>
              <Input
                readOnly
                type="number"
                name="noOfUser"
                placeholder="no Of User Allowed"
                value={Data.noOfUser}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Registered User *</Label>
              <Input
                readOnly
                type="text"
                name="PlanPrice"
                placeholder="Plan Price"
                value={Data.PlanPrice}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Total Days*</Label>
              <Input
                readOnly
                type="text"
                name="days"
                placeholder="Plan days"
                value={Data.days}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Mobile Number *</Label>
              <Input
                readOnly
                type="number"
                name="PlanPrice"
                placeholder="Mobile Number"
                value={Data.mobileNumber}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Pin Code *</Label>
              <Input
                readOnly
                type="text"
                name="pincode"
                placeholder="Plan Price"
                value={Data.pincode}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Aadhar No.*</Label>
              <Input
                readOnly
                type="number"
                name="Aadhar_No"
                placeholder="Plan Price"
                value={Data.Aadhar_No}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>City *</Label>
              <Input
                readOnly
                type="text"
                name="City"
                placeholder="City"
                value={Data.City}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>State *</Label>
              <Input
                readOnly
                type="text"
                name="state"
                placeholder="State"
                value={Data.State}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Pan No.*</Label>
              <Input
                readOnly
                type="text"
                name="Pan_No"
                placeholder="Pan No"
                value={Data.Pan_No}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Passport No *</Label>
              <Input
                readOnly
                type="text"
                name="passportNo"
                placeholder="Passport No"
                value={Data.PassportNo}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label> Address One*</Label>
              <Input
                readOnly
                type="textarea"
                name="addressOne"
                placeholder="Address One"
                value={Data.address1}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label> Address Two*</Label>
              <Input
                readOnly
                type="textarea"
                name="addresstwo"
                placeholder="addresstwo"
                value={Data.address2}
                onChange={handleInputChange}
              />
            </Col>
          </Row>
          {/* <Row>
            <Col className="mt-3">
              <div className="d-flex justify-content-center">
                <Button
                  style={{ cursor: "pointer" }}
                  type="submit"
                  // disabled=
                  color="primary">
                  {View && View}
                </Button>
              </div>
            </Col>
          </Row> */}
        </Form>
      </Card>
    </>
  );
}

export default ViewSuperAdmin;
