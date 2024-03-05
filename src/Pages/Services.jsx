import React, { useState, useEffect } from "react";
import { addservice, fetchService, fetchSkills, updateService } from "../api";
import { useLocation, useNavigate, useParams } from "react-router";

export default function Services() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedSkill, setSelectedSkill] = useState("");
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
      setSelectedSkill(service.name?._id);
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
        res = await addservice(formData);
      } else {
        formData["name"] = formData?.name?._id;
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
        {!id && (
          <select
            name="name"
            id=""
            required
            value={selectedSkill} // Use selectedSkill to set value
            onChange={(e) => {
              setSelectedSkill(e.target.value);
              setFormData({ ...formData, name: { _id: e.target.value } }); // Set _id to formData
            }}
          >
            <option value="">Select...</option>
            {allskills?.map(({ skillName, _id, index }) => (
              <option key={index} value={_id}>
                {skillName}
              </option>
            ))}
          </select>
        )}
        {id && (
          <input name="name" id="" value={formData?.name?.skillName} readOnly />
        )}
        <textarea
          name="description"
          id=""
          value={formData?.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          col="30"
          rows="5"
          placeholder="Discription"
          required
          readOnly={view}
          className="mb-3"
        />
        <button>SUBMIT</button>
      </form>
    </div>
  );
}
