import { useEffect, useState } from "react";
import {
  createImageId,
  createProject,
  updateProject,
  fetchSkills,
  addSkill,
  createImageIds,
  fetchProject,
  baseURL,
} from "../api";

import { Toaster } from "../common";
import "react-quill/dist/quill.snow.css";
import ProjectDescription from "../components/ProjectDescription";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Projects() {
  const [file, setFile] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [skill, setSkill] = useState({ skillName: "" });
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    duration: "",
    description: "",
    techStack: "",
    hero: "",
    projectLink: "",
    technologies: [],
    gallery: [],
  });
  const [images, setImages] = useState([]);
  const [preveiousImages, setPreveiousImages] = useState([]);
  const [imagesToShow, setImagesToShow] = useState([]);
  const [heroToShow, setHeroToShow] = useState("");
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [view, setView] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.split("/")[2] === "view") {
      setView(true);
    }
  });
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const files = event.target.files;
    const imagesArray = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    // Add new images to the existing array
    setImages([...images, file]);
    setImagesToShow([...imagesToShow, ...imagesArray]);
  };

  // FOR HERO

  const handleHero = (e) => {
    setFile(e.target.files[0]);
    const heroimage = URL.createObjectURL(e.target.files[0]);
    setHeroToShow(heroimage);
  };

  const params = useParams();
  const navigate = useNavigate();

  //Fetch  project, skills

  const getProject = async () => {
    const res = await fetchProject(params?.id);
    if (res?.hero) {
      const imageUrl = res.hero;
      setHeroToShow(`${baseURL}/file/${imageUrl}`);
    }
    setFile(res?.hero);
    if (res?.gallery) {
      setPreveiousImages(res?.gallery);
      // Also set the image URLs to display them in the UI
      setImagesToShow(res.gallery.map((img) => `${baseURL}/file/${img}`));
    }
    setFormData(res);
  };

  const getAllSkills = async () => {
    const skills = await fetchSkills();
    setAllSkills(skills);
  };
  useEffect(() => {
    if (params?.id) getProject();
  }, []);
  useEffect(() => {
    getAllSkills();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  // SET VALUES IN THE FORM
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (!params?.id) {
      const hero = await createImageId(file);
      formData["hero"] = hero;
      const fileId = await createImageIds(images);
      formData["gallery"] = fileId;
      res = await createProject(formData);
    } else {
      if (formData.hero !== file) {
        const hero = await createImageId(file);
        formData["hero"] = hero;
      }
      if (images.length > 0 || imagesToDelete.length > 0) {
        if (images.length === 0 && imagesToDelete.length > 0) {
          const gallery = preveiousImages.filter(
            (n) => !imagesToDelete.includes(n)
          );
          formData["gallery"] = gallery;
        } else {
          const fileId = await createImageIds(images);
          const allImages = [...fileId, ...preveiousImages];
          const gallery = allImages.filter((n) => !imagesToDelete.includes(n));
          formData["gallery"] = gallery;
        }
      }
      res = await updateProject(formData, params?.id);
    }
    if (res?.status === 201 || res?.status === 200) {
      navigate("/projectDashboard");
    }
  };

  const handleImagesChange = (id) => {
    const imgId = id?.split("/")[6];
    setImagesToDelete([...imagesToDelete, imgId]);
    const newArr = imagesToShow.filter(
      (img) => img.split("/")[6] !== id.split("/")[6]
    );
    setImagesToShow(newArr);
  };

  useEffect(() => {
    
  }, [formData]);
  return (
    <div>
      {showToaster && (
        <Toaster
          text={toasterMessage}
          showToaster={showToaster}
          setShowToaster={setShowToaster}
        />
      )}
      <h1 style={{ color: "white", textAlign: "center" }}>Projects</h1>
      <form method="post" onSubmit={handleSubmit}>
        <fieldset disabled={view ? "disabled" : ""}>
          <label htmlFor="projectName" className="text-white">
            Project Name:
          </label>
          <input
            type="text"
            name="projectName"
            id=""
            value={formData?.projectName}
            onChange={handleChange}
            placeholder="Project Name"
            required
          />
          <label htmlFor="clientName" className="text-white">
            Client Name:
          </label>
          <input
            type="text"
            name="clientName"
            id=""
            value={formData?.clientName}
            onChange={handleChange}
            placeholder="Client Name"
            required
          />
          <label htmlFor="duration" className="text-white">
            Duration:
          </label>
          <input
            type="text"
            name="duration"
            id="duration"
            value={formData?.duration}
            onChange={handleChange}
            placeholder="Project duration"
            required
          />
          <label htmlFor="techStack" className="text-white">
            Tech Stack:
          </label>
          <input
            type="text"
            name="techStack"
            id="techStack"
            value={formData?.techStack}
            onChange={handleChange}
            placeholder="Project techStack"
            required
          />

          <label htmlFor="hero" className="text-white">
            Hero Image:
          </label>
          <input
            type="file"
            name="hero"
            id="hero"
            onChange={handleHero}
            accept="image/*"
          />
          {imagesToShow && (
            <div
              style={{
                backgroundImage: `url(${heroToShow})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%", // Adjust as per your design
                height: "390px", // Adjust as per your design
                border: "2px solid #aaa",
              }}
            ></div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {imagesToShow?.map((image, index) => (
                <div
                  key={index}
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100px",
                    height: "100px",
                    border: "2px solid #aaa",
                  }}
                >
                  <button
                    onClick={(event) => {
                      event.preventDefault(); // Prevent form submission
                      handleImagesChange(image); // Call handleImagesChange function
                    }}
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      float: "right",
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
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
                    name="technologies"
                    value={skill?._id}
                    checked={formData?.technologies?.some(
                      (formDataSkill) => formDataSkill?.name === skill?._id
                    )}
                    onChange={(e) => {
                      const updatedSkills = [...formData?.technologies];
                      if (e.target.checked) {
                        updatedSkills.push({
                          name: e.target.value,
                          level: 0,
                        });
                      } else {
                        const indexToRemove = updatedSkills.findIndex(
                          (formDataSkill) =>
                            formDataSkill?.title === e.target.value
                        );
                        updatedSkills.splice(indexToRemove, 1);
                      }
                      setFormData({ ...formData, technologies: updatedSkills });
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
                      formData?.technologies?.find(
                        (formDataSkill) => formDataSkill?.name === skill?._id
                      )?.level || 0
                    }
                    onChange={(e) => {
                      const updatedSkills = formData?.technologies?.map(
                        (formDataSkill) => {
                          if (formDataSkill.name === skill?._id) {
                            return {
                              ...formDataSkill,
                              level: parseInt(e.target.value),
                            };
                          }
                          return formDataSkill;
                        }
                      );
                      setFormData({ ...formData, technologies: updatedSkills });
                    }}
                    style={{ width: "100%", padding: "0" }} // Adjust width as needed
                  />
                  {/* Display the current rating value */}
                  <span style={{ marginLeft: "5px", color: "white" }}>
                    {formData?.technologies?.find(
                      (formDataSkill) => formDataSkill?.name === skill?._id
                    )?.level || 0}
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
          <ProjectDescription
            theme="snow"
            placeholder="Project Description"
            style={{ color: "white" }}
            setFormData={setFormData}
            formData={formData}
          />
          <input
            type="url"
            name="projectLink"
            value={formData?.projectLink}
            onChange={handleChange}
            id=""
            placeholder="https//:"
            required
          />
          <button>
            {location.pathname.split("/")[2] === "edit" ? "UPDATE" : "SUBMIT"}
          </button>
        </fieldset>
      </form>

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
    </div>
  );
}
