import { useEffect, useMemo, useState } from "react";
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
import { Button, Form, Modal } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ProjectsForm.css";

const emptyBlock = () => ({ format: "paragraph", text: "", items: [] });

const normalizeTechId = (tech) => {
  if (!tech) return "";
  if (typeof tech.name === "string") return tech.name;
  return tech.name?._id || tech.name?.id || "";
};

export default function Projects() {
  const [heroFile, setHeroFile] = useState(null); // File | null (new upload only)
  const [existingHeroId, setExistingHeroId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    thumbNail: "",
    clientName: "",
    duration: "",
    description: "",
    techStack: "",
    projectLink: "",
    technologies: [],
    gallery: [],
    detailLayout: "classic",
    youtubeUrl: "",
    problem: emptyBlock(),
    solution: emptyBlock(),
    faqs: [],
  });
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); // File[]
  const [existingGalleryIds, setExistingGalleryIds] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]); // urls for UI
  const [heroPreview, setHeroPreview] = useState("");
  const [view, setView] = useState(false);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const isShowcase = formData.detailLayout === "showcase";

  const toast = (msg) => {
    setToasterMessage(msg);
    setShowToaster(true);
  };

  useEffect(() => {
    setView(location.pathname.split("/")[2] === "view");
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      const skills = await fetchSkills();
      setAllSkills(skills || []);
    })();
  }, []);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      const res = await fetchProject(params?.id);
      if (!res) return;

      const heroId = res.hero || "";
      setExistingHeroId(heroId);
      setHeroFile(null);
      if (heroId) setHeroPreview(`${baseURL}/file/${heroId}`);

      const galleryIds = Array.isArray(res.gallery) ? res.gallery : [];
      setExistingGalleryIds(galleryIds);
      setNewGalleryFiles([]);
      setGalleryPreviews(galleryIds.map((id) => `${baseURL}/file/${id}`));

      const technologies = (res.technologies || [])
        .map((t) => ({
          name: normalizeTechId(t),
          level: t.level ?? 1,
        }))
        .filter((t) => t.name);

      setFormData({
        projectName: res.projectName || "",
        thumbNail: res.thumbNail || "",
        clientName: res.clientName || "",
        duration: res.duration || "",
        description: res.description || "",
        techStack: res.techStack || "",
        projectLink: res.projectLink || "",
        technologies,
        gallery: galleryIds,
        detailLayout: res.detailLayout === "showcase" ? "showcase" : "classic",
        youtubeUrl: res.youtubeUrl || "",
        problem: res.problem || emptyBlock(),
        solution: res.solution || emptyBlock(),
        faqs: Array.isArray(res.faqs) ? res.faqs : [],
      });
    })();
  }, [params?.id]);

  const selectedTechIds = useMemo(
    () => new Set((formData.technologies || []).map((t) => String(t.name))),
    [formData.technologies]
  );

  const filteredSkills = useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    const list = allSkills || [];
    if (!q) return list.slice(0, 12); // keep list short until user searches
    return list
      .filter((s) => s?.skillName?.toLowerCase().includes(q))
      .slice(0, 20);
  }, [allSkills, skillSearch]);

  const selectedSkills = useMemo(() => {
    return (formData.technologies || [])
      .map((t) => {
        const skill = allSkills.find((s) => String(s._id) === String(t.name));
        return {
          id: String(t.name),
          name: skill?.skillName || t.name,
          level: t.level ?? 1,
        };
      })
      .filter((s) => s.id);
  }, [formData.technologies, allSkills]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHero = (e) => {
    const next = e.target.files?.[0];
    if (!next) return;
    setHeroFile(next);
    setHeroPreview(URL.createObjectURL(next));
  };

  const handleGalleryAdd = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewGalleryFiles((prev) => [...prev, ...files]);
    setGalleryPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
    e.target.value = "";
  };

  const removeGalleryAt = (index) => {
    // Previews = existing ids first, then new files
    const existingCount = existingGalleryIds.length;
    if (index < existingCount) {
      const id = existingGalleryIds[index];
      setExistingGalleryIds((prev) => prev.filter((_, i) => i !== index));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        gallery: (prev.gallery || []).filter((g) => g !== id),
      }));
    } else {
      const fileIndex = index - existingCount;
      setNewGalleryFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const toggleSkill = (skillId) => {
    const id = String(skillId);
    setFormData((prev) => {
      const exists = prev.technologies.some((t) => String(t.name) === id);
      if (exists) {
        return {
          ...prev,
          technologies: prev.technologies.filter((t) => String(t.name) !== id),
        };
      }
      return {
        ...prev,
        technologies: [...prev.technologies, { name: id, level: 1 }],
      };
    });
  };

  const handleAddSkillModal = async () => {
    if (!newSkillName.trim()) {
      toast("Skill name is required.");
      return;
    }
    await addSkill({ skillName: newSkillName.trim() });
    const skills = await fetchSkills();
    setAllSkills(skills || []);
    setNewSkillName("");
    setShow(false);
  };

  const buildPayload = async () => {
    const payload = {
      ...formData,
      projectLink: formData.projectLink || "",
      youtubeUrl: isShowcase ? formData.youtubeUrl || "" : "",
      detailLayout: isShowcase ? "showcase" : "classic",
      problem: isShowcase
        ? {
            format: formData.problem?.format || "paragraph",
            text: formData.problem?.text || "",
            items: (formData.problem?.items || []).filter((i) => String(i).trim()),
          }
        : emptyBlock(),
      solution: isShowcase
        ? {
            format: formData.solution?.format || "paragraph",
            text: formData.solution?.text || "",
            items: (formData.solution?.items || []).filter((i) => String(i).trim()),
          }
        : emptyBlock(),
      faqs: isShowcase
        ? (formData.faqs || []).filter(
            (f) => String(f.question || "").trim() && String(f.answer || "").trim()
          )
        : [],
      technologies: (formData.technologies || [])
        .map((t) => ({
          name: normalizeTechId(t) || t.name,
          level: Number(t.level) || 1,
        }))
        .filter((t) => t.name),
    };

    // Hero: only upload when a real File was chosen
    if (heroFile instanceof File) {
      payload.hero = await createImageId(heroFile);
    } else if (existingHeroId) {
      payload.hero = existingHeroId;
    } else {
      payload.hero = formData.hero || undefined;
    }

    // Gallery
    let galleryIds = [...existingGalleryIds];
    if (newGalleryFiles.length > 0) {
      const uploaded = await createImageIds(newGalleryFiles);
      galleryIds = [...galleryIds, ...(uploaded || [])];
    }
    payload.gallery = galleryIds;

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (!formData.technologies?.length) {
        toast("Select at least one technology.");
        setIsLoading(false);
        return;
      }

      const hasYoutube =
        isShowcase && String(formData.youtubeUrl || "").trim().length > 0;
      const hasHeroImage =
        heroFile instanceof File || Boolean(existingHeroId);
      const hasGalleryImages =
        existingGalleryIds.length + newGalleryFiles.length > 0;

      if (!hasYoutube && !hasHeroImage && !hasGalleryImages) {
        toast(
          isShowcase
            ? "Add a YouTube URL or at least one image for the hero."
            : "Add at least one image for the hero."
        );
        setIsLoading(false);
        return;
      }

      const payload = await buildPayload();

      if (!hasYoutube && !payload.hero && !(payload.gallery || []).length) {
        toast("Hero media is missing.");
        setIsLoading(false);
        return;
      }

      let res;
      if (!params?.id) {
        res = await createProject(payload);
      } else {
        res = await updateProject(payload, params.id);
      }

      if (res?.status === 200 || res?.status === 201) {
        toast("Project saved successfully.");
        navigate("/projectDashboard");
      } else {
        const msg =
          res?.data?.message ||
          "Save failed. Check required fields and try again.";
        toast(msg);
      }
    } catch (error) {
      const apiMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Upload or save failed.";
      toast(apiMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBlock = (key, patch) => {
    setFormData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || emptyBlock()), ...patch },
    }));
  };

  return (
    <div className="project-admin">
      {showToaster && (
        <Toaster
          text={toasterMessage}
          showToaster={showToaster}
          setShowToaster={setShowToaster}
        />
      )}

      <div className="project-admin-header">
        <h1>Project editor</h1>
        <p>Choose a detail layout, then fill only what that layout needs.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={view}>
          {/* Layout picker */}
          <section className="project-card">
            <h2>1. Detail page layout</h2>
            <div className="layout-picker">
              <button
                type="button"
                className={`layout-option ${
                  !isShowcase ? "is-active" : ""
                }`}
                onClick={() =>
                  setFormData((p) => ({ ...p, detailLayout: "classic" }))
                }
              >
                <strong>Classic</strong>
                <span>Images in hero (carousel if 2+), description, tech</span>
              </button>
              <button
                type="button"
                className={`layout-option ${
                  isShowcase ? "is-active" : ""
                }`}
                onClick={() =>
                  setFormData((p) => ({ ...p, detailLayout: "showcase" }))
                }
              >
                <strong>Showcase</strong>
                <span>YouTube hero or image carousel + problem/solution/FAQs</span>
              </button>
            </div>
          </section>

          {/* Basics */}
          <section className="project-card">
            <h2>2. Basic info</h2>
            <div className="project-grid-2">
              <label>
                Project name
                <input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Title / thumbnail text
                <input
                  name="thumbNail"
                  value={formData.thumbNail}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Client
                <input
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Duration
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="full">
                Tech stack (short label)
                <input
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="e.g. React, Node, MongoDB"
                  required
                />
              </label>
              <label className="full">
                Visit link (optional — button only shows if set)
                <input
                  type="url"
                  name="projectLink"
                  value={formData.projectLink}
                  onChange={handleChange}
                  placeholder="https://"
                />
              </label>
              <label className="full">
                Description
                <textarea
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </section>

          {/* Media — classic vs showcase */}
          <section className="project-card">
            <h2>3. Hero media</h2>
            {isShowcase ? (
              <>
                <p className="hint">
                  Prefer a YouTube URL for the hero. If you add a video, hero
                  images are optional. If there is no video and you add 2+
                  images, the portfolio shows an image carousel in the hero.
                </p>
                <label>
                  YouTube URL (hero video)
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </label>
                {!String(formData.youtubeUrl || "").trim() && (
                  <>
                    <label className="file-label">
                      Main image (optional if you only use gallery)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHero}
                      />
                    </label>
                    {heroPreview ? (
                      <div
                        className="hero-preview"
                        style={{ backgroundImage: `url(${heroPreview})` }}
                      />
                    ) : null}
                    <label className="file-label" style={{ marginTop: "1rem" }}>
                      More images (2+ = carousel in hero)
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryAdd}
                      />
                    </label>
                    <div className="gallery-row">
                      {galleryPreviews.map((src, index) => (
                        <div
                          key={`${src}-${index}`}
                          className="gallery-thumb"
                          style={{ backgroundImage: `url(${src})` }}
                        >
                          <button
                            type="button"
                            onClick={() => removeGalleryAt(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {String(formData.youtubeUrl || "").trim() && (
                  <p className="hint">
                    Video set — images are not required for the hero.
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="hint">
                  Add one image for a single hero, or 2+ images for a carousel
                  on the project detail page.
                </p>
                <label className="file-label">
                  Main / hero image
                  <input type="file" accept="image/*" onChange={handleHero} />
                </label>
                {heroPreview ? (
                  <div
                    className="hero-preview"
                    style={{ backgroundImage: `url(${heroPreview})` }}
                  />
                ) : (
                  <p className="hint">No main image yet.</p>
                )}
                <label className="file-label" style={{ marginTop: "1rem" }}>
                  Extra images (optional — enables hero carousel)
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryAdd}
                  />
                </label>
                <div className="gallery-row">
                  {galleryPreviews.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="gallery-thumb"
                      style={{ backgroundImage: `url(${src})` }}
                    >
                      <button
                        type="button"
                        onClick={() => removeGalleryAt(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Technologies — compact */}
          <section className="project-card">
            <h2>4. Technologies</h2>
            <p className="hint">
              Search and add skills. Only selected skills appear on the project.
            </p>

            {selectedSkills.length > 0 && (
              <div className="selected-skills">
                {selectedSkills.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className="skill-chip is-on"
                    onClick={() => toggleSkill(s.id)}
                    title="Click to remove"
                  >
                    {s.name} ×
                  </button>
                ))}
              </div>
            )}

            <input
              type="search"
              className="skill-search"
              placeholder="Search skills to add…"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
            />

            <div className="skill-pick-list">
              {filteredSkills.map((skill) => {
                const on = selectedTechIds.has(String(skill._id));
                return (
                  <div key={skill._id} className="skill-pick-row">
                    <button
                      type="button"
                      className={`skill-chip ${on ? "is-on" : ""}`}
                      onClick={() => toggleSkill(skill._id)}
                    >
                      {on ? "✓ " : "+ "}
                      {skill.skillName}
                    </button>
                  </div>
                );
              })}
              {!skillSearch.trim() && (
                <p className="hint">
                  Showing top matches — type to find more skills.
                </p>
              )}
            </div>

            <Button
              variant="primary"
              type="button"
              onClick={() => setShow(true)}
              style={{ marginTop: "0.75rem" }}
            >
              Create new skill
            </Button>
          </section>

          {/* Showcase-only */}
          {isShowcase && (
            <section className="project-card showcase-card">
              <h2>5. Showcase content</h2>
              <p className="hint">
                These fields only appear for Showcase layout.
              </p>

              <div className="block-editor">
                <h3>Problem</h3>
                <select
                  value={formData.problem?.format || "paragraph"}
                  onChange={(e) =>
                    updateBlock("problem", { format: e.target.value })
                  }
                >
                  <option value="paragraph">Paragraph</option>
                  <option value="bullets">Bullet points</option>
                </select>
                {(formData.problem?.format || "paragraph") === "paragraph" ? (
                  <textarea
                    rows="4"
                    value={formData.problem?.text || ""}
                    onChange={(e) =>
                      updateBlock("problem", { text: e.target.value })
                    }
                    placeholder="Describe the problem"
                  />
                ) : (
                  <>
                    {(formData.problem?.items || []).map((item, idx) => (
                      <div className="bullet-row" key={`p-${idx}`}>
                        <input
                          value={item}
                          onChange={(e) => {
                            const items = [...(formData.problem?.items || [])];
                            items[idx] = e.target.value;
                            updateBlock("problem", { items });
                          }}
                          placeholder={`Bullet ${idx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const items = (formData.problem?.items || []).filter(
                              (_, i) => i !== idx
                            );
                            updateBlock("problem", { items });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateBlock("problem", {
                          format: "bullets",
                          items: [...(formData.problem?.items || []), ""],
                        })
                      }
                    >
                      Add bullet
                    </button>
                  </>
                )}
              </div>

              <div className="block-editor">
                <h3>Solution</h3>
                <select
                  value={formData.solution?.format || "paragraph"}
                  onChange={(e) =>
                    updateBlock("solution", { format: e.target.value })
                  }
                >
                  <option value="paragraph">Paragraph</option>
                  <option value="bullets">Bullet points</option>
                </select>
                {(formData.solution?.format || "paragraph") === "paragraph" ? (
                  <textarea
                    rows="4"
                    value={formData.solution?.text || ""}
                    onChange={(e) =>
                      updateBlock("solution", { text: e.target.value })
                    }
                    placeholder="Describe the solution"
                  />
                ) : (
                  <>
                    {(formData.solution?.items || []).map((item, idx) => (
                      <div className="bullet-row" key={`s-${idx}`}>
                        <input
                          value={item}
                          onChange={(e) => {
                            const items = [...(formData.solution?.items || [])];
                            items[idx] = e.target.value;
                            updateBlock("solution", { items });
                          }}
                          placeholder={`Bullet ${idx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const items = (
                              formData.solution?.items || []
                            ).filter((_, i) => i !== idx);
                            updateBlock("solution", { items });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateBlock("solution", {
                          format: "bullets",
                          items: [...(formData.solution?.items || []), ""],
                        })
                      }
                    >
                      Add bullet
                    </button>
                  </>
                )}
              </div>

              <div className="block-editor">
                <h3>FAQs</h3>
                {(formData.faqs || []).map((faq, idx) => (
                  <div className="faq-editor" key={`faq-${idx}`}>
                    <input
                      value={faq.question || ""}
                      onChange={(e) => {
                        const faqs = [...(formData.faqs || [])];
                        faqs[idx] = { ...faqs[idx], question: e.target.value };
                        setFormData((p) => ({ ...p, faqs }));
                      }}
                      placeholder="Question"
                    />
                    <textarea
                      rows="3"
                      value={faq.answer || ""}
                      onChange={(e) => {
                        const faqs = [...(formData.faqs || [])];
                        faqs[idx] = { ...faqs[idx], answer: e.target.value };
                        setFormData((p) => ({ ...p, faqs }));
                      }}
                      placeholder="Answer"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          faqs: (p.faqs || []).filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      Remove FAQ
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      faqs: [
                        ...(p.faqs || []),
                        { question: "", answer: "" },
                      ],
                    }))
                  }
                >
                  Add FAQ
                </button>
              </div>
            </section>
          )}

          {!view && (
            <div className="project-actions">
              <button type="submit" className="save-btn" disabled={isLoading}>
                {isLoading
                  ? "Saving…"
                  : params?.id
                  ? "Update project"
                  : "Create project"}
              </button>
            </div>
          )}
        </fieldset>
      </form>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Skill name</Form.Label>
              <Form.Control
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. React"
              />
            </Form.Group>
            <div style={{ marginTop: "1rem", display: "flex", gap: "8px" }}>
              <Button variant="secondary" onClick={() => setShow(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleAddSkillModal}>
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
