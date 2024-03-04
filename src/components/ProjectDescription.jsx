import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
const ProjectDescription = ({ setFormData, formData }) => {
  const [description, setDescription] = useState("");

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  return (
    <div>
      <h5 className="text-white mb-3">Project Description</h5>
      <ReactQuill
        theme="snow"
        placeholder="Description"
        value={formData?.description}
        onChange={handleDescriptionChange}
        // style={{ background: "white" }}
      />
    </div>
  );
};

export default ProjectDescription;
