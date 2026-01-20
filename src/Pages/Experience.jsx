import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import {
  addExperience,
  fetchAllDevelopers,
  fetchExperience,
  updateExperience,
} from "../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const Experience = () => {
  const [developers, setDevelopers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState(false);
  const [id, setId] = useState("");
  const [formData, setFormData] = useState({
    devId: "",
    company: "",
    role: "",
    timeSpan: {
      startYear: "",
      endYear: "",
    },
    description: "",
    summary: "",
  });

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  //   HANDLE FORM STATE
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startYear" || (name === "endYear" && name !== "role")) {
      let tempTimeSpan = { ...formData.timeSpan };
      tempTimeSpan[name] = value;
      setFormData({ ...formData, timeSpan: tempTimeSpan });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // USE EFFECT TO CHECK IF ITs EDIT/VIEW REQ

  useEffect(() => {
    if (params?.id) setId(params.id);
    else setId("");

    setView(location.pathname.split("/")[2] === "view");
  }, [params?.id, location.pathname]);

  // USEFFECT FOR DEVS
  useEffect(() => {
    (async () => {
      const devs = await fetchAllDevelopers();
      if (devs?.status === 200) {
        setDevelopers(devs?.data);
      }
    })();
  }, []);

  //   GET EXPERIENCE TO EDIT
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetchExperience(id);
        if (res?.status === 200) {
          setFormData(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (!id) {
        res = await addExperience(formData);
        if (res?.status === 200 || res?.status === 201) {
          console.log(res);
          setFormData({
            devId: "",
            company: "",
            role: "",
            timeSpan: {
              startYear: "",
              endYear: "",
            },
            description: "",
          });
        }
      } else {
        res = await updateExperience(id, formData);
        if (res?.status === 200 || res?.status === 201) {
          console.log(res);
          setFormData({
            devId: "",
            company: "",
            role: "",
            timeSpan: {
              startYear: "",
              endYear: "",
            },
            description: "",
          });
        }
      }
      if (res) {
        navigate("/developers");
        alert("Update Successfully!");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Summary</Form.Label>
        <Form.Control
          required
          as="textarea"
          className="mb-3"
          rows={3}
          placeholder="Enter summary"
          name="summary"
          value={formData?.summary}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Developer ID</Form.Label>
        <Form.Control
          required
          as="select"
          name="devId"
          value={formData?.devId}
          onChange={handleChange}
          disabled={
            location.pathname.split("/")[2] === "edit" || view ? true : false
          }
        >
          <option value="">Select Developer ID</option>
          {developers.map((developer) => (
            <option key={developer._id} value={developer._id}>
              {developer.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Company</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Enter company"
          name="company"
          value={formData?.company}
          onChange={handleChange}
          readOnly={view}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Time Span</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Start Year"
          name="startYear"
          value={formData?.timeSpan?.startYear}
          onChange={handleChange}
          readOnly={view}
        />
        <Form.Control
          required
          type="text"
          placeholder="End Year"
          name="endYear"
          value={formData?.timeSpan?.endYear}
          onChange={handleChange}
          readOnly={view}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Role</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Enter role"
          name="role"
          value={formData?.role}
          onChange={handleChange}
          readOnly={view}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          required
          as="textarea"
          className="mb-3"
          rows={3}
          placeholder="Enter description"
          name="description"
          value={formData?.description}
          onChange={handleChange}
          readOnly={view}
        />
      </Form.Group>

      {location.pathname.split("/")[2] === "view" ? (
        <></>
      ) : (
        <button variant="primary" type="submit" disabled={isLoading}>
          {isLoading
            ? "Loading..."
            : location.pathname.split("/")[2] === "edit"
            ? "UPDATE"
            : "SUBMIT"}
        </button>
      )}
    </Form>
  );
};
