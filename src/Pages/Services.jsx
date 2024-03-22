import React, { useState, useEffect } from "react";
import { addService, fetchService, fetchSkills, updateService } from "../api";
import { useLocation, useNavigate, useParams } from "react-router";

export default function Services() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
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
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Add Service</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Name"
          required
          readOnly={view}
          className="mb-3"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          cols="30"
          rows="5"
          placeholder="Description"
          required
          readOnly={view}
          className="mb-3"
        />
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
}
