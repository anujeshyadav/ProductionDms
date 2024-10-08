import React, { useState } from "react";
import { Button } from "reactstrap";

// Define step components
const Step1 = ({ onNext }) => (
  <div>
    <h2>Step 1</h2>
    <Button color="primary" onClick={onNext}>
      Next
    </Button>
  </div>
);

const Step2 = ({ onPrev, onNext }) => (
  <div>
    <h2>Step 2</h2>
    <Button color="primary" onClick={onPrev}>
      Previous
    </Button>
    <Button color="primary" onClick={onNext}>
      Next
    </Button>
  </div>
);

const Step3 = ({ onPrev }) => (
  <div>
    <h2>Step 3</h2>
    <Button color="primary" onClick={onPrev}>
      Previous
    </Button>
    <Button>Submit</Button>
  </div>
);

const StepperForm = () => {
  const [UserData, setUserData] = useState({});
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Render the appropriate step component based on the current step
  let content;
  switch (step) {
    case 1:
      content = <Step1 onNext={nextStep} />;
      break;
    case 2:
      content = <Step2 onPrev={prevStep} onNext={nextStep} />;
      break;
    case 3:
      content = <Step3 onPrev={prevStep} />;
      break;
    default:
      content = <Step1 onNext={nextStep} />;
  }

  return (
    <div>
      <div className="d-flex justify-content-center">
        <h1>User Registration</h1>
      </div>
      {content}
    </div>
  );
};

export default StepperForm;
