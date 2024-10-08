import React, { useRef } from "react";

const CameraApp = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const detectFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Use FaceDetector API to detect faces
    const faceDetector = new FaceDetector();
    faceDetector
      .detect(canvas)
      .then((faces) => {
        // Draw rectangles around detected faces
        faces.forEach((face) => {
          ctx.beginPath();
          ctx.lineWidth = "2";
          ctx.strokeStyle = "red";
          ctx.rect(
            face.boundingBox.x,
            face.boundingBox.y,
            face.boundingBox.width,
            face.boundingBox.height
          );
          ctx.stroke();
        });
      })
      .catch((err) => {
        console.error("Error detecting faces:", err);
      });
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={detectFace}>Detect Face</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraApp;
