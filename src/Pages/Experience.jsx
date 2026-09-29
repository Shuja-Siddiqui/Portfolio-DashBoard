import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import {
  addExperience,
  fetchAllDevelopers,
  fetchExperience,
  updateExperience,
} from "../api";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

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
  });

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startYear" || name === "endYear") {
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

  useEffect(() => {
    if (params?.id) setId(params.id);
    else setId("");

    setView(location.pathname.split("/")[2] === "view");
  }, [params?.id, location.pathname]);

  useEffect(() => {
    (async () => {
      const devs = await fetchAllDevelopers();
      if (devs?.status === 200) {
        setDevelopers(devs?.data);
      }
    })();
  }, []);

  useEffect(() => {
    const qDevId = searchParams.get("devId");
    if (qDevId) {
      setFormData((prev) => ({
        ...prev,
        devId: prev.devId || qDevId,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetchExperience(id);
        if (res?.status === 200) {
          const data = res?.data || {};
          const fromDoc =
            typeof data.devId === "object" && data.devId?._id
              ? data.devId._id
              : data.devId || "";
          setFormData((prev) => ({
            company: data.company || "",
            role: data.role || "",
            description: data.description || "",
            timeSpan: data.timeSpan || { startYear: "", endYear: "" },
            devId: fromDoc || prev.devId || searchParams.get("devId") || "",
          }));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (!id) {
        res = await addExperience(formData);
      } else {
        res = await updateExperience(id, formData);
      }
      if (res?.status === 200 || res?.status === 201) {
        const dest = formData.devId
          ? `/developers/edit/${formData.devId}`
          : "/experienceDashboard";
        navigate(dest);
        alert(
          id
            ? "Experience updated successfully!"
            : "Experience added successfully!"
        );
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Developer ID</Form.Label>
        <Form.Control
          required={!id}
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

      {location.pathname.split("/")[2] === "view" ? null : (
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
