import { useEffect, useState } from "react";
import { FaCrosshairs, FaEdit } from "react-icons/fa";
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

// const uid = localStorage.getItem("user_id");

export default function Info() {
  const [show, setShow] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showSerivce, setShowSerivce] = useState(false);
  const [file, setFile] = useState("");
  const [bufferedFile, setBufferedFile] = useState("");
  const [skill, setSkill] = useState({ skillName: "" });
  const [service, setService] = useState({ name: "", description: "" });
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
    age: "",
    devCV: "",
    email: "",
    phoneNo: "",
    skype: "",
    about: "",
    intro: "",
    avatar: "",
    skills: [],
    links: [{ title: "", url: "" }],
    projects: [],
    testimonials: [],
    services: [],
    languages: [],
    availability: "",
  });
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
      const res = await addSkill({ skillName: skillName });
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
      });
      if (res?.status === 201 || res?.status === 200) {
        await getallServices();
        setService({ name: "", description: "" });
      }
      handleCloseServiceModel();
    } else {
      console.log("Title and Description are required.");
    }
  };

  //Fetch all projects, skill

  const getAllSkills = async () => {
    const skills = await fetchSkills();
    setAllSkills(skills);
  };
  const getallServices = async () => {
    const services = await fetchServices();
    setAllServices(services);
  };
  const getAlllTestimonials = async () => {
    const testimonial = await fetchTestimonials();
    setAllTestimonials(testimonial);
  };

  const getAllProjects = async () => {
    const projects = await fetchProjects();
    setAllProjects(projects);
  };

  useEffect(() => {
    getAlllTestimonials();
    getAllSkills();
    getAllProjects();
    getallServices();
  }, []);

  // GET Single Developer To Edit
  const params = useParams();
  useEffect(() => {
    if (location.pathname.split("/")[2] === "view") {
      setView(true);
    }
  });
  const fetchDeveloper = async () => {
    if (params?.id) {
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
          age,
          devCV,
          email,
          phoneNo,
          skype,
          about,
          intro,
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
          age,
          devCV,
          email,
          intro,
          phoneNo,
          skype,
          about,
          links,
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
    } else {
      console.error("No developer ID provided");
    }
  };
  const fetchAndSetAvatar = async () => {
    if (file) {
      setBufferedFile(`${baseURL}/file/${file}`);
    }
  };
  useEffect(() => {
    fetchAndSetAvatar();
  }, [file]);
  useEffect(() => {
    if (params?.id) {
      fetchDeveloper();
    }
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (!params?.id) {
      const fileId = await createImageId(file);
      formData["avatar"] = fileId;
      res = await createDeveloper(formData);
    } else {
      if (file !== formData?.avatar) {
        const fileId = await createImageId(file);
        formData["avatar"] = fileId;
      }
      formData["avatar"] = formData?.avatar;
      res = await updateDeveloper(formData, params?.id);
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
  const handleCloseLinkModel = () => setShowLink(false);
  const handleShowLinkModel = () => setShowLink(true);
  const handleCloseServiceModel = () => setShowSerivce(false);
  const handleShowServiceModel = () => setShowSerivce(true);

  // Function to update the links state
  const updateLinks = (index, field, value) => {
    setFormData((prevData) => {
      const newLinks = [...prevData.links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prevData, links: newLinks };
    });
  };

  // Function to add a new empty link
  const addNewLink = () => {
    setFormData((prevData) => ({
      ...prevData,
      links: [...prevData.links, { title: "", url: "" }],
    }));
  };

  // Function to remove a link
  const removeLink = (index) => {
    setFormData((prevData) => {
      const newLinks = [...prevData.links];
      newLinks.splice(index, 1);
      return { ...prevData, links: newLinks };
    });
  };

  // useEffect(() => {
  //   console.log(formData, "formData");
  // }, [formData]);

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
  const handleAvailabilityChange = (event) => {
    const { value } = event.target;
    let updatedAvailability = formData.availability;

    if (updatedAvailability.includes(value)) {
      updatedAvailability = updatedAvailability.filter(
        (lang) => lang !== value
      );
    } else {
      updatedAvailability.push(value);
    }

    setFormData({ ...formData, availability: updatedAvailability });
  };

  const renderLinksFields = () => {
    const lastIndex = formData?.links?.length - 1;
    const lastLink = formData?.links?.[lastIndex];

    if (!lastLink) return null; // If there's no last link, return null

    return (
      <div>
        <Form.Group>
          <Form.Label>Platform Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={lastLink.title}
            onChange={(e) => updateLinks(lastIndex, "title", e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter URL"
            value={lastLink.url}
            onChange={(e) => updateLinks(lastIndex, "url", e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={handleCloseLinkModel}
          className="p-0"
        >
          Add
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
            <label htmlFor="age" className="text-white">
              Age:
            </label>
            <input
              type="number"
              name="age"
              id="age"
              placeholder="e.g 20"
              value={formData.age}
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
                            ratings: 0,
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
                    {/* Label for skill name */}
                    <label className="text-white" htmlFor={skill._id}>
                      {skill?.skillName}
                    </label>
                    {/* Slider for skill ratings */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={
                        formData?.skills?.find(
                          (formDataSkill) => formDataSkill?.title === skill?._id
                        )?.ratings || 0
                      }
                      onChange={(e) => {
                        const updatedSkills = formData?.skills?.map(
                          (formDataSkill) => {
                            if (formDataSkill.title === skill?._id) {
                              return {
                                ...formDataSkill,
                                ratings: parseInt(e.target.value),
                              };
                            }
                            return formDataSkill;
                          }
                        );
                        setFormData({ ...formData, skills: updatedSkills });
                      }}
                      style={{ width: "100%", padding: "0" }} // Adjust width as needed
                    />
                    {/* Display the current rating value */}
                    <span style={{ marginLeft: "5px", color: "white" }}>
                      {formData?.skills?.find(
                        (formDataSkill) => formDataSkill?.title === skill?._id
                      )?.ratings || 0}
                    </span>
                    {console.log(index, "index")}
                    {/* Delete button for removing the skill */}
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

            {/* Social Links */}
            <div style={{ width: "100%", display: "flex" }}>
              <Button
                variant="primary"
                onClick={() => {
                  handleShowLinkModel();
                  addNewLink();
                }}
                style={{ width: "100%", marginBottom: "1rem", padding: "0" }}
              >
                Add social links
              </Button>
            </div>
            {formData?.links?.length > 0 && (
              <div className="w-[100%] mb-3 border rounded border-secondary gap-2 p-2 m-0 items-center  d-flex  justify-content-center ">
                {formData?.links?.map((link, index) => (
                  <h5 key={index} className="m-0 p-0 position-relative">
                    <Badge bg="secondary">
                      <p className="text-white p-2 m-0">{link.title}</p>
                      <span
                        className="position-absolute top-0 end-0 cursor-pointer"
                        onClick={() => handleDelete(index)} // handleDelete function not defined, you need to define it
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
                  onChange={(e) => setService({ name: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Service Description</Form.Label>
                <Form.Control
                  type="textarea"
                  placeholder="Enter description"
                  name="description"
                  id="description"
                  value={service.description} // Update this line
                  onChange={(e) =>
                    setService({ ...service, description: e.target.value })
                  } // Update this line
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

        {/* Add Social Link Model */}
        <Modal show={showLink} onHide={handleCloseLinkModel}>
          <Modal.Header closeButton>
            <Modal.Title>Add social link</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              style={{ background: "white", padding: "2rem", margin: "1rem" }}
            >
              <Form.Group>
                {renderLinksFields()}
                {/* <Button variant="primary" onClick={addNewLink} className="p-0">
                  Add Link
                </Button> */}
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
