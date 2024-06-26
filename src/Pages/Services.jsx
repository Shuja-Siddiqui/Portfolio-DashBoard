import React, { useState, useEffect } from "react";
import { addService, fetchService, fetchSkills, updateService } from "../api";
import { useLocation, useNavigate, useParams } from "react-router";

export default function Services() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [allskills, setAllSkills] = useState([]);
  const [view, setView] = useState(false);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    }
    if (location.pathname.split("/")[2] === "view") {
      setView(true);
    }
  }, [params]);

  const getSkills = async () => {
    const skills = await fetchSkills();
    if (skills) {
      setAllSkills(skills);
    }
  };

  const getService = async () => {
    const service = await fetchService(id);
    if (service) {
      setFormData(service);
    }
  };

  useEffect(() => {
    if (!id) {
      getSkills();
    }
  }, []);

  useEffect(() => {
    if (id) getService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (!id) {
        res = await addService(formData);
      } else {
        res = await updateService(id, formData);
      }
      if (res) {
        navigate("/servicesDashboard");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const wordLimit = 30; // Adjust the word limit as needed
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) {
      setFormData({ ...formData, description: text });
    }
  };

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Add Service</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          required
          readOnly={view}
          className="mb-3"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          cols="30"
          rows="5"
          placeholder="Description"
          required
          readOnly={view}
          className="mb-3"
        />
        {/* <button type="submit">SUBMIT</button> */}
        {location.pathname.split("/")[2] === "view" ? (
          <></>
        ) : (
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : location.pathname.split("/")[2] === "edit"
              ? "UPDATE"
              : "SUBMIT"}
          </button>
        )}
      </form>
    </div>
  );
}
