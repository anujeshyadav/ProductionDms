import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import classnames from "classnames";
import { Eye, Code } from "react-feather";
import { Trash2, Edit } from "react-feather";

import { modalBasic } from "../../../../components/reactstrap/modal/ModalSourceCode.js";
import AddExorder from "./AddExorder.jsx";
import EditProOrder from "./EditProOrder.jsx";

class EditProductModal extends React.Component {
  state = {
    activeTab: "1",
    modal: false,
  };

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  render() {
    return (
      <>
        <Card>
          {/* <CardHeader> */}
          {/* <CardTitle>Basic Modal</CardTitle> */}
          {/* <div className="views">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "1",
                    })}
                    onClick={() => {
                      this.toggleTab("1");
                    }}
                  >
                    <Eye size={15} />
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "2",
                    })}
                    onClick={() => {
                      this.toggleTab("2");
                    }}
                  >
                    <Code size={15} />
                  </NavLink>
                </NavItem>
              </Nav>
            </div> */}
          {/* </CardHeader> */}
          <CardBody className="pb-0 ">
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                {/* <Button.Ripple
                  color="primary"
                  className="btn-block"
                  size="md"
                  // outline
                  onClick={this.toggleModal}
                >
                  Add
                </Button.Ripple> */}
                <Edit size="25px" color="blue" onClick={this.toggleModal} />
                <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggleModal}
                  style={{ maxWidth: "950px" }}
                  // className={this.props.className}
                >
                  <ModalHeader toggle={this.toggleModal}>
                    Edit Product
                  </ModalHeader>
                  <ModalBody>
                    {/* <AddExorder /> */}
                    <EditProOrder />
                  </ModalBody>
                  {/* <ModalFooter>
                    <Button color="primary" onClick={this.toggleModal}>
                      Accept
                    </Button>{" "}
                  </ModalFooter> */}
                </Modal>
              </TabPane>
              <TabPane className="component-code" tabId="2">
                {modalBasic}
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </>
    );
  }
}
export default EditProductModal;
