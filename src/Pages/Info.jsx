import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import {
  createDeveloper,
  createImageId,
  addSkill,
  fetchSkills,
  fetchProjects,
  getDeveloper,
  updateDeveloper,
  baseURL,
  fetchTestimonials,
  fetchServices,
  addService,
  removeEducation,
  removeExperience,
} from "../api";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { availability, spokenLanguages } from "../utils";
import { SERVICE_ICON_OPTIONS, getServiceIcon } from "../utils/serviceIcons";
import { SearchableMultiSelect } from "../components/Info/SearchableMultiSelect";
import "../components/Info/AdminEntity.css";

// const uid = localStorage.getItem("user_id");

export default function Info() {
  const [show, setShow] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showSerivce, setShowSerivce] = useState(false);
  const [file, setFile] = useState("");
  const [bufferedFile, setBufferedFile] = useState("");
  const [skill, setSkill] = useState({ skillName: "" });
  const [skillSearch, setSkillSearch] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [resumeEducation, setResumeEducation] = useState([]);
  const [resumeExperience, setResumeExperience] = useState([]);
  const [service, setService] = useState({
    name: "",
    description: "",
    icon: "code",
  });
  const [allSkills, setAllSkills] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allTestimonials, setAllTestimonials] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [view, setView] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    devId: "",
    country: "",
    city: "",
    devCV: "",
    email: "",
    phoneNo: "",
    skype: "",
    about: "",
    intro: "",
    introVideo: "",
    avatar: "",
    skills: [],
    links: [],
    projects: [],
    testimonials: [],
    services: [],
    languages: [],
    availability: "",
  });
  const [linkDraft, setLinkDraft] = useState({ title: "", url: "" });
  const platformPresets = [
    "GitHub",
    "LinkedIn",
    "StackOverflow",
    "Upwork",
    "Kaggle",
    "Fiverr",
    "Behance",
    "Dribbble",
    "Twitter",
    "X",
    "Instagram",
    "YouTube",
    "Medium",
    "Dev.to",
    "Portfolio",
    "Other",
  ];
  const navigate = useNavigate();
  const location = useLocation();
  // Delete links
  const handleDelete = (index) => {
    setFormData((preData) => {
      const updatedData = [...preData?.links];
      updatedData?.splice(index, 1);
      return {
        ...preData,
        links: updatedData,
      };
    });
  };

  // Add Skills
  const handleSkill = async () => {
    const skillName = skill;
    if (skillName) {
      await addSkill({ skillName: skillName });
      await getAllSkills();
      handleClose();
    } else {
      console.log("Title and path are required.");
    }
  };

  // Add Service
  const handleService = async () => {
    if (service) {
      const res = await addService({
        name: service.name,
        description: service?.description,
        icon: service?.icon || "code",
      });
      if (res?.status === 201 || res?.status === 200) {
        await getallServices();
        setService({ name: "", description: "", icon: "code" });
      }
      handleCloseServiceModel();
    } else {
      console.log("Title and Description are required.");
    }
  };

  //Fetch all projects, skill

  const getAllSkills = useCallback(async () => {
    const skills = await fetchSkills();
    setAllSkills(skills);
  }, []);
  const getallServices = useCallback(async () => {
    const services = await fetchServices();
    setAllServices(services);
  }, []);
  const getAlllTestimonials = useCallback(async () => {
    const testimonial = await fetchTestimonials();
    setAllTestimonials(testimonial);
  }, []);

  const getAllProjects = useCallback(async () => {
    const projects = await fetchProjects();
    setAllProjects(projects);
  }, []);

  useEffect(() => {
    getAlllTestimonials();
    getAllSkills();
    getAllProjects();
    getallServices();
  }, [getAllProjects, getAllSkills, getAlllTestimonials, getallServices]);

  // GET Single Developer To Edit
  const params = useParams();
  useEffect(() => {
    setView(location.pathname.split("/")[2] === "view");
  }, [location.pathname]);
  const fetchDeveloper = useCallback(async () => {
    if (!params?.id) return;
    const id = params.id;
    const developer = await getDeveloper(id);
    if (developer) {
        const refinedSkills = developer.skills.map((skill) => ({
          ratings: skill?.ratings,
          title: skill?.title?._id,
          skillName: skill?.title?.skillName,
          featured: Boolean(skill?.featured),
          typedOrder: skill?.typedOrder || "",
        }));
        setFile(developer?.avatar);
        setResumeEducation(
          Array.isArray(developer?.education) ? developer.education : []
        );
        setResumeExperience(
          Array.isArray(developer?.experience) ? developer.experience : []
        );
        // Update formData with refined skills only
        setFormData((prevFormData) => ({
          ...prevFormData,
          skills: refinedSkills,
        }));
        const refinedProjects = developer?.projects?.map((project) => ({
          id: project?._id,
          projectName: project?.projectName,
        }));
        setFormData((formData) => ({
          ...formData,
          projects: refinedProjects,
        }));
        // Update formData with refined Testimonials only
        const refinedTestimonials = developer?.testimonials?.map(
          (test) => test?._id
        );
        setFormData((formData) => ({
          ...formData,
          testimonials: refinedTestimonials,
        }));
        // Update formData with refined Services only
        const refinedServices = developer?.services?.map(
          (service) => service?._id
        );
        setFormData((formData) => ({
          ...formData,
          services: refinedServices,
        }));

        // Keep the remaining fields unchanged
        const {
          name,
          devId,
          country,
          city,
          devCV,
          email,
          phoneNo,
          skype,
          about,
          intro,
          introVideo,
          links,
          avatar,
          languages,
          availability,
        } = developer;
        const unchangedData = {
          name,
          devId,
          country,
          city,
          devCV,
          email,
          intro,
          introVideo: introVideo || "",
          phoneNo,
          skype,
          about,
          links: links?.length ? links : [],
          avatar,
          languages,
          availability,
        };

        // Update formData with the updated fields
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...unchangedData,
        }));
    } else {
      console.error("Developer not found");
    }
  }, [params?.id]);
  useEffect(() => {
    if (!file) return;
    // Only auto-build a URL when it's an existing stored filename/id
    if (typeof file === "string") {
      setBufferedFile(`${baseURL}/file/${file}`);
    }
  }, [file]);
  useEffect(() => {
    if (params?.id) fetchDeveloper();
  }, [params?.id, fetchDeveloper]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        links: (formData.links || []).filter((link) => link?.title && link?.url),
      };

      if (file instanceof File) {
        payload.avatar = await createImageId(file);
      } else if (params?.id) {
        payload.avatar = formData?.avatar || "";
      }

      let res;
      if (!params?.id) {
        res = await createDeveloper(payload);
      } else {
        res = await updateDeveloper(payload, params?.id);
      }
      if (res?.status === 201 || res?.status === 200) {
        alert("Updated successfully!");
        navigate("/developers");
      }
    } catch (error) {
      alert(error?.message || "Failed to save developer.");
    } finally {
      /* no-op: keep submit resilient */
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Modals
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseLinkModel = () => {
    setShowLink(false);
    setLinkDraft({ title: "", url: "" });
  };
  const handleShowLinkModel = () => setShowLink(true);
  const handleCloseServiceModel = () => setShowSerivce(false);
  const handleShowServiceModel = () => setShowSerivce(true);

  const saveLinkDraft = () => {
    const title = linkDraft.title.trim();
    const url = linkDraft.url.trim();
    if (!title || !url) {
      alert("Platform name and URL are required.");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      links: [...(prevData.links || []), { title, url }],
    }));
    handleCloseLinkModel();
  };

  const addNewLink = () => {
    setLinkDraft({ title: "", url: "" });
    handleShowLinkModel();
  };

  // LANGUAGES
  const handleLanguageChange = (event) => {
    const { value } = event.target;
    let updatedLanguages = [...formData.languages];

    if (updatedLanguages.includes(value)) {
      updatedLanguages = updatedLanguages.filter((lang) => lang !== value);
    } else {
      updatedLanguages.push(value);
    }

    setFormData({ ...formData, languages: updatedLanguages });
  };

  const selectedSkillIds = useMemo(
    () => new Set((formData.skills || []).map((s) => String(s.title))),
    [formData.skills]
  );

  const filteredSkills = useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    const list = allSkills || [];
    if (!q) return list.slice(0, 12);
    return list
      .filter((s) => s?.skillName?.toLowerCase().includes(q))
      .slice(0, 20);
  }, [allSkills, skillSearch]);

  const selectedSkills = useMemo(() => {
    return (formData.skills || [])
      .map((s) => {
        const skillMeta = allSkills.find(
          (sk) => String(sk._id) === String(s.title)
        );
        return {
          id: String(s.title),
          name: skillMeta?.skillName || s.skillName || s.title,
          typedOrder: s.typedOrder || "",
          featured: Boolean(s.featured),
        };
      })
      .filter((s) => s.id && s.id !== "undefined");
  }, [formData.skills, allSkills]);

  const nominatedCount = useMemo(
    () =>
      (formData.skills || []).filter(
        (s) => s?.typedOrder >= 1 && s?.typedOrder <= 5
      ).length,
    [formData.skills]
  );

  const toggleSkill = (skillId) => {
    const id = String(skillId);
    setFormData((prev) => {
      const updatedSkills = [...(prev.skills || [])];
      const indexToRemove = updatedSkills.findIndex(
        (formDataSkill) => String(formDataSkill?.title) === id
      );
      if (indexToRemove >= 0) {
        updatedSkills.splice(indexToRemove, 1);
      } else {
        updatedSkills.push({
          title: id,
          ratings: 1,
          featured: false,
          typedOrder: "",
        });
      }
      return { ...prev, skills: updatedSkills };
    });
  };

  const setSkillTypedOrder = (skillId, value) => {
    const order = value === "" ? "" : Number(value);
    setFormData((prev) => {
      const currentNominated = (prev.skills || []).filter(
        (s) => s?.typedOrder >= 1 && s?.typedOrder <= 5
      ).length;
      const selected = (prev.skills || []).find(
        (s) => String(s.title) === String(skillId)
      );
      const updatedSkills = (prev.skills || []).map((s) => {
        if (String(s.title) !== String(skillId)) {
          if (order !== "" && Number(s.typedOrder) === order) {
            return { ...s, typedOrder: "", featured: false };
          }
          return s;
        }
        if (order === "") {
          return { ...s, typedOrder: "", featured: false };
        }
        if (
          currentNominated >= 5 &&
          !(selected?.typedOrder >= 1 && selected?.typedOrder <= 5)
        ) {
          return s;
        }
        return { ...s, typedOrder: order, featured: true };
      });
      return { ...prev, skills: updatedSkills };
    });
  };

  const routeMode = location.pathname.split("/")[2];
  const pageTitle =
    routeMode === "view"
      ? "View Developer"
      : routeMode === "edit"
        ? "Edit Developer"
        : "Add Developer";

  const projectItems = useMemo(
    () =>
      (allProjects || []).map((p) => ({
        id: p._id,
        label: p.projectName,
      })),
    [allProjects]
  );

  const testimonialItems = useMemo(
    () =>
      (allTestimonials || []).map((t) => ({
        id: t._id,
        label: `${t.clientName}${t?.stars ? ` (${"★".repeat(t.stars)})` : ""}`,
      })),
    [allTestimonials]
  );

  const serviceItems = useMemo(
    () =>
      (allServices || []).map((s) => ({
        id: s._id,
        label: s.name,
      })),
    [allServices]
  );

  const renderLinksFields = () => {
    const selectedPreset =
      platformPresets.includes(linkDraft.title) || linkDraft.title === ""
        ? linkDraft.title
        : "Other";

    return (
      <div>
        <Form.Group className="mb-3">
          <Form.Label>Platform</Form.Label>
          <Form.Select
            value={selectedPreset}
            onChange={(e) => {
              const value = e.target.value;
              setLinkDraft((prev) => ({
                ...prev,
                title: value === "Other" ? "" : value,
              }));
            }}
          >
            <option value="">Select platform</option>
            {platformPresets.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {(selectedPreset === "Other" || selectedPreset === "") && (
          <Form.Group className="mb-3">
            <Form.Label>Custom Platform Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Kaggle, Upwork, Custom"
              value={linkDraft.title}
              onChange={(e) =>
                setLinkDraft((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </Form.Group>
        )}
        <Form.Group className="mb-3">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="url"
            placeholder="https://..."
            value={linkDraft.url}
            onChange={(e) =>
              setLinkDraft((prev) => ({ ...prev, url: e.target.value }))
            }
          />
        </Form.Group>
        <Button variant="primary" onClick={saveLinkDraft}>
          Add Platform
        </Button>
      </div>
    );
  };

  // File change and set file

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const selectedFile = e.target.files[0];
    changeAvatarToBuffer(selectedFile);
  };
  const changeAvatarToBuffer = (selectedFile) => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result;
        setBufferedFile(imageDataUrl);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "skills", label: "Skills" },
    { id: "portfolio", label: "Portfolio" },
    { id: "resume", label: "Resume" },
    { id: "media", label: "Media" },
  ];

  const formatSpan = (timeSpan) => {
    if (!timeSpan) return "—";
    return `${timeSpan.startYear || "?"} – ${timeSpan.endYear || "?"}`;
  };

  const handleDeleteEducation = async (eduId) => {
    if (!window.confirm("Delete this education entry?")) return;
    await removeEducation(eduId);
    setResumeEducation((prev) => prev.filter((e) => e?._id !== eduId));
  };

  const handleDeleteExperience = async (expId) => {
    if (!window.confirm("Delete this experience entry?")) return;
    await removeExperience(expId);
    setResumeExperience((prev) => prev.filter((e) => e?._id !== expId));
  };

  return (
    <div className="dev-form admin-page">
      <div className="admin-page-header">
        <h1>{pageTitle}</h1>
      </div>

      <form type="submit" onSubmit={handleSubmit} id="myForm">
        <div className="dev-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`dev-tab${activeTab === tab.id ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <fieldset disabled={view ? "disabled" : null}>
          {activeTab === "profile" && (
            <div className="dev-section">
              <h3>Profile</h3>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="devId">Developer Id</label>
              <input
                type="text"
                name="devId"
                id="devId"
                placeholder="DevId"
                required
                value={formData.devId}
                onChange={handleChange}
              />
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <label htmlFor="phoneNo">Phone No.</label>
              <input
                type="text"
                name="phoneNo"
                id="phoneNo"
                placeholder="Phone No"
                required
                value={formData.phoneNo}
                onChange={handleChange}
              />
              <label htmlFor="skype">Skype Id</label>
              <input
                type="text"
                name="skype"
                id="skype"
                placeholder="Skype Id"
                required
                value={formData.skype}
                onChange={handleChange}
              />
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <label htmlFor="devCV">CV</label>
              <input
                type="text"
                name="devCV"
                id="devCV"
                placeholder="devCV"
                value={formData.devCV}
                onChange={handleChange}
              />

              <Form.Group style={{ width: "100%", marginTop: "0.75rem" }}>
                <h5>Languages</h5>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  {spokenLanguages.map((language, index) => (
                    <Form.Check
                      style={{ width: "20%" }}
                      key={index}
                      type="checkbox"
                      id={`language-checkbox-${index}`}
                      label={language}
                      value={language.toLowerCase()}
                      checked={formData.languages.includes(
                        language.toLowerCase()
                      )}
                      onChange={handleLanguageChange}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group style={{ width: "100%", marginTop: "0.75rem" }}>
                <h5>Availability</h5>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  {availability.map((availabilityItem, index) => (
                    <Form.Check
                      style={{ width: "20%" }}
                      key={index}
                      type="checkbox"
                      id={`availability-checkbox-${index}`}
                      label={availabilityItem}
                      value={availabilityItem.toLowerCase()}
                      checked={
                        formData.availability ===
                        availabilityItem.toLowerCase()
                      }
                      onChange={(e) => {
                        const { value } = e.target;
                        setFormData({
                          ...formData,
                          availability: value.toLowerCase(),
                        });
                      }}
                    />
                  ))}
                </div>
              </Form.Group>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="dev-section">
              <h3>Skills</h3>
              <p className="admin-meta">
                Search and add skills. For skills on this portfolio, set a
                profile order (1–5) to show under the avatar typed line. Only
                those nominated skills appear there (max 5).
              </p>

              {selectedSkills.length > 0 && (
                <div className="picker-selected">
                  {selectedSkills.map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      className="picker-chip"
                      onClick={() => toggleSkill(s.id)}
                      title="Click to remove"
                      disabled={view}
                    >
                      {s.name} ×
                    </button>
                  ))}
                </div>
              )}

              <input
                type="search"
                className="admin-search"
                style={{ maxWidth: "100%" }}
                placeholder="Search skills to add…"
                value={skillSearch}
                disabled={view}
                onChange={(e) => setSkillSearch(e.target.value)}
              />

              <div className="picker-list">
                {filteredSkills.map((sk) => {
                  const on = selectedSkillIds.has(String(sk._id));
                  return (
                    <button
                      key={sk._id}
                      type="button"
                      className={`picker-option${on ? " is-on" : ""}`}
                      disabled={view}
                      onClick={() => toggleSkill(sk._id)}
                    >
                      {on ? "✓ " : "+ "}
                      {sk.skillName}
                    </button>
                  );
                })}
                {!filteredSkills.length && (
                  <span style={{ color: "#888", fontSize: "0.85rem" }}>
                    {skillSearch.trim() ? "No matches" : "Type to find more"}
                  </span>
                )}
              </div>

              {selectedSkills.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <h5 style={{ color: "#fff", marginBottom: "0.5rem" }}>
                    Profile order
                  </h5>
                  {selectedSkills.map((s) => (
                    <div key={s.id} className="skill-order-row">
                      <span style={{ minWidth: "8rem" }}>{s.name}</span>
                      <select
                        aria-label={`Profile typed order for ${s.name}`}
                        value={s.typedOrder || ""}
                        disabled={view}
                        onChange={(e) =>
                          setSkillTypedOrder(s.id, e.target.value)
                        }
                      >
                        <option value="">Not on profile</option>
                        <option value="1">Profile #1</option>
                        <option value="2">Profile #2</option>
                        <option value="3">Profile #3</option>
                        <option value="4">Profile #4</option>
                        <option value="5">Profile #5</option>
                      </select>
                      {nominatedCount >= 5 &&
                        !(s.typedOrder >= 1 && s.typedOrder <= 5) && (
                          <span className="admin-meta" style={{ margin: 0 }}>
                            Max 5 on profile
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              )}

              {!view && (
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleShow}
                  className="admin-btn"
                  style={{ marginTop: "0.75rem" }}
                >
                  Create new skill
                </Button>
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="dev-section">
              <h3>Portfolio</h3>

              <h5 style={{ color: "#fff", marginTop: "0.25rem" }}>Projects</h5>
              <SearchableMultiSelect
                items={projectItems}
                value={(formData.projects || []).map((p) => p.id)}
                disabled={view}
                placeholder="Search projects to add…"
                emptyLabel="No projects selected"
                onChange={(ids) =>
                  setFormData((prev) => ({
                    ...prev,
                    projects: ids.map((id) => ({ id })),
                  }))
                }
              />

              <h5 style={{ color: "#fff", marginTop: "1rem" }}>
                Testimonials
              </h5>
              <SearchableMultiSelect
                items={testimonialItems}
                value={formData.testimonials || []}
                disabled={view}
                placeholder="Search testimonials to add…"
                emptyLabel="No testimonials selected"
                onChange={(ids) =>
                  setFormData((prev) => ({
                    ...prev,
                    testimonials: ids,
                  }))
                }
              />

              <h5 style={{ color: "#fff", marginTop: "1rem" }}>Services</h5>
              <SearchableMultiSelect
                items={serviceItems}
                value={formData.services || []}
                disabled={view}
                placeholder="Search services to add…"
                emptyLabel="No services selected"
                onChange={(ids) =>
                  setFormData((prev) => ({
                    ...prev,
                    services: ids,
                  }))
                }
              />

              {!view && (
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleShowServiceModel}
                  className="admin-btn"
                  style={{ marginTop: "0.75rem" }}
                >
                  Add service
                </Button>
              )}

              {!view && (
                <Button
                  variant="primary"
                  type="button"
                  onClick={addNewLink}
                  className="admin-btn"
                  style={{ marginTop: "0.75rem", marginLeft: "0.5rem" }}
                >
                  Add platform link
                </Button>
              )}

              {formData?.links?.length > 0 && (
                <div className="w-[100%] mb-3 mt-3 border rounded border-secondary gap-2 p-2 m-0 items-center d-flex flex-wrap justify-content-start">
                  {formData?.links?.map((link, index) => (
                    <h5 key={index} className="m-0 p-0 position-relative">
                      <Badge bg="secondary">
                        <p className="text-white p-2 m-0">
                          {link.title}
                          {link.url ? ` — ${link.url}` : ""}
                        </p>
                        {!view && (
                          <span
                            className="position-absolute top-0 end-0 cursor-pointer"
                            onClick={() => handleDelete(index)}
                          >
                            <MdOutlineCancel />
                          </span>
                        )}
                      </Badge>
                    </h5>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "media" && (
            <div className="dev-section">
              <h3>Media</h3>
              <div
                style={{
                  maxWidth: "100%",
                  border: "1px solid #333",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px",
                  marginBottom: "1rem",
                }}
                className="rounded-4"
              >
                <div
                  style={{
                    maxWidth: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      backgroundImage: `url(${bufferedFile})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      border: "2px solid #aaa",
                    }}
                  ></div>
                  {!view ? (
                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      className="p-2 m-0"
                      accept="image/jpg, image/jpeg, image/png ,image/webp"
                      onChange={handleFileChange}
                    />
                  ) : (
                    <h5>Profile picture</h5>
                  )}
                </div>
              </div>

              <h5 htmlFor="about" className="mb-3">
                About developer
              </h5>
              <textarea
                style={{ marginBottom: "1rem" }}
                name="about"
                id="about"
                col="30"
                rows="10"
                placeholder="About Developer!"
                value={formData.about}
                onChange={handleChange}
                required
              />
              <h5 htmlFor="intro" className="mb-3">
                Developer Introduction
              </h5>
              <textarea
                style={{ marginBottom: "1rem" }}
                name="intro"
                id="intro"
                col="30"
                rows="10"
                placeholder="Developer Introduction!"
                value={formData.intro}
                onChange={handleChange}
                required
              />
              <label htmlFor="introVideo">
                Intro YouTube Video (optional)
              </label>
              <input
                type="url"
                name="introVideo"
                id="introVideo"
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                value={formData.introVideo || ""}
                onChange={handleChange}
              />
              <p
                className="admin-meta"
                style={{ marginTop: "-0.25rem", marginBottom: "0.5rem" }}
              >
                If set, the portfolio hero shows this video. If empty, a custom
                animation is shown instead.
              </p>
            </div>
          )}
        </fieldset>

          {activeTab === "resume" && (
            <div className="dev-section">
              <div className="admin-page-header" style={{ marginBottom: "0.75rem" }}>
                <h3 style={{ margin: 0 }}>Experience</h3>
                {!view && params?.id ? (
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={() =>
                      navigate(`/experience?devId=${params.id}`)
                    }
                  >
                    + Add Experience
                  </button>
                ) : null}
              </div>
              {resumeExperience.length ? (
                <ul className="admin-timeline">
                  {resumeExperience.map((item) => (
                    <li key={item._id} className="admin-timeline-item">
                      <div className="admin-timeline-meta">
                        <h6 className="admin-timeline-company">
                          {item.company || "—"}
                        </h6>
                        <p className="admin-timeline-years">
                          {formatSpan(item.timeSpan)}
                        </p>
                        <span className="admin-timeline-dot" aria-hidden="true" />
                      </div>
                      <div className="admin-timeline-body">
                        <h4 className="admin-timeline-role">
                          {item.role || "Untitled role"}
                        </h4>
                        {item.description ? (
                          <p className="admin-timeline-desc">
                            {item.description}
                          </p>
                        ) : null}
                        <div className="admin-card-actions">
                          <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() =>
                              navigate(
                                `/experience/edit/${item._id}?devId=${params.id}`
                              )
                            }
                          >
                            Edit
                          </button>
                          {!view && (
                            <button
                              type="button"
                              className="admin-btn-danger"
                              onClick={() =>
                                handleDeleteExperience(item._id)
                              }
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-meta">No experience linked yet.</p>
              )}

              <div className="admin-page-header" style={{ marginBottom: "0.75rem" }}>
                <h3 style={{ margin: 0 }}>Education</h3>
                {!view && params?.id ? (
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={() =>
                      navigate(`/education?devId=${params.id}`)
                    }
                  >
                    + Add Education
                  </button>
                ) : null}
              </div>
              {resumeEducation.length ? (
                <ul className="admin-timeline">
                  {resumeEducation.map((item) => (
                    <li key={item._id} className="admin-timeline-item">
                      <div className="admin-timeline-meta">
                        <h6 className="admin-timeline-company">
                          {item.institution || "—"}
                        </h6>
                        <p className="admin-timeline-years">
                          {formatSpan(item.timeSpan)}
                        </p>
                        <span className="admin-timeline-dot" aria-hidden="true" />
                      </div>
                      <div className="admin-timeline-body">
                        <h4 className="admin-timeline-role">
                          {item.major || "Untitled major"}
                        </h4>
                        {item.description ? (
                          <p className="admin-timeline-desc">
                            {item.description}
                          </p>
                        ) : null}
                        <div className="admin-card-actions">
                          <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() =>
                              navigate(
                                `/education/edit/${item._id}?devId=${params.id}`
                              )
                            }
                          >
                            Edit
                          </button>
                          {!view && (
                            <button
                              type="button"
                              className="admin-btn-danger"
                              onClick={() => handleDeleteEducation(item._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-meta">No education linked yet.</p>
              )}

              {!params?.id && (
                <p className="admin-meta">
                  Save the developer first, then add education and experience
                  from this tab.
                </p>
              )}
            </div>
          )}


        {!view && (
          <button type="submit" className="admin-btn admin-btn-primary">
            {routeMode === "edit" ? "Update" : "Save"}
          </button>
        )}
      </form>

      {/* Add Skill Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            style={{ background: "white", padding: "2rem", margin: "2rem" }}
          >
            <Form.Group>
              <Form.Label>Skill Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="title"
                id="title"
                value={skill?.skillName}
                onChange={(e) => setSkill(e.target.value)}
              />
            </Form.Group>

            <Button
              variant="secondary"
              onClick={handleClose}
              style={{ marginRight: "10px", padding: "0" }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              style={{ marginRight: "10px", padding: "0" }}
              onClick={handleSkill}
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Services Model */}
      <Modal show={showSerivce} onHide={handleCloseServiceModel}>
        <Modal.Header closeButton>
          <Modal.Title>Add Services</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            style={{ background: "white", padding: "2rem", margin: "2rem" }}
          >
            <Form.Group>
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                id="name"
                value={service?.name}
                onChange={(e) =>
                  setService({ ...service, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service Icon</Form.Label>
              <div className="d-flex align-items-center gap-2 mb-2">
                {(() => {
                  const Icon = getServiceIcon(service.icon);
                  return <Icon size={22} color="#069c7a" />;
                })()}
                <Form.Select
                  value={service.icon || "code"}
                  onChange={(e) =>
                    setService({ ...service, icon: e.target.value })
                  }
                >
                  {SERVICE_ICON_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Service Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter description"
                name="description"
                id="description"
                value={service.description}
                onChange={(e) =>
                  setService({ ...service, description: e.target.value })
                }
              />
            </Form.Group>

            <Button
              variant="secondary"
              onClick={handleCloseServiceModel}
              style={{ marginRight: "10px", padding: "0" }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              style={{ marginRight: "10px", padding: "0" }}
              onClick={handleService}
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showLink} onHide={handleCloseLinkModel}>
        <Modal.Header closeButton>
          <Modal.Title>Add platform link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            style={{ background: "white", padding: "2rem", margin: "1rem" }}
          >
            <Form.Group>{renderLinksFields()}</Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
