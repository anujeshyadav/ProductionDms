import React from "react";
import { useState, useEffect } from "react";

export const CheckPermission = props => {
  let pageparmission = JSON.parse(localStorage.getItem("userData"));
  let newparmisson = pageparmission?.rolename?.rolePermission?.find(
    value => value?.pagename == props
  );

  const pageParmission = {
    View: newparmisson?.permission.includes("View"),
    Create: newparmisson?.permission.includes("Create"),
    Edit: newparmisson?.permission.includes("Edit"),
    Delete: newparmisson?.permission.includes("Delete"),
    Download: newparmisson?.permission.includes("Download"),
    BulkUpload: newparmisson?.permission.includes("BulkUpload"),
  };

  return pageParmission;
};
