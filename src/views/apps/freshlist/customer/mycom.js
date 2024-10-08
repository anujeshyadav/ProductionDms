import React from "react";

function mycom() {
  return `<?xml version="1.0"?>
       <catalog>
       <catalog><dropdown><select name="fruit"><option value="apple">Apple</option><option value="banana">Banana</option><option value="cherry">Cherry</option><option value="orange">Orange</option></select></dropdown><userInput><input type="text" name="username" value="john_doe" /><input type="checkbox" name="username" value="john_doe" /><input type="password" name="password" value="secretpassword" /><input type="checkbox" name="subscribe" checked="true" /></userInput> </catalog>
          <book id="bk109">
          <userInput>
      <input type="text" name="username" value="john_doe" />
      <input type="password" name="password" value="secretpassword" />
      <input type="checkbox" name="subscribe" checked="true" />
      </userInput>
             <author>Kress, Peter</author>
             <title>Paradox Lost</title>
             <genre>Science Fiction</genre>
             <price>6.95</price>
             <publish_date>2000-11-02</publish_date>
             <description>After an inadvertant trip through a Heisenberg
             Uncertainty Device, James Salway discovers the problems 
             of being quantum.</description>
          </book>
          <book id="bk110">
             <author>O'Brien, Tim</author>
             <title>Microsoft .NET: The Programming Bible</title>
             <genre>Computer</genre>
             <price>36.95</price>
             <publish_date>2000-12-09</publish_date>
             <description>Microsoft's .NET initiative is explored in 
             detail in this deep programmer's reference.</description>
          </book>
       </catalog>`;
}

export default mycom;
