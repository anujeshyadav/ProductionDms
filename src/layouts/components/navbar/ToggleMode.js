import React, { useContext } from "react";
import { BsMoonStars, BsFillMoonStarsFill } from "react-icons/bs";
import UserContext from "../../../context/Context";
import themeConfig from "../../../../src/configs/themeConfig";

function ToggleMode() {
  const themecontext = useContext(UserContext);
  const handleModeToggle = (e, value) => {
    e.preventDefault();
    console.log(themeConfig.theme);
    themeConfig.theme = value;
    console.log(themeConfig.theme);

    themecontext.setMode(value);
    // console.log(themecontext);
  };
  return (
    <div style={{ cursor: "pointer" }}>
      <BsMoonStars onClick={(e) => handleModeToggle(e, "light")} size={25} />
      <BsFillMoonStarsFill
        onClick={(e) => handleModeToggle(e, "dark")}
        size={25}
      />
    </div>
  );
}

export default ToggleMode;
