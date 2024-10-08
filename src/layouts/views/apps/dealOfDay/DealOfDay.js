import React from "react";
import { Row, Col } from "reactstrap";
import ThumbViewConfig from "./DodData";
import queryString from "query-string";

class DealOfDay extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <ThumbViewConfig
              thumbView={true}
              parsedFilter={queryString.parse(this.props.location.search)}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default DealOfDay;
