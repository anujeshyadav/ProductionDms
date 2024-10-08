import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  CustomInput,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import {
  SubscriptinPlan,
  SubscriptinPlan_by_id,
  Update_SubscriptinPlan_by_id,
} from "../../../../ApiEndPoint/Api";
import {
  _Get,
  _Post,
  _PostSave,
  _Put,
} from "../../../../ApiEndPoint/ApiCalling";
import swal from "sweetalert";
import { useHistory, useParams } from "react-router-dom";

function Addplan() {
  const [Data, setData] = useState({});
  const [View, setView] = useState("Add");
  const [Loader, setLoader] = useState(false);
  let history = useHistory();
  let Params = useParams();
  const handleCreateSubscription = async (e) => {
    setLoader(true);
    e.preventDefault();
    console.log(Data);
    if (View == "Add") {
      await _PostSave(SubscriptinPlan, Data)
        .then((res) => {
          setLoader(false);

          console.log(res);
          swal("Success", "Plan Created Successfully", "success");
          history.goBack();
        })
        .catch((err) => {
          setLoader(false);

          swal("error", "Plan Created Successfully", "error");

          console.log(err);
        });
    } else {
      await _Put(Update_SubscriptinPlan_by_id, Params?.id, Data)
        .then((res) => {
          setLoader(false);
          console.log(res);
          history.goBack();

          swal("Success", "Plan Updated Successfully", "success");
        })
        .catch((err) => {
          setLoader(false);

          swal("error", "Plan Created Successfully", "error");
          console.log(err);
        });
    }
  };
  useEffect(() => {
    if (Params?.id == 0) {
      setView("Add");
    } else {
      (async () => {
        await _Get(SubscriptinPlan_by_id, Params?.id)
          .then((res) => {
            setData(res?.Subscription);

            setView("Update");
          })
          .catch((err) => console.log(err));
      })();
    }
    console.log(Data);
  }, []);

  const handleInputChange = (e) => {
    let { value, name } = e.target;
    if (name == "planName" || name == "subscriptionType") {
      setData({ ...Data, [name]: value });
    } else {
      setData({ ...Data, [name]: Number(value) });
    }
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
            {" "}
            Back
          </Button>
        </div>
        <div className="d-flex justify-content-center pt-1 mb-2">
          <h2> {View && View} Plans </h2>
        </div>
        <Form onSubmit={handleCreateSubscription} className="p-2 mb-2">
          <Row>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Subscription type *</Label>
              <CustomInput
                required
                type="select"
                name="subscriptionType"
                value={Data.subscriptionType}
                onChange={handleInputChange}>
                <option value={0}>----select----</option>
                <option value={1}>One Time</option>
                <option value={2}>Yearly</option>
              </CustomInput>
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label>Plan Name *</Label>
              <Input
                required
                type="text"
                name="planName"
                placeholder="Enter Plan Name"
                value={Data.planName}
                onChange={handleInputChange}
              />
            </Col>

            {Data.subscriptionType !== 0 && (
              <>
                <Col className="mb-1 mt-1" lg="4" md="4">
                  <Label>Plan Price *</Label>
                  <Input
                    required
                    type="number"
                    name="subscriptionCost"
                    placeholder="Enter subscription Cost"
                    value={Data.subscriptionCost}
                    onChange={handleInputChange}
                  />
                </Col>
              </>
            )}
            {Data.subscriptionType == 1 && (
              <>
                <Col className="mb-1 mt-1" lg="4" md="4">
                  <Label>Annual Maintenance Cost *</Label>
                  <Input
                    required
                    type="number"
                    name="annualMaintenanceCost"
                    placeholder="Enter annualMaintenanceCost Cost"
                    value={Data.annualMaintenanceCost}
                    onChange={handleInputChange}
                  />
                </Col>
              </>
            )}
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label> Days of Plan *</Label>
              <Input
                required
                type="number"
                name="days"
                placeholder="Enter Days of Plan"
                value={Data.days}
                onChange={handleInputChange}
              />
            </Col>
            <Col className="mb-1 mt-1" lg="4" md="4">
              <Label> No of Allowed User *</Label>
              <Input
                required
                type="number"
                name="noOfUser"
                placeholder="Enter No of Allowed User"
                value={Data.noOfUser}
                onChange={handleInputChange}
              />
            </Col>
            {/* <Col className="mb-1 mt-1" lg="4" md="4">
            <Label> Price/User*</Label>
            <Input
              required
              type="number"
              name="perUserCost"
              placeholder="Enter No of Allowed User"
              value={Data.perUserCost}
              onChange={handleInputChange}
            />
          </Col> */}
          </Row>
          <Row>
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
          </Row>
        </Form>
      </Card>
    </>
  );
}

export default Addplan;
