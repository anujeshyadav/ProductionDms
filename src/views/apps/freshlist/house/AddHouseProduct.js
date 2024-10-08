import React from "react";
import { Tabs, Tab } from "react-bootstrap-tabs";
import { Container } from "reactstrap";
import General from "./productData/General";
import Data from "./productData/Data";
import Links from "./productData/Links";
import Attribute from "./productData/Attribute";
import Discount from "./productData/Discount";
import Special from "./productData/Special";
import ImageGallery from "./productData/ImageGallery";
import Banner from "./productData/Banner";
import Videos from "./productData/Videos";
import RewardPoints from "./productData/RewardPoints";
import Seo from "./productData/Seo";
function AddHouseProduct() {
  return (
    <div>
      <Container>
        <Tabs onSelect={(index, label) => console.log(label + " selected")}>
          <Tab label="General">
            <General />
          </Tab>
          <Tab label="Data">
            <Data />
          </Tab>
          <Tab label="Links">
            <Links />
          </Tab>
          <Tab label="Attribute">
            <Attribute />
          </Tab>
          <Tab label="Discount">
            <Discount />
          </Tab>
          <Tab label="Special">
            <Special />
          </Tab>
          <Tab label="Image">
            <ImageGallery />
          </Tab>
          <Tab label="Banners">
            <Banner />
          </Tab>
          <Tab label="Videos">
            <Videos />
          </Tab>
          <Tab label="Reward Points">
            <RewardPoints />
          </Tab>
          <Tab label="SEO">
            <Seo />
          </Tab>
          <Tab label="Design">
            <Discount />
          </Tab>
        </Tabs>
        <hr />
      </Container>
    </div>
  );
}

export default AddHouseProduct;
