import React, { Component } from "react";
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Input, Label, Row, Table} from "reactstrap";

export class WebsitePdf extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Website PDF Upload
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form>
            <Row className="mb-2">
              <Col>
                <Label className="mb-1">Upoad PDF</Label>
                <Input type="file" placeholder= "Upload Pdf"/>
              </Col>
            </Row>
            <Row>
              <Col lg="6" md="6" sm="6" className="mb-2">
                <Button.Ripple
                  color="primary"
                  type="submit"
                  className="mr-1 mb-1"
                >
                  Add New PDF
                </Button.Ripple>
              </Col>
            </Row>
          </Form>

          <Table dark>
            <thead>
            <tr>
              <th>#</th>
              <th>Uploaded Pdf</th>

              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>

            </tr>


            </tbody>
          </Table>
        </CardBody>
      </Card>



    );
  }
}

export default WebsitePdf;
