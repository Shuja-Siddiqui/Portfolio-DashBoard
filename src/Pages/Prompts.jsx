import React, { useState, useEffect } from "react";
import { addPrompt, fetchPrompt, updatePrompt } from "../api";
import { useLocation, useNavigate, useParams } from "react-router";

export default function Prompts() {
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState(false);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    if (params?.id) setId(params.id);
    else setId("");

    setView(location.pathname.split("/")[2] === "view");
  }, [params?.id, location.pathname]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const prompt = await fetchPrompt(id);
      if (prompt) {
        setFormData(prompt);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res;
      if (!id) {
        res = await addPrompt(formData);
      } else {
        res = await updatePrompt(id, formData);
      }
      if (res) {
        navigate("/promptsDashboard");
        alert(
          location.pathname.split("/")[2] === "edit"
            ? "Prompt updated successfully!"
            : "Prompt added successfully!"
        );
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>
        {location.pathname.split("/")[2] === "view"
          ? "View Prompt"
          : location.pathname.split("/")[2] === "edit"
          ? "Edit Prompt"
          : "Add Prompt"}
      </h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" className="text-white">
          Title:
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Prompt Title"
          required
          readOnly={view}
          className="mb-3"
        />
        <label htmlFor="prompt" className="text-white">
          Prompt Template:
        </label>
        <textarea
          name="prompt"
          value={formData.prompt}
          onChange={(e) =>
            setFormData({ ...formData, prompt: e.target.value })
          }
          cols="30"
          rows="15"
          placeholder="Enter your prompt template here. Use placeholders like {developer}, {projects}, {jobDescription} if needed."
          required
          readOnly={view}
          className="mb-3"
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
      </form>
    </div>
  );
}

