import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  Row,
  CardHeader,
  Table,
} from "reactstrap";
import {
  VIEW_ATTENDANCE_BY_ID,
  UPDATE_ATTENDANCE,
  HRM_ATTENDANCE_LIST,
} from "../../../../../../ApiEndPoint/Api";
import { _Put, _Get } from "../../../../../../ApiEndPoint/ApiCalling";

const AttenviewForm = () => {
  const [data, setData] = useState({
    employee: "",
    date: "",
    hours: "",
    remark: "",
  });
  const [ViewoneData, setViewoneData] = useState({});

  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    let userId = JSON.parse(localStorage.getItem("userData"));

    _Get(HRM_ATTENDANCE_LIST, userId.database)
      .then((res) => {
        let selected = res?.attendanceTotal?.filter(
          (ele, i) => ele?.details?._id == id
        );
        setViewoneData(selected[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(ViewoneData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await _Put(UPDATE_ATTENDANCE, id, data);
      history.push("/app/ajgroup/HRM/attenList");
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleBack = () => {
    history.goBack();
  };
  console.log(ViewoneData);
  return (
    <Row>
      <Col sm="12" md="6" className="mx-auto">
        <Card>
          <CardHeader>
            <h1>Attendance {ViewoneData?.details?.name}</h1>
            <Button color="warning" onClick={handleBack}>
              Back
            </Button>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>In Time</th>
                      <th>OutTime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ViewoneData?.details?.inTimes?.length > 0 ? (
                      <>
                        {ViewoneData?.details?.inTimes?.map((ele, i) => {
                          return (
                            <tr>
                              <td scope="row">{ViewoneData?.details?.date}</td>
                              <td>{ele}</td>
                              <td>
                                {ViewoneData?.details?.outTimes[i] &&
                                  ViewoneData?.details?.outTimes[i]}
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    ) : null}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};
export default AttenviewForm;
