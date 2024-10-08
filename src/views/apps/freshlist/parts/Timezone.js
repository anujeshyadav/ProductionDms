import React, { useState, useEffect } from "react";
import moment from "moment-timezone";

const TimeZoneConverter = () => {
  const [originalTime, setOriginalTime] = useState("2023-10-19T12:00:00"); // Input time in ISO format
  const [originalTimeZone, setOriginalTimeZone] = useState("America/New_York"); // Time zone of the input time
  const [targetTimeZone, setTargetTimeZone] = useState("Europe/London"); // Time zone to convert to

  const handleConversion = () => {
    const convertedTime = moment(originalTime)
      .tz(targetTimeZone)
      .format("YYYY-MM-DD HH:mm:ss");
    // Using .tz() to convert the time to the target time zone
    // You can format the result as per your requirements
    alert(`Converted Time: ${convertedTime}`);
  };
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // setLocalTimeZone(timeZone);
    console.log(timeZone);
    const timeZones = moment.tz.names();
    console.log(timeZones);
    const convertedTime = moment("2022-08-05T12:00:00")
      .tz("America/New_York")
      .format("D MMM, YYYY HH:mm");
    console.log(convertedTime);
    //   .format("MM/DD/YYYY h:mm A");
    //   .format("MM/DD/YYYY HH:mm:ss");
    // console.log(timeZones);
  }, []);
  return (
    <div>
      <div>
        <label>Original Time:</label>
        <input
          type="datetime-local"
          value={originalTime}
          onChange={(e) => setOriginalTime(e.target.value)}
        />
      </div>
      <div>
        <label>Original Time Zone:</label>
        <select
          value={originalTimeZone}
          onChange={(e) => setOriginalTimeZone(e.target.value)}
        >
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
          {/* Add more time zones as needed */}
        </select>
      </div>
      <div>
        <label>Target Time Zone:</label>
        <select
          value={targetTimeZone}
          onChange={(e) => setTargetTimeZone(e.target.value)}
        >
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
          {/* Add more time zones as needed */}
        </select>
      </div>
      <button onClick={handleConversion}>Convert Time</button>
    </div>
  );
};

export default TimeZoneConverter;
