import React, { useState } from 'react';

const JobTitleForm = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    branch: '',
    jobCategory: '',
    numPositions: 1,
    status: '',
    startDate: '',
    endDate: '',
    skills: '',
    jobDescription: '',
    jobRequirements: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="job-create-container">
      <h1> Create Job </h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="jobTitle">Job Title:</label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          required
        />


        <label htmlFor="branch">Branch:</label>
        <select
          id="branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
        >
          <option value="">-- Select --</option>

        </select>

        <label htmlFor="jobCategory">Job Category:</label>
        <select
          id="jobCategory"
          name="jobCategory"
          value={formData.jobCategory}
          onChange={handleChange}
        >
          <option value="">-- Select --</option>

        </select>

        <label htmlFor="numPositions">Number of Positions:</label>
        <input
          type="number"
          id="numPositions"
          name="numPositions"
          min="1"
          value={formData.numPositions}
          onChange={handleChange}
        />

        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />

        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />

        <label htmlFor="skills">Skills:</label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
        />

        <label htmlFor="jobDescription">Job Description:</label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="jobRequirements">Job Requirements:</label>
        <textarea
          id="jobRequirements"
          name="jobRequirements"
          value={formData.jobRequirements}
          onChange={handleChange}
        ></textarea>


        <button type="submit">Create</button>
      </form>

      {/* <div className="action-buttons">
        <button onClick={() => console.log('Add clicked')}>Add</button>
        <button onClick={() => console.log('Edit clicked')}>Edit</button>
        <button onClick={() => console.log('View clicked')}>View</button>
        <button onClick={() => console.log('Delete clicked')}>Delete</button>
      </div> */}
    </div>
  );
};

export default JobTitleForm;
