import React from "react";

const WareHouseStockxml = () => {
  return `<WhStockXml>
 
     <input>
         <label>ProductName</label>
         <type type="text"></type>
         <name>ProductName</name>
         <placeholder>Enter ProductName</placeholder>
     </input>
 
     <input>
         <label>InStock</label>
         <type type="text"></type>
         <name>InStock</name>
         <placeholder>Enter InStock</placeholder>
     </input>
 
     <input>
         <label>Damage</label>
         <type type="text"></type>
         <name>damage</name>
         <number>yes</number>
         <placeholder>Enter Damage</placeholder>
     </input>
     <input>
         <label>Pending Delivery</label>
         <type type="text"></type>
         <name>PendingDelivery</name>
         <number>yes</number>
         <placeholder>Enter Pending Delivery</placeholder>
     </input>
 </WhStockXml>`;
};
export default WareHouseStockxml;

