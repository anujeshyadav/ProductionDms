import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  HRM_BRANCH_CATEGORY,
  HRM_BRANCH_VIEW,
  HRM_BRANCH_DELETE,
} from "../../../../../../ApiEndPoint/Api";
import {
  HRM_JOB_CATEGORY,
  HRM_JOB_VIEW_CATEGORY,
  HRM_JOB_DELETE_CATEGORY,
} from "../../../../../../ApiEndPoint/Api";
import { _Get, _GetList } from "../../../../../../ApiEndPoint/ApiCalling";
import { _PostSave } from "../../../../../../ApiEndPoint/ApiCalling";
import { IoIosAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import { _Delete } from "../../../../../../ApiEndPoint/ApiCalling";
import { HRM_CREATE_JOB } from "../../../../../../ApiEndPoint/Api";
import { useHistory } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import swal from "sweetalert";

const JoForm = () => {
  const history = useHistory();
  const [data, setData] = useState({
    jobTitle: "",
    branch: "",
    jobCategory: "",
    numberOfPositions: "",
    status: "",
    startDate: "",
    endDate: "",
    skills: "",
    jobDescription: "",
    jobRequirements: "",
    database: "",
  });

  const [branchModal, setBranchModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [newBranch, setNewBranch] = useState("");
  const [branches, setBranches] = useState([]);

  const toggleBranchModal = () => setBranchModal(!branchModal);
  const toggleCategoryModal = () => setCategoryModal(!categoryModal);

  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const toggleCategoriesModal = () =>
    setShowCategoriesModal(!showCategoriesModal);

  const [showBranchesModal, setShowBranchesModal] = useState(false);
  const toggleBranchesModal = () => setShowBranchesModal(!showBranchesModal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    try {
      await _PostSave(HRM_CREATE_JOB, data);
      resetForm();
      history.push("/app/ajgroup/HRM/JobList");
    } catch (error) {
      console.log(error);
    }
    console.log("Form submitted:", data);
  };

  useEffect(() => {
    let userinfo = JSON.parse(localStorage.getItem("userData"));
    setData({ ...data, database: userinfo.database });
  }, []);

  const resetForm = () => {
    setData({
      jobTitle: "",
      branch: "",
      jobCategory: "",
      numberOfPositions: "",
      status: "",
      startDate: "",
      endDate: "",
      skills: "",
      jobDescription: "",
      jobRequirements: "",
    });
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      console.log("Deleting category:", categoryId);
      await _Delete(HRM_JOB_DELETE_CATEGORY, categoryId);

      const updatedCategories = categories?.filter(
        (category) => category?._id !== categoryId
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };

  const handleRemoveBranch = async (branchId) => {
    try {
      await _Delete(HRM_BRANCH_DELETE, branchId);

      const updatedBranches = branches?.filter(
        (branch) => branch?._id !== branchId
      );
      setBranches(updatedBranches);
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (newCategory.trim() === "") {
      console.error("New category cannot be empty");
      return;
    }
    const payload = {
      name: newCategory,
      database: JSON.parse(localStorage.getItem("userData"))?.database,
    };
    try {
      const res = await _PostSave(HRM_JOB_CATEGORY, payload);
      console.log(res);
      toggleCategoryModal();
      fetchJobCategories(payload?.database);
      if (res && res.success) {
        setNewCategory("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJobCategories = (db) => {
    _Get(HRM_JOB_VIEW_CATEGORY, db)
      .then((res) => {
        setCategories(res?.JobCategory);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    let db = JSON.parse(localStorage.getItem("userData"))?.database;
    fetchJobCategories(db);
  }, []);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem("userData"));
    console.log(newBranch);
    if (newBranch.trim() === "") {
      console.error("New branch cannot be empty");
      return;
    }
    const payload = {
      name: newBranch,
      database: user?.database,
    };
    try {
      const res = await _PostSave(HRM_BRANCH_CATEGORY, payload);
      toggleBranchModal();
      getBranches(user?.database);

      if (res && res.success) {
        setNewBranch("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBranches = async (db) => {
    _Get(HRM_BRANCH_VIEW, db)
      .then((res) => {
        setBranches(res?.JobBatch);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));
    getBranches(user?.database);
  }, []);

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Card>
      <CardHeader>
        <h2>Job Form</h2>
        <Button color="danger" onClick={handleBack}>
          Back
        </Button>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="jobTitle">Job Title</Label>
                <Input
                  required="required"
                  type="text"
                  name="jobTitle"
                  id="jobTitle"
                  value={data.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Enter job title"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="branch">Branch</Label>{" "}
                <span
                  onClick={toggleBranchModal}
                  style={{
                    cursor: "pointer",
                    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #ccc",
                    backgroundColor: "lightblue",
                    borderRadius: "15px",
                  }}
                  size="sm">
                  <IoIosAdd size={17} color="blue" />
                </span>
                <span
                  onClick={toggleBranchesModal}
                  style={{
                    cursor: "pointer",
                    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #ccc",
                    backgroundColor: "lightblue",
                    marginLeft: "3%",
                    borderRadius: "15px",
                  }}
                  size="sm">
                  <FiMinus size={16} color="blue" />
                </span>
                <Input
                  required="required"
                  type="select"
                  name="branch"
                  id="branch"
                  style={{height:'51px',borderRadius:'10px'}}
                  value={data.branch}
                  onChange={handleInputChange}
                  placeholder="Select Branch">
                  <option value="">Select Branch</option>

                  {branches &&
                    branches
                      .filter((branch) => branch?.name.trim() !== "")
                      .map((branch) => (
                        <option key={branch?._id} value={branch?._id}>
                          {branch?.name}
                        </option>
                      ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="jobCategory">Job Category</Label>
                <span
                  onClick={toggleCategoryModal}
                  style={{
                    cursor: "pointer",
                    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #ccc",
                    backgroundColor: "lightblue",
                    borderRadius: "15px",
                    marginLeft:'5px'
                  }}
                  size="sm">
                  <IoIosAdd size={17} color="blue" />
                </span>
                <span
                  onClick={toggleCategoriesModal}
                  style={{
                    cursor: "pointer",
                    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #ccc",
                    backgroundColor: "lightblue",
                    marginLeft: "3%",
                    borderRadius: "15px",
                  }}
                  size="sm">
                  <FiMinus size={16} color="blue" />
                </span>
                <Input
                  required="required"
                  type="select"
                  style={{height:'51px',borderRadius:'10px'}}
                  name="jobCategory"
                  id="jobCategory"
                  value={data.jobCategory}
                  onChange={handleInputChange}
                  placeholder="Select job category">
                  <option value="">Select Job Category</option>
                  {categories &&
                    categories
                      .filter((category) => category?.name.trim() !== "")
                      .map((category) => (
                        <option key={category?._id} value={category?._id}>
                          {category?.name}
                        </option>
                      ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="numberOfPositions">Number of Positions</Label>
                <Input
                  required="required"
                  type="Number"
                  name="numberOfPositions"
                  id="numberOfPositions"
                  value={data.numberOfPositions}
                  onChange={handleInputChange}
                  placeholder="Enter number of positions"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="startDate">Start Date</Label>
                <Input
                  required="required"
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={data.startDate}
                  onChange={handleInputChange}
                  placeholder="Select start date"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="endDate">End Date</Label>
                <Input
                  required="required"
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={data.endDate}
                  onChange={handleInputChange}
                  placeholder="Select end date"
                />
              </FormGroup>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="jobDescription">Job Description</Label>
                <ReactQuill
                  required
                  theme="snow"
                  value={data.jobDescription}
                  onChange={(e) => {
                    setData({ ...data, jobDescription: e });
                  }}
                  placeholder="Enter job description"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="jobRequirements">Job Requirements</Label>
                <ReactQuill
                  required
                  theme="snow"
                  value={data.jobRequirements}
                  onChange={(e) => {
                    setData({ ...data, jobRequirements: e });
                  }}
                  placeholder="Enter job requirements"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            
            <Col md={6}>
              <FormGroup>
                <Label for="skill">Skill</Label>
                <Input
                  required="required"
                  type=""
                  name="skills"
                  id="skills"
                  value={data.skills}
                  onChange={handleInputChange}
                  placeholder="Enter required skills"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Status</Label>
                <div className="form-label-group">
                  <input
                    required
                    style={{ marginRight: "3px" }}
                    type="radio"
                    name="status"
                    value="Active"
                    checked={data.status === "Active"}
                    onChange={handleInputChange}
                  />
                  <span style={{ marginRight: "20px" }}>Active</span>

                  <input
                    required
                    style={{ marginRight: "3px" }}
                    type="radio"
                    name="status"
                    value="Deactive"
                    checked={data.status === "Deactive"}
                    onChange={handleInputChange}
                  />
                  <span style={{ marginRight: "3px" }}>Deactive</span>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup row>
            <Col sm={{ size: 8, offset: 5 }}>
              <Button color="primary" type="submit">
                Create
              </Button>
            </Col>
          </FormGroup>
        </Form>

        <Form>
          <FormGroup>
            <Modal
              isOpen={branchModal}
              toggle={toggleBranchModal}
              backdrop="static">
              <ModalHeader toggle={toggleBranchModal}>
                Create New Branch
              </ModalHeader>
              <ModalBody>
                <Label for="newBranch">Create Branch : </Label>
                <Input
                  type="text"
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  placeholder="Enter new branch"
                  style={{ width: "85%", margin: "10px" }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={toggleBranchModal}
                  style={{ fontSize: "15px", padding: "10px 10px" }}>
                  Cancel
                </Button>

                <Button
                  color="success"
                  onClick={handleCreateBranch}
                  style={{ fontSize: "15px", padding: "10px 10px" }}>
                  Create
                </Button>
              </ModalFooter>
            </Modal>
          </FormGroup>

          <FormGroup>
            <Modal
              isOpen={categoryModal}
              toggle={toggleCategoryModal}
              backdrop="static">
              <ModalHeader toggle={toggleCategoryModal}>
                Create Job Category
              </ModalHeader>
              <ModalBody>
                <Label for="newcategory"> Create Category : </Label>

                <Input
                  required="required"
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                  style={{ width: "85%", margin: "10px" }}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onClick={toggleCategoryModal}
                  style={{ fontSize: "15px", padding: "10px 10px" }}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  onClick={handleCreateCategory}
                  style={{ fontSize: "15px", padding: "10px 10px" }}>
                  Create
                </Button>
              </ModalFooter>
            </Modal>
          </FormGroup>

          <FormGroup>
            <Modal
              isOpen={showCategoriesModal}
              toggle={toggleCategoriesModal}
              backdrop="static">
              <ModalHeader toggle={toggleCategoriesModal}>
                Manage Categories
              </ModalHeader>
              <ModalBody>
                <ul className="list-group">
                  {categories
                    .filter((category) => category.name)
                    .map((category) => (
                      <li
                        key={category?._id}
                        className="list-group-item d-flex justify-content-between align-items-center">
                        {category?.name}

                        <Button
                          color="danger"
                          outline
                          onClick={() => handleRemoveCategory(category?._id)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={toggleCategoriesModal}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>
          </FormGroup>

          <FormGroup>
            <Modal
              isOpen={showBranchesModal}
              toggle={toggleBranchesModal}
              backdrop="static">
              <ModalHeader toggle={toggleBranchesModal}>
                Manage Branches
              </ModalHeader>
              <ModalBody>
                <ul className="list-group">
                  {branches
                    .filter((branch) => branch.name)
                    .map((branch) => (
                      <li
                        key={branch?._id}
                        className="list-group-item d-flex justify-content-between align-items-center">
                        {branch?.name}
                        <Button
                          color="danger"
                          outline
                          // onClick={() => handleRemoveItem(branch?._id, 'branch')}
                          onClick={() => handleRemoveBranch(branch?._id)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={toggleBranchesModal}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

// export default JobForm;

// const CustomQuestionsCard = ({ customFormData, handleCustomInputChange }) => {
//   return (
//     <Card>
//       <CardBody>
//         <h3>Custom Questions</h3>
//         <Form>
//           {/* Custom Questions */}
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.weakness}
//                 onChange={() => handleCustomInputChange('weakness')}
//               />
//               What Do You Consider to Be Your Weaknesses? *
//             </Label>
//           </FormGroup>
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.jobReason}
//                 onChange={() => handleCustomInputChange('jobReason')}
//               />
//               Why Do You Want This Job?
//             </Label>
//           </FormGroup>
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.companyReason}
//                 onChange={() => handleCustomInputChange('companyReason')}
//               />
//               Why Do You Want to Work at This Company?
//             </Label>
//           </FormGroup>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// const NeedToAskCard = ({ customFormData, handleCustomInputChange }) => {
//   return (
//     <Card>
//       <CardBody>
//         <h3>Need to Ask?</h3>
//         <Form>
//           {/* Need to Ask? Section */}
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.gender}
//                 onChange={() => handleCustomInputChange('gender')}
//               />
//               Gender
//             </Label>
//           </FormGroup>
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.dateOfBirth}
//                 onChange={() => handleCustomInputChange('dateOfBirth')}
//               />
//               Date Of Birth
//             </Label>
//           </FormGroup>
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.address}
//                 onChange={() => handleCustomInputChange('address')}
//               />
//               Address
//             </Label>
//           </FormGroup>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// const OptionsCard = ({ customFormData, handleCustomInputChange }) => {
//   return (
//     <Card>
//       <CardBody>
//         <h3>Options</h3>
//         <Form>
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.profileImage}
//                 onChange={() => handleCustomInputChange('profileImage')}
//               />
//               Profile Image
//             </Label>
//           </FormGroup>
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.resume}
//                 onChange={() => handleCustomInputChange('resume')}
//               />
//               Resume
//             </Label>
//           </FormGroup>
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.coverLetter}
//                 onChange={() => handleCustomInputChange('coverLetter')}
//               />
//               Cover Letter
//             </Label>
//           </FormGroup>
//           <FormGroup>
//             <Label check>
//               <Input
//                 type="checkbox"
//                 checked={customFormData.termsAndConditions}
//                 onChange={() => handleCustomInputChange('termsAndConditions')}
//               />
//               Terms And Conditions
//             </Label>
//           </FormGroup>
//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

// export default MainComponent;

// const CombinedCard = ({ customFormData, handleCustomInputChange }) => {
//   return (
//     <Card >
//       <CardBody>
//         <Form>
//           <div className="row">
//             <div className="col-md-6">
//               <h3>Need to Ask?</h3>
//               <div class="my-4">
//                 <FormGroup check>

//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.gender}
//                       onChange={() => handleCustomInputChange('gender')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.gender ? 'green' : 'transparent' }}></span>
//                     Gender
//                   </Label>
//                 </FormGroup>
//                 <FormGroup check>
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.dateOfBirth}
//                       onChange={() => handleCustomInputChange('dateOfBirth')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.dateOfBirth ? 'green' : 'transparent' }}></span>
//                     Date Of Birth
//                   </Label>
//                 </FormGroup>
//                 <FormGroup check>
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.address}
//                       onChange={() => handleCustomInputChange('address')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.address ? 'green' : 'transparent' }}></span>
//                     Address
//                   </Label>
//                 </FormGroup>
//               </div>
//             </div>

//             <div className="col-md-6">
//               <h3> Need to show Options ?</h3>
//               <div class="my-4">
//                 <FormGroup check>
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.profileImage}
//                       onChange={() => handleCustomInputChange('profileImage')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.profileImage ? 'green' : 'transparent' }}></span>
//                     Profile Image
//                   </Label>
//                 </FormGroup>
//                 <FormGroup check>
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.resume}
//                       onChange={() => handleCustomInputChange('resume')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.resume ? 'green' : 'transparent' }}></span>
//                     Resume
//                   </Label>
//                 </FormGroup>
//                 <FormGroup check>
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.coverLetter}
//                       onChange={() => handleCustomInputChange('coverLetter')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.coverLetter ? 'green' : 'transparent' }}></span>
//                     Cover Letter
//                   </Label>
//                 </FormGroup>
//                 <FormGroup check>
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.termsAndConditions}
//                       onChange={() => handleCustomInputChange('termsAndConditions')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.termsAndConditions ? 'green' : 'transparent' }}></span>
//                     Terms And Conditions
//                   </Label>

//                 </FormGroup>
//               </div>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-md-12">
//               <h3>Custom Questions</h3>
//               <div class="my-4">
//                 <FormGroup check>
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.weakness}
//                       onChange={() => handleCustomInputChange('weakness')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.weakness ? 'green' : 'transparent' }}></span>
//                     What Do You Consider to Be Your Weaknesses? *
//                   </Label>
//                 </FormGroup>
//                 <FormGroup check>
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.jobReason}
//                       onChange={() => handleCustomInputChange('jobReason')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.jobReason ? 'green' : 'transparent' }}></span>
//                     Why Do You Want This Job?
//                   </Label>
//                 </FormGroup>
//                 <FormGroup check>
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={customFormData.companyReason}
//                       onChange={() => handleCustomInputChange('companyReason')}
//                     />
//                     <span className="checkmark" style={{ backgroundColor: customFormData.companyReason ? 'green' : 'transparent' }}></span>
//                     Why Do You Want to Work at This Company?
//                   </Label>
//                 </FormGroup>
//               </div>
//             </div>
//           </div>

//         </Form>
//       </CardBody>
//     </Card>
//   );
// };

const JobForm = () => {
  // const [customFormData, setCustomFormData] = useState({
  //   weakness: false,
  //   jobReason: false,
  //   companyReason: false,
  //   gender: false,
  //   dateOfBirth: false,
  //   address: false,
  //   profileImage: false,
  //   resume: false,
  //   coverLetter: false,
  //   termsAndConditions: false,
  // });

  // const handleCustomInputChange = (field) => {
  //   setCustomFormData({ ...customFormData, [field]: !customFormData[field] });
  // };

  return (
    <div>
      <Row>
        <Col sm="12" md="7" className="mx-auto">
          <JoForm />
        </Col>
        {/* <Col >
          <CombinedCard customFormData={customFormData} handleCustomInputChange={handleCustomInputChange} />
        </Col> */}
      </Row>
    </div>
  );
};

export default JobForm;
