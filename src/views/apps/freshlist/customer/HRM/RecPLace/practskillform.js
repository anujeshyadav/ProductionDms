import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Form,
  CardBody,
  Card,
  CardHeader,
  Alert,
} from "reactstrap";
import { Hrm_SkillGroup } from "../../../../../../ApiEndPoint/Api";
import { _PostSave } from "../../../../../../ApiEndPoint/ApiCalling";
import { useHistory } from "react-router-dom";

const MockTestForm = () => {
  const [answerType, setAnswerType] = useState("");
  const [data, setData] = useState({
    question: "",
    option: "",
    rightAnswer: "",
    desc: "",
    database: "",
  });
  const history = useHistory();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
    const [questions, setQuestions] = useState([
      {
        question: "What is the capital of France?",
        options: [
          { text: "Berlin", isCorrect: false },
          { text: "Madrid", isCorrect: false },
          { text: "Paris", isCorrect: true },
          { text: "Rome", isCorrect: false },
        ],
        selectedOption: null,
      },
    ]);
    const handleOptionChange = (qIndex, oIndex) => {
      const updatedQuestions = [...questions];
      updatedQuestions[qIndex].selectedOption = oIndex;
      setQuestions(updatedQuestions);
    };

    const addNewQuestion = () => {
      setQuestions([
        ...questions,
        {
          question: "",
          options: [{ text: "", isCorrect: false }],
          selectedOption: null,
        },
      ]);
    };

    const handleQuestionChange = (qIndex, newQuestion) => {
      const updatedQuestions = [...questions];
      updatedQuestions[qIndex].question = newQuestion;
      setQuestions(updatedQuestions);
    };

    const handleOptionTextChange = (qIndex, oIndex, newText) => {
      const updatedQuestions = [...questions];
      updatedQuestions[qIndex].options[oIndex].text = newText;
      setQuestions(updatedQuestions);
    };

    const handleCorrectOptionChange = (qIndex, oIndex) => {
      const updatedQuestions = [...questions];
      updatedQuestions[qIndex].options.forEach((option, index) => {
        option.isCorrect = index === oIndex;
      });
      setQuestions(updatedQuestions);
    };
    useEffect(() => {
      console.log(questions);
    }, [questions]);

    const addOption = (qIndex) => {
      const updatedQuestions = [...questions];
      updatedQuestions[qIndex].options.push({ text: "", isCorrect: false });
      setQuestions(updatedQuestions);
    };

    useEffect(() => {
      console.log(data);
    }, [data]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      let user = JSON.parse(localStorage.getItem("userData"));
      let Payload = {
        question: data?.question,
        option: data?.option,
        rightAnswer: data?.rightAnswer,
        desc: data?.desc,
        database: user?.database,
      };

      try {
        await _PostSave(Hrm_SkillGroup, Payload);
        setSuccessAlert(true);
        resetForm();
        history.push("/app/ajgroup/HRM/practiceList");
      } catch (error) {
        console.error(error);
        setErrorAlert(true);
      }
    };
    const validateForm = () => {
      return Object.values(data).every((value) => value.trim() !== "");
    };

    const resetForm = () => {
      setData({
        question: "",
        option: "",
        rightAnswer: "",
        database: "",
      });
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setData({ ...data, [name]: value });

      if (name === "option") {
        setAnswerType(value);
      }
    };
    const handleBack = () => {
      history.goBack();
    };

    return (
      <>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm="12" md="7" className="mx-auto">
              <Card>
                <CardHeader>
                  <Row style={{ width: "100%" }}>
                    <Col xl="6" lg="6" md="6">
                      <h2> Skills Question Form</h2>
                    </Col>
                    <Col xl="6" lg="6" md="6">
                      <Button
                        color="danger"
                        className="float-right "
                        onClick={handleBack}>
                        Back
                      </Button>
                    </Col>
                  </Row>

                  {successAlert && (
                    <Alert color="success">Form submitted successfully!</Alert>
                  )}
                  {errorAlert && (
                    <Alert color="danger">
                      Please fill all fields before submitting the form.
                    </Alert>
                  )}
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleEmail">Input Type Question</Label>
                        <Input
                          required
                          type="text"
                          name="question"
                          id="question"
                          placeholder="Enter your question"
                          value={data?.question}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleSelect">Answer Type</Label>
                        <Input
                          required
                          style={{ height: "51px", borderRadius: "10px" }}
                          type="select"
                          name="option"
                          id="option"
                          value={data?.option}
                          onChange={handleInputChange}>
                          <option value="NA">Select an option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                          <option value="description">Description</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    {answerType === "description" && (
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleTextarea">Description</Label>
                          <Input
                            type="textarea"
                            name="desc"
                            id="desc"
                            value={data?.desc}
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                    )}
                    <Col md={6}>
                      <FormGroup>
                        <Label for="exampleTextarea">Correct Answer</Label>
                        <Input
                          required
                          type="textarea"
                          name="rightAnswer"
                          id="rightAnswer"
                          value={data?.rightAnswer}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center">
                      <Button color="primary">Submit</Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
        {/* <Card>
          <CardBody>
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
              {questions.map((question, qIndex) => (
                <div key={qIndex} style={{ marginBottom: "40px" }}>
                  <h3>Question {qIndex + 1}</h3>
                  <Input
                    type="text"
                    placeholder="Enter your question"
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
                    style={{ width: "100%", marginBottom: "10px" }}
                  />
                  <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {question.options.map((option, oIndex) => (
                      <li key={oIndex} style={{ marginBottom: "10px" }}>
                        <input
                          type="text"
                          placeholder={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) =>
                            handleOptionTextChange(
                              qIndex,
                              oIndex,
                              e.target.value
                            )
                          }
                          style={{ marginRight: "10px" }}
                        />
                        <label>
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={() =>
                              handleCorrectOptionChange(qIndex, oIndex)
                            }
                            style={{ marginRight: "10px" }}
                          />
                          Correct
                        </label>
                      </li>
                    ))}
                  </ul>
                  <Button color="primary" onClick={() => addOption(qIndex)}>
                    Add Option
                  </Button>
                </div>
              ))}
              <div className="d-flex justify-content-end">
                <Button color="primary" onClick={addNewQuestion}>
                  Add More Questions
                </Button>
              </div>
            </div>
          </CardBody>
        </Card> */}
      </>
    );
};

export default MockTestForm;
