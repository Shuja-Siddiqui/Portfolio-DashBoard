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
  removeSkill,
} from "../api";

import { Toaster } from "../common";
import "react-quill/dist/quill.snow.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function Projects() {
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMessage] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [skill, setSkill] = useState({ skillName: "" });
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    thumbNail: "",
    clientName: "",
    duration: "",
    description: "",
    techStack: "",
    hero: "",
    projectLink: "",
    technologies: [],
    gallery: [],
    detailLayout: "classic",
    youtubeUrl: "",
    problem: { format: "paragraph", text: "", items: [] },
    solution: { format: "paragraph", text: "", items: [] },
    faqs: [],
  });
  const [images, setImages] = useState([]);
  const [preveiousImages, setPreveiousImages] = useState([]);
  const [imagesToShow, setImagesToShow] = useState([]);
  const [heroToShow, setHeroToShow] = useState("");
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [view, setView] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setView(location.pathname.split("/")[2] === "view");
  }, [location.pathname]);
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

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
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
      setFormData({
        ...res,
        detailLayout: res?.detailLayout === "showcase" ? "showcase" : "classic",
        youtubeUrl: res?.youtubeUrl || "",
        problem: res?.problem || { format: "paragraph", text: "", items: [] },
        solution: res?.solution || { format: "paragraph", text: "", items: [] },
        faqs: Array.isArray(res?.faqs) ? res.faqs : [],
        projectLink: res?.projectLink || "",
      });
    })();
  }, [params?.id]);
  useEffect(() => {
    (async () => {
      const skills = await fetchSkills();
      setAllSkills(skills);
    })();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Add Skills
  const handleSkill = async () => {
    const skillName = skill;
    if (skillName) {
      await addSkill({ skillName: skillName });
      const skills = await fetchSkills();
      setAllSkills(skills);
      handleClose();
    } else {
      console.log("Title and path are required.");
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (id, e, index) => {
    e.preventDefault();
    try {
      await removeSkill(id);
      const skills = await fetchSkills();
      setAllSkills(skills);
    } catch (error) {
      console.log("Error occurred while deleting skill:", error?.message);
    }
  };

  // SET VALUES IN THE FORM
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Start loading
    setIsLoading(true);
    let res;
    if (!params?.id) {
      const hero = await createImageId(file);
      formData["hero"] = hero;
      if (images.length > 0) {
        const fileId = await createImageIds(images);
        formData["gallery"] = fileId;
      }
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
      // Alert
      alert("Project updated successfully!");
    }
    // End loading
    setIsLoading(false);
  };

  const handleImagesChange = (id) => {
    const imgId = id?.split("/")[6];
    setImagesToDelete([...imagesToDelete, imgId]);
    const newArr = imagesToShow.filter(
      (img) => img.split("/")[6] !== id.split("/")[6]
    );
    setImagesToShow(newArr);
  };

  // useEffect(() => {
  //   console.log("formData", formData);
  // }, [formData]);

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
          <label htmlFor="thumbNail" className="text-white">
            ThumbNail:
          </label>
          <input
            type="text"
            name="thumbNail"
            id="thumbNail"
            value={formData?.thumbNail}
            onChange={handleChange}
            placeholder="Project thumbNail"
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
          <label htmlFor="description" className="text-white">
            Project Description:
          </label>
          <textarea
            type="text"
            name="description"
            id="description"
            col="30"
            rows="5"
            value={formData?.description}
            onChange={handleChange}
            placeholder="Project description"
            required
          />

          <label htmlFor="detailLayout" className="text-white">
            Detail page layout:
          </label>
          <select
            name="detailLayout"
            id="detailLayout"
            value={formData?.detailLayout || "classic"}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
          >
            <option value="classic">Classic (current layout)</option>
            <option value="showcase">
              Showcase (carousel, problem/solution, FAQs)
            </option>
          </select>

          <label htmlFor="youtubeUrl" className="text-white">
            YouTube video URL (optional, showcase carousel):
          </label>
          <input
            type="url"
            name="youtubeUrl"
            id="youtubeUrl"
            value={formData?.youtubeUrl || ""}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />

          {/* Problem */}
          <h5 style={{ color: "white", marginTop: "1rem" }}>Problem</h5>
          <label className="text-white">Problem format:</label>
          <select
            value={formData?.problem?.format || "paragraph"}
            onChange={(e) =>
              setFormData({
                ...formData,
                problem: {
                  ...(formData.problem || {}),
                  format: e.target.value,
                },
              })
            }
            style={{ width: "100%", marginBottom: "0.75rem", padding: "0.5rem" }}
          >
            <option value="paragraph">Paragraph</option>
            <option value="bullets">Bullet points</option>
          </select>
          {(formData?.problem?.format || "paragraph") === "paragraph" ? (
            <textarea
              rows="4"
              value={formData?.problem?.text || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  problem: {
                    ...(formData.problem || { format: "paragraph", items: [] }),
                    text: e.target.value,
                  },
                })
              }
              placeholder="Describe the problem in a paragraph"
            />
          ) : (
            <div style={{ marginBottom: "1rem" }}>
              {(formData?.problem?.items || []).map((item, idx) => (
                <div
                  key={`problem-${idx}`}
                  style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                >
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const items = [...(formData.problem?.items || [])];
                      items[idx] = e.target.value;
                      setFormData({
                        ...formData,
                        problem: { ...formData.problem, items },
                      });
                    }}
                    placeholder={`Bullet ${idx + 1}`}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const items = (formData.problem?.items || []).filter(
                        (_, i) => i !== idx
                      );
                      setFormData({
                        ...formData,
                        problem: { ...formData.problem, items },
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    problem: {
                      ...formData.problem,
                      format: "bullets",
                      items: [...(formData.problem?.items || []), ""],
                    },
                  })
                }
              >
                Add problem bullet
              </button>
            </div>
          )}

          {/* Solution */}
          <h5 style={{ color: "white", marginTop: "1rem" }}>Solution</h5>
          <label className="text-white">Solution format:</label>
          <select
            value={formData?.solution?.format || "paragraph"}
            onChange={(e) =>
              setFormData({
                ...formData,
                solution: {
                  ...(formData.solution || {}),
                  format: e.target.value,
                },
              })
            }
            style={{ width: "100%", marginBottom: "0.75rem", padding: "0.5rem" }}
          >
            <option value="paragraph">Paragraph</option>
            <option value="bullets">Bullet points</option>
          </select>
          {(formData?.solution?.format || "paragraph") === "paragraph" ? (
            <textarea
              rows="4"
              value={formData?.solution?.text || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  solution: {
                    ...(formData.solution || {
                      format: "paragraph",
                      items: [],
                    }),
                    text: e.target.value,
                  },
                })
              }
              placeholder="Describe the solution in a paragraph"
            />
          ) : (
            <div style={{ marginBottom: "1rem" }}>
              {(formData?.solution?.items || []).map((item, idx) => (
                <div
                  key={`solution-${idx}`}
                  style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                >
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const items = [...(formData.solution?.items || [])];
                      items[idx] = e.target.value;
                      setFormData({
                        ...formData,
                        solution: { ...formData.solution, items },
                      });
                    }}
                    placeholder={`Bullet ${idx + 1}`}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const items = (formData.solution?.items || []).filter(
                        (_, i) => i !== idx
                      );
                      setFormData({
                        ...formData,
                        solution: { ...formData.solution, items },
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    solution: {
                      ...formData.solution,
                      format: "bullets",
                      items: [...(formData.solution?.items || []), ""],
                    },
                  })
                }
              >
                Add solution bullet
              </button>
            </div>
          )}

          {/* FAQs */}
          <h5 style={{ color: "white", marginTop: "1rem" }}>FAQs</h5>
          {(formData?.faqs || []).map((faq, idx) => (
            <div
              key={`faq-${idx}`}
              style={{
                border: "1px solid #444",
                padding: "0.75rem",
                marginBottom: "0.75rem",
                borderRadius: "8px",
              }}
            >
              <input
                type="text"
                value={faq.question || ""}
                onChange={(e) => {
                  const faqs = [...(formData.faqs || [])];
                  faqs[idx] = { ...faqs[idx], question: e.target.value };
                  setFormData({ ...formData, faqs });
                }}
                placeholder="Question"
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
              <textarea
                rows="3"
                value={faq.answer || ""}
                onChange={(e) => {
                  const faqs = [...(formData.faqs || [])];
                  faqs[idx] = { ...faqs[idx], answer: e.target.value };
                  setFormData({ ...formData, faqs });
                }}
                placeholder="Answer"
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
              <button
                type="button"
                onClick={() => {
                  const faqs = (formData.faqs || []).filter((_, i) => i !== idx);
                  setFormData({ ...formData, faqs });
                }}
              >
                Remove FAQ
              </button>
            </div>
          ))}
          <button
            type="button"
            style={{ marginBottom: "1rem" }}
            onClick={() =>
              setFormData({
                ...formData,
                faqs: [...(formData.faqs || []), { question: "", answer: "" }],
              })
            }
          >
            Add FAQ
          </button>

          <label htmlFor="projectLink" className="text-white">
            Project link (optional — Visit button only shows if set):
          </label>
          <input
            type="url"
            name="projectLink"
            value={formData?.projectLink || ""}
            onChange={handleChange}
            id="projectLink"
            placeholder="https://"
          />
          {location.pathname.split("/")[2] === "view" ? (
            <></>
          ) : (
            <button type="submit" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : location.pathname.split("/")[2] === "edit"
                ? "UPDATE"
                : "SUBMIT"}
            </button>
          )}
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
