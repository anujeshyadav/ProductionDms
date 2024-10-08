import React, { useState } from 'react';
import './JobApplicationPage.css';

const JobApplicationPage = () => {
  const [formData, setFormData] = useState({
    selectedJob: '',
    name: '',
    email: '',
    phoneNumber: '',
  });

  const jobOptions = ['Job 1', 'Job 2', 'Job 3']; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="job-application-container">
      <h2>Job Application/ Result </h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="selectedJob">Select Job:</label>
        <select
          id="selectedJob"
          name="selectedJob"
          value={formData.selectedJob}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Job --</option>
          {jobOptions.map((job, index) => (
            <option key={index} value={job}>
              {job}
            </option>
          ))}
        </select>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default JobApplicationPage;
