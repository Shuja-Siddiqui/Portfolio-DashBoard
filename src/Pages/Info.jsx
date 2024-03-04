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
} from "../api";

import { Toaster } from "../common";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";

// const uid = localStorage.getItem("user_id");

export default function Info() {
  const [show, setShow] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [file, setFile] = useState("");
  const [bufferedFile, setBufferedFile] = useState("");
  const [skill, setSkill] = useState({ skillName: "" });
  const [allSkills, setAllSkills] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [view, setView] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    devId: "",
    residence: "",
    age: "",
    about: "",
    avatar: "",
    skills: [],
    links: [{ title: "", url: "" }],
    projects: [],
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

  // Add Skills
  const handleSkill = () => {
    const skillName = skill;
    if (skillName) {
      addSkill({ skillName: skillName });
      handleClose();
    } else {
      console.log("Title and path are required.");
    }
  };

  //Fetch all projects, skill

  const getAllSkills = async () => {
    const skills = await fetchSkills();
    setAllSkills(skills);
  };
  const getAllProjects = async () => {
    const projects = await fetchProjects();
    setAllProjects(projects);
  };

  useEffect(() => {
    getAllSkills();
    getAllProjects();
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
          skillName: skill.title.skillName,
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

        // Keep the remaining fields unchanged
        const { name, devId, residence, age, about, links } = developer;
        const updatedFormData = {
          name,
          devId,
          residence,
          age,
          about,
          links,
        };

        // Update formData with the updated fields
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...updatedFormData,
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
      console.log(res);
    } else {
      if (formData.avatar !== file) {
        const fileId = await createImageId(file);
        formData["avatar"] = fileId;
      }
      formData["avatar"] = file;
      res = await updateDeveloper(formData, params?.id);
      console.log(res);
    }
    if (res?.status === 201 || res?.status === 200) {
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
  useEffect(() => {
    console.log(formData, "formData");
  }, [formData]);

  const renderLinksFields = () => {
    return formData?.links?.map((link, index) => (
      <div key={index}>
        <Form.Group>
          <Form.Label>Platform Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={link.title}
            onChange={(e) => updateLinks(index, "title", e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter URL"
            value={link.url}
            onChange={(e) => updateLinks(index, "url", e.target.value)}
          />
        </Form.Group>
        <Button
          variant="danger"
          className="p-0 mb-2"
          onClick={() => removeLink(index)}
        >
          Remove
        </Button>
      </div>
    ));
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
            <label htmlFor="residence" className="text-white">
              Residence:
            </label>
            <input
              type="text"
              name="residence"
              id="residence"
              placeholder="Residence"
              value={formData.residence}
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
                allSkills?.map((skill) => (
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
            <h5 className="mb-3 text-white">Developer Projects</h5>
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
                        id="project"
                        type="checkbox"
                        style={{ width: "20px", padding: "0", margin: "0" }}
                        value={project._id}
                        checked={formData?.projects?.some(
                          (formProject) =>
                            formProject.id === project._id ||
                            formProject === project._id
                        )}
                        onChange={(e) => {
                          const updatedProjects = [...formData.projects];
                          if (e.target.checked) {
                            if (!updatedProjects.includes(e.target.value))
                              updatedProjects.push({
                                id: e.target.value,
                              });
                          } else {
                            updatedProjects.splice(
                              updatedProjects.indexOf(e.target.value),
                              1
                            );
                          }
                          setFormData({
                            ...formData,
                            projects: updatedProjects,
                          });
                        }}
                      />
                      <label htmlFor="project" className="text-white">
                        {project.projectName}
                      </label>
                    </div>
                  ))
                : "No Project"}
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <Button
                variant="primary"
                onClick={handleShowLinkModel}
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
                  <h6 className="text-white">Profile picture</h6>
                )}
              </div>
            </div>
            <h5 htmlFor="about" className="text-white mb-3">
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
            {!view && (
              <button>
                {location.pathname.split("/")[2] === "edit"
                  ? "UPDATE"
                  : "SUBMIT"}
              </button>
            )}
          </fieldset>
        </form>
        {/* Add Skill Model */}

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
                <Button variant="primary" onClick={addNewLink} className="p-0">
                  Add Link
                </Button>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
