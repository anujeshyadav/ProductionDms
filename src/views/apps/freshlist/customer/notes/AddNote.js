import React, { useEffect, useState, useContext } from "react";
import { Route, useHistory, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Input,
  Label,
  Button,
  CustomInput,
  FormGroup,
  Spinner,
} from "reactstrap";
import Multiselect from "multiselect-react-dropdown";
import "../../../../../assets/scss/pages/users.scss";
import { CreateCustomerList } from "../../../../../ApiEndPoint/ApiCalling";

function AddNote({ type, onSubmit }) {
  const [PartyList, setPartyList] = useState([]);
  const [FormValue, setFormValue] = useState({});

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem("userData"));
    setFormValue({ ...FormValue, database: userdata?.database });
    CreateCustomerList(userdata?._id, userdata?.database)
      .then((res) => {
        if (res?.Customer?.length > 0) {
          res?.Customer?.forEach((element) => {
            // element["party"] = true;
            element["fullName"] = element?.firstName;
          });
        }
        setPartyList(res?.Customer);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const HandleChange = (e) => {
    let { name, value } = e.target;
    if (name == "totalAmount") {
      setFormValue({ ...FormValue, [name]: Number(value) });
    } else {
      setFormValue({ ...FormValue, [name]: value });
    }
  };
  useEffect(() => {
    console.log(FormValue);
  }, [FormValue]);

  const handleSelectionParty = (selectedList, selectedItem) => {
    setFormValue({ ...FormValue, partyId: selectedItem?._id });
  };

  const onRemove1 = (selectedList, selectedItem) => {
    setFormValue({ ...FormValue, partyId: "" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, FormValue);
  };
  return (
    <div>
      <div className="d-flex justify-content-center pb-2">
        <h4>Add {type && type} Note</h4>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row className="container">
          <Col lg="4" md="4" sm="12">
            <Label>Date *</Label>
            <Input
              required
              type="date"
              name="date"
              value={FormValue.date}
              onChange={HandleChange}
            />
          </Col>
          <Col lg="4" md="4" sm="12">
            <Label>Particular *</Label>
            <Multiselect
              required
              selectionLimit={1}
              isObject="false"
              options={PartyList}
              onSelect={(selectedList, selectedItem) =>
                handleSelectionParty(selectedList, selectedItem)
              }
              onRemove={(selectedList, selectedItem) =>
                onRemove1(selectedList, selectedItem)
              }
              displayValue="CompanyName"
            />
          </Col>
          <Col lg="4" md="4" sm="12">
            <Label>Amount *</Label>
            <Input
              required
              type="number"
              name="totalAmount"
              placeholder="Enter Amount ..."
              value={FormValue.totalAmount}
              onChange={HandleChange}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-center pt-2">
          <Button color="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AddNote;
