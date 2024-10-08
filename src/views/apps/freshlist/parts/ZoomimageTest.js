import React, { useState } from "react";

const ImageWithHighlightedParts = () => {
  const [selectedPart, setSelectedPart] = useState(null);

  const handlePartClick = (partNumber) => {
    setSelectedPart(partNumber);
  };

  return (
    <div>
      <h2>Selected Part Number: {selectedPart}</h2>
      <img
        src="https://drscdn.500px.org/photo/105738331/q%3D80_m%3D2000/v2?webp=true&sig=538a4f76f4966c84acb01426bb4a4a5e4a85b72a2c3bd64973d3a369f9653007" // Replace with your image URL
        alt="Numbered Image"
        style={{ width: "100%", position: "relative", cursor: "pointer" }}
        onClick={(e) => {
          const boundingBox = e.target.getBoundingClientRect();
          const offsetX = e.clientX - boundingBox.left;
          const offsetY = e.clientY - boundingBox.top;

          // Define the coordinates and associated part numbers
          const parts = [
            { x: 50, y: 100, width: 30, height: 30, number: 1 },
            { x: 150, y: 200, width: 30, height: 30, number: 2 },
            // Add more parts as needed
          ];

          // Check if the click is within the bounding box of a part
          const clickedPart = parts.find(
            (part) =>
              offsetX >= part.x &&
              offsetX <= part.x + part.width &&
              offsetY >= part.y &&
              offsetY <= part.y + part.height
          );

          if (clickedPart) {
            handlePartClick(clickedPart.number);
          } else {
            // Clear the selection if clicked outside of any part
            handlePartClick(null);
          }
        }}
      />
      {selectedPart && (
        <div
          style={{
            position: "absolute",
            top: 100, // Adjust the position based on your layout
            left: 50, // Adjust the position based on your layout
            width: 30,
            height: 30,
            border: "2px solid red",
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
};

export default ImageWithHighlightedParts;
