import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
} from "reactstrap";
import { FaPlus, FaMinus, FaEdit, FaTrash } from "react-icons/fa";

const EmployeeSalaryForm = () => {
  const [data, setData] = useState({
    payslipType: "",
    salary: "",
    fromAccount: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleAccountDropdown = () =>
    setAccountDropdownOpen(!accountDropdownOpen);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleEmployeeSalarySubmit = (e) => {
    e.preventDefault();
    if (!data.payslipType || !data.salary || !data.fromAccount) {
      alert("Please fill in all fields before saving.");
      return;
    }
    setData({
      payslipType: data.payslipType,
      salary: data.salary,
      fromAccount: data.fromAccount,
    });
    console.log("Employee Salary Form submitted:", data);
    toggleModal();
  };

  const handleDropdownSelect = (selectedOption) => {
    setData({ ...data, payslipType: selectedOption });
    toggleDropdown();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleAccountDropdownSelect = (selectedOption) => {
    setData({ ...data, fromAccount: selectedOption });
    toggleAccountDropdown();
  };
  const handleRemoveAllFields = () => {
    setData({
      payslipType: "",
      salary: "",
      fromAccount: "",
    });
    // toggleModal();
  };

  return (
    <Card>
      <CardHeader>
        <h2>Employee Salary</h2>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleEmployeeSalarySubmit}>
          <FormGroup row>
            <Label for="payslipType" sm={4}>
              Employee Name:
            </Label>
            <div
              style={{
                marginLeft: "10px",
                marginTop: " 10px",
                fontWeight: "bold",
              }}>
              {data.payslipType}
            </div>
          </FormGroup>
          <FormGroup row>
            <Label for="salary" sm={4}>
              Base Salary:
            </Label>
            <div
              style={{
                marginLeft: "10px",
                marginTop: " 10px",
                fontWeight: "bold",
              }}>
              {data.salary}
            </div>
          </FormGroup>
        </Form>

        <Modal isOpen={modalOpen} toggle={toggleModal} backdrop="static">
          <ModalHeader toggle={toggleModal}>Add Employee Salary</ModalHeader>
          <ModalBody>
            <Form onSubmit={handleEmployeeSalarySubmit}>
              <FormGroup>
                <Label for="payslipType">Payslip Type:</Label>
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle caret>
                    {data.payslipType
                      ? data.payslipType
                      : "Select Payslip Type"}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => handleDropdownSelect("Monthly Payslip")}>
                      Monthly Payslip
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleDropdownSelect("Hourly Payslip")}>
                      Hourly Payslip
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </FormGroup>
              <FormGroup>
                <Label for="salary">Salary:</Label>
                <Input
                  type="number"
                  name="salary"
                  value={data.salary}
                  onChange={handleInputChange}
                  style={{ width: "80%" }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="fromAccount">From Account:</Label>
                <Dropdown
                  isOpen={accountDropdownOpen}
                  toggle={toggleAccountDropdown}>
                  <DropdownToggle caret>
                    {data.fromAccount
                      ? data.fromAccount
                      : "Select From Account"}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem
                      onClick={() => handleAccountDropdownSelect("Account 1")}>
                      Account 1
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => handleAccountDropdownSelect("Account 2")}>
                      Account 2
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </FormGroup>
              <Button color="primary" type="submit">
                Save
              </Button>{" "}
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

const TaForm = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleAddData = () => {
    setSelectedData(null);
    toggleModal();
  };

  const handleEditData = (index) => {
    setSelectedData({ ...tableData[index], index });
    toggleModal();
  };

  const handleDeleteData = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };

  const handleSaveData = (data) => {
    const updatedData = [...tableData];
    if (selectedData !== null) {
      updatedData[selectedData.index] = data;
    } else {
      updatedData.push(data);
    }
    setTableData(updatedData);
    toggleModal();
  };

  const TableHeadings = () => (
    <thead>
      <tr>
        <th>EMPLOYEE NAME</th>
        <th>OPTION</th>
        <th>START DATE</th>
        <th>TYPE</th>
        <th>AMOUNT</th>
        <th>ACTION</th>
      </tr>
    </thead>
  );

  const TableBody = () => (
    <tbody>
      {tableData.map((data, index) => (
        <tr key={index}>
          <td>15000{data.employeeName}</td>
          <td>150{data.allowanceOption}</td>
          <td>{data.title}</td>
          <td>{data.type}</td>
          <td>{data.amount}</td>
          <td>
            <Button
              color="info"
              size="sm"
              className="mr-2"
              onClick={() => handleEditData(index)}>
              <FaEdit />
            </Button>

            <Button
              color="danger"
              size="sm"
              onClick={() => handleDeleteData(index)}
              // className="ml-5"
            >
              <FaTrash />
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <Card>
      <CardHeader>
        <h1>Allowance Form</h1>
      </CardHeader>
      <CardBody>
        <div class="table-responsive myclass" style={{ height: "175px" }}>
          <Table striped bordered responsive>
            <TableHeadings />
            <TableBody />
          </Table>
        </div>

        <Modal isOpen={modalOpen} toggle={toggleModal} backdrop="static">
          <ModalHeader toggle={toggleModal}>
            {selectedData ? "Edit Allowance" : "Add Allowance"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveData({
                  employeeName: e.target.employeeName.value,
                  allowanceOption: e.target.allowanceOption.value,
                  title: e.target.title.value,
                  type: e.target.type.value,
                  amount: e.target.amount.value,
                });
              }}>
              <FormGroup>
                <Label for="employeeName">Employee Name:</Label>
                <Input
                  required="required"
                  type="text"
                  name="employeeName"
                  defaultValue={selectedData?.employeeName || ""}
                />
              </FormGroup>
              <FormGroup>
                <Label for="allowanceOption">Allowance Option:</Label>
                <Input
                  required="required"
                  type="text"
                  name="allowanceOption"
                  defaultValue={selectedData?.allowanceOption || ""}
                />
              </FormGroup>
              <FormGroup>
                <Label for="title">Title:</Label>
                <Input
                  required="required"
                  type="text"
                  name="title"
                  defaultValue={selectedData?.title || ""}
                />
              </FormGroup>
              <FormGroup>
                <Label for="type">Type:</Label>
                <Input
                  required="required"
                  type="text"
                  name="type"
                  defaultValue={selectedData?.type || ""}
                />
              </FormGroup>
              <FormGroup>
                <Label for="amount">Amount:</Label>
                <Input
                  required="required"
                  type="number"
                  name="amount"
                  defaultValue={selectedData?.amount || ""}
                />
              </FormGroup>
              <Button color="primary" type="submit">
                Save
              </Button>{" "}
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

// const TravellingForm = () => {
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");

//   const handleSubmit = e => {
//     e.preventDefault();

//     console.log("Title:", title);
//     console.log("Amount:", amount);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <h1>Travelling Form</h1>
//         <FaPlus
//           style={{
//             marginLeft: "45%",
//             cursor: "pointer",
//             color: "white",
//             fontSize: "29px",
//             border: "1px solid green",
//             borderRadius: "15px",
//             padding: "5px",
//             backgroundColor: "green",
//           }}
//         />
//       </CardHeader>
//       <CardBody>
//         <Form onSubmit={handleSubmit}>
//           <FormGroup>
//             <Label for="titleDropdown">Title</Label>
//             <Input
//               type="select"
//               name="title"
//               id="titleDropdown"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="Option 1">Option 1</option>
//               <option value="Option 2">Option 2</option>
//             </Input>
//           </FormGroup>

//           <FormGroup>
//             <Label for="amountInput">Amount</Label>
//             <Input
//               type="number"
//               name="amount"
//               id="amountInput"
//               value={amount}
//               placeholder="Enter amount"
//               onChange={e => setAmount(e.target.value)}
//             />
//           </FormGroup>

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// const Loanform = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [tableData, setTableData] = useState([]);
//   const [data, setData] = useState({
//     employee: "",
//     loanOptions: "",
//     title: "",
//     type: "",
//     loanAmount: "",
//     reason: "",
//   });
//   const [selectedData, setSelectedData] = useState(null);

//   const toggleModal = () => {
//     setModalOpen(!modalOpen);
//     setSelectedData(null);
//     setData({
//       employee: "",
//       loanOptions: "",
//       title: "",
//       type: "",
//       loanAmount: "",
//       reason: "",
//     });
//   };

//   const handleSubmit = e => {
//     e.preventDefault();
//     if (
//       data.employee === "" ||
//       data.loanOptions === "" ||
//       data.title === "" ||
//       data.type === "" ||
//       data.reason === "" ||
//       data.loanAmount === ""
//     ) {
//       alert("Please fill in all required fields before saving.");
//       return;
//     }

//     if (selectedData !== null) {
//       const updatedTableData = [...tableData];
//       updatedTableData[selectedData] = data;
//       setTableData(updatedTableData);
//       setSelectedData(null);
//     } else {
//       setTableData([...tableData, data]);
//     }

//     toggleModal();
//   };

//   const handleEdit = index => {
//     setSelectedData(index);
//     setData(tableData[index]);
//     toggleModal();
//   };

//   const handleDelete = index => {
//     const updatedTableData = [...tableData];
//     updatedTableData.splice(index, 1);
//     setTableData(updatedTableData);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <h1>Loan Form</h1>
//         <FaPlus
//           style={{
//             cursor: "pointer",
//             color: "white",
//             fontSize: "29px",
//             border: "1px solid green",
//             borderRadius: "15px",
//             padding: "5px",
//             backgroundColor: "green",
//           }}
//           onClick={toggleModal}
//         />
//       </CardHeader>
//       <CardBody>
//         <Form>
//           <div style={{ overflowX: "auto" }}>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>EMPLOYEE</th>
//                   <th>LOAN OPTIONS</th>
//                   <th>TITLE</th>
//                   <th>TYPE</th>
//                   <th>LOAN AMOUNT</th>
//                   <th>ACTION</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tableData.map((data, index) => (
//                   <tr key={index}>
//                     <td>{data.employee}</td>
//                     <td>{data.loanOptions}</td>
//                     <td>{data.title}</td>
//                     <td>{data.type}</td>
//                     <td>{data.loanAmount}</td>
//                     <td>
//                       <Button
//                         color="link"
//                         style={{ fontSize: "20px" }}
//                         onClick={() => handleEdit(index)}
//                       >
//                         <FaEdit />
//                       </Button>
//                       <Button
//                         color="link"
//                         style={{ fontSize: "20px" }}
//                         onClick={() => handleDelete(index)}
//                       >
//                         <FaTrash />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </Form>

//         <Modal
//           isOpen={modalOpen}
//           toggle={toggleModal}
//           backdrop="static"
//           style={{ maxWidth: "55%", width: "auto" }}
//         >
//           <ModalHeader toggle={toggleModal}>Add Loan</ModalHeader>
//           <ModalBody>
//             <Form onSubmit={handleSubmit}>
//               <div className="row">
//                 <div className="col-md-6">
//                   <FormGroup>
//                     <Label for="employeeInput">Employee:</Label>
//                     <Input
//                       required="required"
//                       type="text"
//                       name="employee"
//                       value={data.employee}
//                       onChange={e =>
//                         setData({ ...data, employee: e.target.value })
//                       }
//                     />
//                   </FormGroup>

//                   <FormGroup>
//                     <Label for="loanOptionsInput">Loan Options:</Label>
//                     <Input
//                       required="required"
//                       type="select"
//                       name="loanOptions"
//                       value={data.loanOptions}
//                       onChange={e =>
//                         setData({ ...data, loanOptions: e.target.value })
//                       }
//                     >
//                       <option value="">Select Options</option>
//                       <option value="Health">Health Loan</option>
//                       <option value="Personal">Personal Loan</option>
//                       <option value="Other">Other Loan</option>
//                     </Input>
//                   </FormGroup>

//                   <FormGroup>
//                     <Label for="typeInput">Type:</Label>
//                     <Input
//                       required="required"
//                       type="select"
//                       name="type"
//                       value={data.type}
//                       onChange={e => setData({ ...data, type: e.target.value })}
//                     >
//                       <option value="">Select Type</option>
//                       <option value="Fixed">Fixed</option>
//                       <option value="Percentage">Percentage</option>
//                     </Input>
//                   </FormGroup>
//                 </div>

//                 <div className="col-md-6">
//                   <FormGroup>
//                     <Label for="titleInput">Title:</Label>
//                     <Input
//                       required="required"
//                       title="Please fill out this field"
//                       type="text"
//                       name="title"
//                       value={data.title}
//                       onChange={e =>
//                         setData({ ...data, title: e.target.value })
//                       }
//                     />
//                   </FormGroup>

//                   <FormGroup>
//                     <Label for="loanAmountInput">Loan Amount:</Label>
//                     <Input
//                       required="required"
//                       type="number"
//                       name="loanAmount"
//                       value={data.loanAmount}
//                       placeholder="Rs."
//                       onChange={e =>
//                         setData({ ...data, loanAmount: e.target.value })
//                       }
//                     />
//                   </FormGroup>

//                   <div className="row">
//                     <div className="col-md-12">
//                       <FormGroup>
//                         <Label for="reasonInput">Reason:</Label>
//                         <Input
//                           required="required"
//                           type="textarea"
//                           name="reason"
//                           value={data.reason}
//                           onChange={e =>
//                             setData({ ...data, reason: e.target.value })
//                           }
//                         />
//                       </FormGroup>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <Button color="primary" type="submit">
//                 Submit
//               </Button>
//             </Form>
//           </ModalBody>
//         </Modal>
//       </CardBody>
//     </Card>
//   );
// };

// const Pfform = () => {
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");

//   const handleSubmit = e => {
//     e.preventDefault();

//     console.log("Title:", title);
//     console.log("Amount:", amount);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <h1>PF Form</h1>
//         <FaPlus
//           style={{
//             marginLeft: "45%",
//             cursor: "pointer",
//             color: "white",
//             fontSize: "29px",
//             border: "1px solid green",
//             borderRadius: "15px",
//             padding: "5px",
//             backgroundColor: "green",
//           }}
//         />
//       </CardHeader>
//       <CardBody>
//         <Form onSubmit={handleSubmit}>
//           <FormGroup>
//             <Label for="titleDropdown">Title</Label>
//             <Input
//               type="select"
//               name="title"
//               id="titleDropdown"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="Option 1">Option 1</option>
//               <option value="Option 2">Option 2</option>
//             </Input>
//           </FormGroup>

//           <FormGroup>
//             <Label for="amountInput">Amount</Label>
//             <Input
//               type="number"
//               name="amount"
//               id="amountInput"
//               value={amount}
//               placeholder="Enter Amount"
//               onChange={e => setAmount(e.target.value)}
//             />
//           </FormGroup>

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// const Advance = () => {
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");

//   const handleSubmit = e => {
//     e.preventDefault();

//     console.log("Title:", title);
//     console.log("Amount:", amount);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <h1>Advance Form</h1>
//         <FaPlus
//           style={{
//             marginLeft: "45%",
//             cursor: "pointer",
//             color: "white",
//             fontSize: "29px",
//             border: "1px solid green",
//             borderRadius: "15px",
//             padding: "5px",
//             backgroundColor: "green",
//           }}
//         />
//       </CardHeader>
//       <CardBody>
//         <Form onSubmit={handleSubmit}>
//           <FormGroup>
//             <Label for="titleDropdown">Title</Label>
//             <Input
//               type="select"
//               name="title"
//               id="titleDropdown"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="Option 1">Option 1</option>
//               <option value="Option 2">Option 2</option>
//               {/* Add more options as needed */}
//             </Input>
//           </FormGroup>

//           <FormGroup>
//             <Label for="amountInput">Amount</Label>
//             <Input
//               type="number"
//               name="amount"
//               id="amountInput"
//               value={amount}
//               placeholder="enter amount"
//               onChange={e => setAmount(e.target.value)}
//             />
//           </FormGroup>

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };
// const Esiform = () => {
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");

//   const handleSubmit = e => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log("Title:", title);
//     console.log("Amount:", amount);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <h1>ESI Form</h1>
//         <FaPlus
//           style={{
//             marginLeft: "45%",
//             cursor: "pointer",
//             color: "white",
//             fontSize: "29px",
//             border: "1px solid green",
//             borderRadius: "15px",
//             padding: "5px",
//             backgroundColor: "green",
//           }}
//         />
//       </CardHeader>
//       <CardBody>
//         <Form onSubmit={handleSubmit}>
//           <FormGroup>
//             <Label for="titleDropdown">Title</Label>
//             <Input
//               type="select"
//               name="title"
//               id="titleDropdown"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="Option 1">Option 1</option>
//               <option value="Option 2">Option 2</option>
//               {/* Add more options as needed */}
//             </Input>
//           </FormGroup>

//           <FormGroup>
//             <Label for="amountInput">Amount</Label>
//             <Input
//               type="number"
//               name="amount"
//               id="amountInput"
//               value={amount}
//               placeholder="enter ammount"
//               onChange={e => setAmount(e.target.value)}
//             />
//           </FormGroup>

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// const Insurance = () => {
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");

//   const handleSubmit = e => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log("Title:", title);
//     console.log("Amount:", amount);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <h1>Insurance Form</h1>
//         <FaPlus
//           style={{
//             marginLeft: "45%",
//             cursor: "pointer",
//             color: "white",
//             fontSize: "29px",
//             border: "1px solid green",
//             borderRadius: "15px",
//             padding: "5px",
//             backgroundColor: "green",
//           }}
//         />
//       </CardHeader>
//       <CardBody>
//         <Form onSubmit={handleSubmit}>
//           <FormGroup>
//             <Label for="titleDropdown">Title</Label>
//             <Input
//               type="select"
//               name="title"
//               id="titleDropdown"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="Option 1">Option 1</option>
//               <option value="Option 2">Option 2</option>
//               {/* Add more options as needed */}
//             </Input>
//           </FormGroup>

//           <FormGroup>
//             <Label for="amountInput">Amount</Label>
//             <Input
//               type="number"
//               name="amount"
//               id="amountInput"
//               value={amount}
//               placeholder="enter ammount"
//               onChange={e => setAmount(e.target.value)}
//             />
//           </FormGroup>

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// const Payslip = () => {
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");

//   const handleSubmit = async e => {
//     e.preventDefault();

//     console.log("Title:", title);
//     console.log("Amount:", amount);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <h1>Pay Slip Form</h1>
//         <FaPlus
//           style={{
//             marginLeft: "45%",
//             cursor: "pointer",
//             color: "white",
//             fontSize: "29px",
//             border: "1px solid green",
//             borderRadius: "15px",
//             padding: "5px",
//             backgroundColor: "green",
//           }}
//         />
//       </CardHeader>
//       <CardBody>
//         <Form onSubmit={handleSubmit}>
//           <FormGroup>
//             <Label for="titleDropdown">Title</Label>
//             <Input
//               type="select"
//               name="title"
//               id="titleDropdown"
//               value={title}
//               onChange={e => setTitle(e.target.value)}
//             >
//               <option value="">Select</option>
//               <option value="Option 1">Option 1</option>
//               <option value="Option 2">Option 2</option>
//             </Input>
//           </FormGroup>

//           <FormGroup>
//             <Label for="amountInput">Amount</Label>
//             <Input
//               type="number"
//               name="amount"
//               id="amountInput"
//               value={amount}
//               placeholder="Enter Amount"
//               onChange={e => setAmount(e.target.value)}
//             />
//           </FormGroup>

//           <Button color="primary" type="submit">
//             Submit
//           </Button>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// const Over = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [tableData, setTableData] = useState([]);
//   const [selectedData, setSelectedData] = useState(null);

//   const toggleModal = () => setModalOpen(!modalOpen);

//   const handleAddData = () => {
//     setSelectedData(null);
//     toggleModal();
//   };

//   const handleSubmitData = data => {
//     const updatedData = [...tableData];
//     if (selectedData !== null) {
//       updatedData[selectedData.index] = data;
//     } else {
//       updatedData.push(data);
//     }
//     setTableData(updatedData);
//     toggleModal();
//   };

//   const handleEdit = index => {
//     setSelectedData({ ...tableData[index], index });
//     toggleModal();
//   };

//   const handleDelete = index => {
//     const updatedData = [...tableData];
//     updatedData.splice(index, 1);
//     setTableData(updatedData);
//   };

//   const TableHeadings = () => (
//     <thead>
//       <tr>
//         <th>EMPLOYEE NAME</th>
//         <th>OVERTIME TITLE</th>
//         <th>No. OF DAYS</th>
//         <th>HOURS</th>
//         <th>RATE</th>
//         <th>ACTION</th>
//       </tr>
//     </thead>
//   );

//   const TableBody = () => (
//     <tbody>
//       {tableData.map((data, index) => (
//         <tr key={index}>
//           <td>{data.employeeName}</td>
//           <td>{data.overtime}</td>
//           <td>{data.numberofDays}</td>
//           <td>{data.hours}</td>
//           <td>{data.rate}</td>
//           <td>
//             <Button
//               color="info"
//               size="sm"
//               className="mr-2"
//               onClick={() => handleEdit(index)}
//             >
//               <FaEdit />
//             </Button>

//             <Button
//               color="danger"
//               size="sm"
//               onClick={() => handleDelete(index)}
//               // className="ml-5"
//             >
//               <FaTrash />
//             </Button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   );

//   return (
//     <Card>
//       <CardHeader>
//         <h1>OverTime Form</h1>
//         <FaPlus
//           style={{
//             marginLeft: "45%",
//             cursor: "pointer",
//             color: "white",
//             fontSize: "29px",
//             border: "1px solid green",
//             borderRadius: "15px",
//             padding: "5px",
//             backgroundColor: "green",
//           }}
//           onClick={handleAddData}
//         />
//       </CardHeader>
//       <CardBody>
//         <div
//           className="table-responsive myclass"
//           style={{ height: "175px", border: "none" }}
//         >
//           <Table className="table" striped bordered responsive>
//             <TableHeadings />
//             <TableBody />
//           </Table>
//         </div>

//         <Modal isOpen={modalOpen} toggle={toggleModal} backdrop="static">
//           <ModalHeader toggle={toggleModal}>
//             {selectedData ? "Edit Overtime" : "Add Overtime"}
//           </ModalHeader>
//           <ModalBody>
//             <Form
//               onSubmit={e => {
//                 e.preventDefault();
//                 handleSubmitData({
//                   employeeName: e.target.employeeName.value,
//                   overtime: e.target.overtime.value,
//                   numberofDays: e.target.numberofDays.value,
//                   hours: e.target.hours.value,
//                   rate: e.target.rate.value,
//                 });
//               }}
//             >
//               <FormGroup>
//                 <Label for="employeeName">Employee Name:</Label>
//                 <Input
//                   required="required"
//                   type="text"
//                   name="employeeName"
//                   defaultValue={selectedData?.employeeName || ""}
//                 />
//               </FormGroup>
//               <FormGroup>
//                 <Label for="overtime">Overtime:</Label>
//                 <Input
//                   required="required"
//                   type="number"
//                   name="overtime"
//                   defaultValue={selectedData?.overtime || ""}
//                 />
//               </FormGroup>
//               <FormGroup>
//                 <Label for="numberofDays">Number of Days:</Label>
//                 <Input
//                   required="required"
//                   type="number"
//                   name="numberofDays"
//                   defaultValue={selectedData?.numberofDays || ""}
//                 />
//               </FormGroup>
//               <FormGroup>
//                 <Label for="hours">Hours:</Label>
//                 <Input
//                   required="required"
//                   type="number"
//                   name="hours"
//                   defaultValue={selectedData?.hours || ""}
//                 />
//               </FormGroup>
//               <FormGroup>
//                 <Label for="rate">Rate:</Label>
//                 <Input
//                   required="required"
//                   type="number"
//                   name="rate"
//                   defaultValue={selectedData?.rate || ""}
//                 />
//               </FormGroup>
//               <Button color="primary" type="submit">
//                 Save
//               </Button>
//               {"  "}
//               <Button color="secondary" onClick={toggleModal}>
//                 Cancel
//               </Button>
//             </Form>
//           </ModalBody>
//         </Modal>
//       </CardBody>
//     </Card>
//   );
// };

const PayslipForm = () => {
  return (
    <div>
      <Row>
        <Col sm="12" md="6">
          <EmployeeSalaryForm />
        </Col>
        <Col sm="12" md="6">
          <TaForm />
        </Col>
      </Row>
      {/* <Row>
        <Col sm="12" md="6">
          <TravellingForm />
        </Col>
        <Col sm="12" md="6">
          <Esiform />
        </Col>
      </Row> */}
      {/* <Row>
        <Col sm="12" md="6">
          <Advance />
        </Col>
        <Col sm="12" md="6">
          <Pfform />
        </Col>
      </Row> */}
      {/* <Row>
        <Col sm="12" md="6">
          <Insurance />
        </Col>
        <Col sm="12" md="6">
          <Payslip />
        </Col>
      </Row>
      <Row>
        <Col sm="12" md="6">
          <Loanform />
        </Col>
        <Col sm="12" md="6">
          <Over />
        </Col>
      </Row> */}
    </div>
  );
};

export default PayslipForm;
