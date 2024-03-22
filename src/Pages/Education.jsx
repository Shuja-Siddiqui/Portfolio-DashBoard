import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  addEducation,
  fetchAllDevelopers,
  fetchEducation,
  updateEducation,
} from "../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const Education = () => {
  const [developers, setDevelopers] = useState([]);
  const [view, setView] = useState(false);
  const [id, setId] = useState("");
  const [formData, setFormData] = useState({
    devId: "",
    institution: "",
    major: "",
    timeSpan: {
      startYear: "",
      endYear: "",
    },
    description: "",
  });

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  //   GET ALL DEVS
  const getAllDevelopers = async () => {
    const devs = await fetchAllDevelopers();
    if (devs?.status === 200) {
      setDevelopers(devs?.data);
    }
  };

  //   HANDLE FORM STATE
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startYear" || (name === "endYear" && name !== "major")) {
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

  const getEducation = async () => {
    try {
      const res = await fetchEducation(id);
      console.log(res);
      if (res?.status === 200) {
        setFormData(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // USE EFFECT TO CHECK IF ITs EDIT/VIEW REQ

  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    }
    if (location.pathname.split("/")[2] === "view") {
      setView(true);
    }
  }, [params]);

  // USEFFECT FOR DEVS
  useEffect(() => {
    getAllDevelopers();
  }, []);

  //   GET EDUCATION TO EDIT
  useEffect(() => {
    if (id) getEducation();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (!id) {
        res = await addEducation(formData);
        if (res?.status === 200 || res?.status === 201) {
          console.log(res);
          setFormData({
            devId: "",
            institution: "",
            major: "",
            timeSpan: {
              startYear: "",
              endYear: "",
            },
            description: "",
          });
        }
      } else {
        res = await updateEducation(id, formData);
        if (res?.status === 200 || res?.status === 201) {
          console.log(res);
          setFormData({
            devId: "",
            institution: "",
            major: "",
            timeSpan: {
              startYear: "",
              endYear: "",
            },
            description: "",
          });
        }
      }
      if (res) {
        // navigate("/servicesDashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <Form onSubmit={handleSubmit}>
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
        <Form.Label>Institution</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Enter institution"
          name="institution"
          value={formData?.institution}
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
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Major</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Enter major"
          name="major"
          value={formData?.major}
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

      <button variant="primary" type="submit">
        {location.pathname.split("/")[2] === "edit" ? "UPDATE" : "SUBMIT"}
      </button>
    </Form>
  );
};
