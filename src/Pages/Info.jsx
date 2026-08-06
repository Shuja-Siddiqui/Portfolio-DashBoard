import { useCallback, useEffect, useState } from "react";
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
  removeSkill,
} from "../api";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { availability, spokenLanguages } from "../utils";
import { SERVICE_ICON_OPTIONS, getServiceIcon } from "../utils/serviceIcons";

// const uid = localStorage.getItem("user_id");

export default function Info() {
  const [show, setShow] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showSerivce, setShowSerivce] = useState(false);
  const [file, setFile] = useState("");
  const [bufferedFile, setBufferedFile] = useState("");
  const [skill, setSkill] = useState({ skillName: "" });
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

  // FOR STARS
  function generateStars(numStars) {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push(
        <span key={i} style={{ color: "gold" }}>
          &#9733;
        </span>
      ); // &#9733; is the Unicode for a star
    }
    return stars;
  }

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

  //
  const handleDeleteSkill = async (id, e, index) => {
    e.preventDefault();
    try {
      await removeSkill(id);
      await getAllSkills();

      setFormData((prevData) => {
        const updatedSkills = [...prevData.skills];
        updatedSkills.splice(index, 1);
        return {
          ...prevData,
          skills: updatedSkills,
        };
      });
    } catch (error) {
      console.log("Error occurred while deleting skill:", error?.message);
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
        }));
        setFile(developer?.avatar);
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
    const payload = {
      ...formData,
      links: (formData.links || []).filter((link) => link?.title && link?.url),
    };
    let res;
    if (!params?.id) {
      const fileId = await createImageId(file);
      payload.avatar = fileId;
      res = await createDeveloper(payload);
    } else {
      if (file !== formData?.avatar) {
        const fileId = await createImageId(file);
        payload.avatar = fileId;
      }
      res = await updateDeveloper(payload, params?.id);
    }
    if (res?.status === 201 || res?.status === 200) {
      alert("Updated successfully!");
      navigate("/developers");
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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <div className="container">
        <h1 style={{ color: "white", textAlign: "center" }}>Dev Information</h1>
        <form
          type="submit"
          onSubmit={handleSubmit}
          id="myForm"
          style={{ width: "100%", margin: "0" }}
        >
          <fieldset disabled={view ? "disabled" : null}>
            <label htmlFor="name" className="text-white">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="devId" className="text-white">
              Developer Id:
            </label>
            <input
              type="text"
              name="devId"
              id="devId"
              placeholder="DevId"
              required
              value={formData.devId}
              onChange={handleChange}
            />
            <label htmlFor="devId" className="text-white">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="devId" className="text-white">
              Phone No.
            </label>
            <input
              type="text"
              name="phoneNo"
              id="phoneNo"
              placeholder="Phone No"
              required
              value={formData.phoneNo}
              onChange={handleChange}
            />
            <label htmlFor="devId" className="text-white">
              Skype Id:
            </label>
            <input
              type="text"
              name="skype"
              id="skype"
              placeholder="Skype Id"
              required
              value={formData.skype}
              onChange={handleChange}
            />
            <label htmlFor="country" className="text-white">
              country:
            </label>
            <input
              type="text"
              name="country"
              id="country"
              placeholder="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
            <label htmlFor="city" className="text-white">
              city:
            </label>
            <input
              type="text"
              name="city"
              id="city"
              placeholder="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
             <label htmlFor="devCV" className="text-white">
              CV:
            </label>
            <input
              type="text"
              name="devCV"
              id="devCV"
              placeholder="devCV"
              value={formData.devCV}
              onChange={handleChange}
            />
            <Form.Group style={{ width: "100%" }}>
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
                    value={language.toLowerCase()} // Lowercase the language for consistency
                    checked={formData.languages.includes(
                      language.toLowerCase()
                    )}
                    onChange={handleLanguageChange}
                  />
                ))}
              </div>
            </Form.Group>

            {/* Availability */}
            <Form.Group style={{ width: "100%" }}>
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
                      formData.availability === availabilityItem.toLowerCase()
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

            {/* Developer Skill */}
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                width: "100%",
                flexDirection: "column",
              }}
            >
              <h5
                style={{
                  margin: "0",
                  padding: "0",
                  marginBottom: "1rem",
                  color: "white",
                }}
              >
                Select Developer skill
              </h5>
              {(allSkills &&
                allSkills.length > 0 &&
                allSkills?.map((skill, index) => (
                  <div
                    key={skill._id}
                    style={{
                      width: "100%",
                      display: "flex",
                      gap: "10px",
                      marginBottom: "1rem",
                      alignItems: "center",
                    }}
                  >
                    {/* Checkbox for skill selection */}
                    <input
                      type="checkbox"
                      id={skill._id}
                      style={{ width: "1rem", padding: "0", margin: "0" }}
                      name="skills"
                      value={skill?._id}
                      checked={formData?.skills?.some(
                        (formDataSkill) => formDataSkill?.title === skill?._id
                      )}
                      onChange={(e) => {
                        const updatedSkills = [...formData.skills];
                        if (e.target.checked) {
                          updatedSkills.push({
                            title: e.target.value,
                            ratings: 1,
                          });
                        } else {
                          const indexToRemove = updatedSkills.findIndex(
                            (formDataSkill) =>
                              formDataSkill?.title === e.target.value
                          );
                          updatedSkills.splice(indexToRemove, 1);
                        }
                        setFormData({ ...formData, skills: updatedSkills });
                      }}
                    />
                    <label className="text-white" htmlFor={skill._id}>
                      {skill?.skillName}
                    </label>
                    <button
                      onClick={(e) => handleDeleteSkill(skill?._id, e, index)}
                      style={{ padding: "0", margin: "0" }}
                    >
                      Delete
                    </button>
                  </div>
                ))) ||
                "NoSkill"}
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <Button
                variant="primary"
                onClick={handleShow}
                style={{ width: "100%", marginBottom: "1rem", padding: "0" }}
              >
                Add developer skill
              </Button>
            </div>

            {/* Developer Projects */}
            <h5 className="mb-3 ">Developer Projects</h5>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {allProjects && allProjects.length > 0
                ? allProjects.map((project, index) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      key={index}
                    >
                      <input
                        name="project"
                        id={`project-${index}`}
                        type="checkbox"
                        style={{ width: "20px", padding: "0", margin: "0" }}
                        value={project._id}
                        checked={formData?.projects?.some(
                          (formProject) => formProject.id === project._id
                        )}
                        onChange={(e) => {
                          const checkedProjectId = e.target.value;
                          setFormData((prevFormData) => {
                            const updatedProjects = [
                              ...(prevFormData.projects || []),
                            ];
                            if (e.target.checked) {
                              updatedProjects.push({ id: checkedProjectId });
                            } else {
                              const indexToRemove = updatedProjects.findIndex(
                                (proj) => proj.id === checkedProjectId
                              );
                              if (indexToRemove !== -1) {
                                updatedProjects.splice(indexToRemove, 1);
                              }
                            }
                            return {
                              ...prevFormData,
                              projects: updatedProjects,
                            };
                          });
                        }}
                      />
                      <label
                        htmlFor={`project-${index}`}
                        className="text-white"
                      >
                        {project.projectName}
                      </label>
                    </div>
                  ))
                : "No Project"}
            </div>

            {/* Testimonials */}
            <h5 className="mb-3 ">Testimonials</h5>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {allTestimonials && allTestimonials.length > 0
                ? allTestimonials.map((testimonial, index) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      key={index}
                    >
                      <input
                        name="testimonial"
                        id="testimonial"
                        type="checkbox"
                        style={{ width: "20px", padding: "0", margin: "0" }}
                        value={testimonial._id}
                        checked={formData?.testimonials?.some(
                          (formTestimonial) =>
                            formTestimonial === testimonial._id
                        )}
                        onChange={(e) => {
                          const checkedTestimonialId = e.target.value;
                          setFormData((prevFormData) => {
                            const prevTestimonials =
                              prevFormData.testimonials || [];
                            let updatedTestimonials;
                            if (e.target.checked) {
                              if (
                                !prevTestimonials.includes(checkedTestimonialId)
                              ) {
                                updatedTestimonials = [
                                  ...prevTestimonials,
                                  checkedTestimonialId,
                                ];
                              } else {
                                updatedTestimonials = prevTestimonials;
                              }
                            } else {
                              updatedTestimonials = prevTestimonials.filter(
                                (testimonialId) =>
                                  testimonialId !== checkedTestimonialId
                              );
                            }
                            return {
                              ...prevFormData,
                              testimonials: updatedTestimonials,
                            };
                          });
                        }}
                      />
                      <label
                        htmlFor={`testimonial-${index}`}
                        className="text-white"
                      >
                        {testimonial.clientName}
                        <sup>{generateStars(testimonial?.stars)}</sup>
                      </label>
                    </div>
                  ))
                : "No Testimonials"}
            </div>

            {/* Services */}
            <h5 className="mb-3 ">Services</h5>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {allServices && allServices.length > 0
                ? allServices.map((service, index) => (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      key={index}
                    >
                      <input
                        name="service"
                        id="service"
                        type="checkbox"
                        style={{ width: "20px", padding: "0", margin: "0" }}
                        value={service._id}
                        checked={formData?.services?.some(
                          (formService) => formService === service._id
                        )}
                        onChange={(e) => {
                          const checkedServiceId = e.target.value;
                          setFormData((prevFormData) => {
                            const prevServices = prevFormData.services || [];
                            let updatedServices;
                            if (e.target.checked) {
                              if (!prevServices.includes(checkedServiceId)) {
                                updatedServices = [
                                  ...prevServices,
                                  checkedServiceId,
                                ];
                              } else {
                                updatedServices = prevServices;
                              }
                            } else {
                              updatedServices = prevServices.filter(
                                (serviceId) => serviceId !== checkedServiceId
                              );
                            }
                            return {
                              ...prevFormData,
                              services: updatedServices,
                            };
                          });
                        }}
                      />
                      <label
                        htmlFor={`service-${index}`}
                        className="text-white"
                      >
                        {service.name}
                      </label>
                    </div>
                  ))
                : "No Service"}
              <div style={{ width: "100%", display: "flex" }}>
                <Button
                  variant="primary"
                  onClick={handleShowServiceModel}
                  style={{ width: "100%", marginBottom: "1rem", padding: "0" }}
                >
                  Add service
                </Button>
              </div>
            </div>

            {/* Social / Platform Links */}
            <div style={{ width: "100%", display: "flex" }}>
              <Button
                variant="primary"
                onClick={addNewLink}
                style={{ width: "100%", marginBottom: "1rem", padding: "0" }}
              >
                Add platform link (GitHub, Upwork, Kaggle, etc.)
              </Button>
            </div>
            {formData?.links?.length > 0 && (
              <div className="w-[100%] mb-3 border rounded border-secondary gap-2 p-2 m-0 items-center d-flex flex-wrap justify-content-start">
                {formData?.links?.map((link, index) => (
                  <h5 key={index} className="m-0 p-0 position-relative">
                    <Badge bg="secondary">
                      <p className="text-white p-2 m-0">
                        {link.title}
                        {link.url ? ` — ${link.url}` : ""}
                      </p>
                      <span
                        className="position-absolute top-0 end-0 cursor-pointer"
                        onClick={() => handleDelete(index)}
                      >
                        <MdOutlineCancel />
                      </span>
                    </Badge>
                  </h5>
                ))}
              </div>
            )}
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
                    width: "200px", // Adjust as per your design
                    height: "200px", // Adjust as per your design
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
            <h5 htmlFor="about" className=" mb-3">
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
            >
              {formData?.about}
            </textarea>
            <h5 htmlFor="about" className=" mb-3">
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
            >
              {formData?.intro}
            </textarea>
            <label htmlFor="introVideo" className="text-white">
              Intro YouTube Video (optional):
            </label>
            <input
              type="url"
              name="introVideo"
              id="introVideo"
              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
              value={formData.introVideo || ""}
              onChange={handleChange}
            />
            <p className="text-white" style={{ fontSize: "12px", marginTop: "-0.5rem", marginBottom: "1rem", opacity: 0.7 }}>
              If set, the portfolio hero shows this video. If empty, a custom animation is shown instead.
            </p>
            {!view && (
              <button>
                {location.pathname.split("/")[2] === "edit"
                  ? "UPDATE"
                  : "SUBMIT"}
              </button>
            )}
          </fieldset>
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
    </div>
  );
}
