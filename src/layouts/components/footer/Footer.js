import React, { useState } from "react";
import ScrollToTop from "react-scroll-up";
import { Button, Row } from "reactstrap";
import { Heart, ArrowUp, Edit } from "react-feather";
import classnames from "classnames";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import HorizontalMenu from "../menu/horizontal-menu/HorizontalMenu";
import MobileViewMenu from "../menu/horizontal-menu/MobileViewMenu";

const Footer = (props, args) => {
  let footerTypeArr = ["sticky", "static", "hidden"];
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <>
      {window.innerWidth <= 760 && (
        <footer
          className={classnames("footer footer-light d-flex", {
            "footer-static":
              props.footerType === "static" ||
              !footerTypeArr.includes(props.footerType),
            "d-none": props.footerType === "hidden",
          })}>
          <MobileViewMenu />
        </footer>
      )}
      {window.innerWidth >= 760 && (
        <footer
          className={classnames("footer footer-light", {
            "footer-static":
              props.footerType === "static" ||
              !footerTypeArr.includes(props.footerType),
            "d-none": props.footerType === "hidden",
          })}>
          <p className="mb-0 clearfix ">
            <span className="float-md-left d-block d-md-inline-block mt-25">
              COPYRIGHT © {new Date().getFullYear()}
              <a rel="noopener noreferrer">AJ Group,</a>
              All rights reserved
            </span>

            <span className="float-md-right d-none d-md-block">
              <span className="align-middle">Hand-crafted & Made with</span>{" "}
              <Heart fill="red" className="text-danger" size={15} />
            </span>
          </p>
          {props.hideScrollToTop === false ? (
            <ScrollToTop showUnder={160}>
              <Button color="primary" className="btn-icon scroll-top">
                <ArrowUp size={15} />
              </Button>
            </ScrollToTop>
          ) : null}
        </footer>
      )}
    </>
  );
};

export default Footer;
