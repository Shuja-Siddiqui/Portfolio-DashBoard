import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FaEye, FaPen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { fetchPrompts, removePrompt } from "../../api";

export const PromptsDashboard = () => {
  const [formData, setFormData] = useState([]);
  const navigate = useNavigate();

  const getPrompts = async () => {
    const data = await fetchPrompts();
    if (data) {
      setFormData(data);
    }
  };

  useEffect(() => {
    getPrompts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prompt?")) {
      try {
        await removePrompt(id);
        alert("Prompt deleted successfully!");
        getPrompts(); // Refresh the list
      } catch (error) {
        console.log("Error deleting prompt:", error);
        alert("Failed to delete prompt. Please try again.");
      }
    }
  };

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ color: "white", textAlign: "center" }}>Prompts</h1>
        <button onClick={() => navigate("/prompts")}>+Add Prompt</button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr className="border-0">
            <th className="border-0 w-60">Title</th>
            <th className="border-0">Prompt Preview</th>
            <th className="border-0">Actions</th>
          </tr>
        </thead>
        <tbody style={{ width: "100%" }}>
          {formData?.length > 0 ? (
            formData?.map(({ title, prompt, _id }, index) => (
              <tr
                className="text-white border-success-subtle"
                key={_id || index}
                style={{ width: "100%" }}
              >
                <td className="text-white border-success-subtle" style={{ width: "20%" }}>
                  {title}
                </td>
                <td className="text-white border-success-subtle" style={{ width: "50%" }}>
                  {prompt && prompt.length > 100
                    ? prompt.substring(0, 100) + "..."
                    : prompt || "No prompt text"}
                </td>
                <td
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    className="border-0 p-0 m-0"
                    style={{ background: "transparent", color: "#01be96" }}
                    onClick={() => navigate(`/prompts/view/${_id}`)}
                    title="View"
                  >
                    <FaEye />
                  </button>
                  <button
                    className="border-0 p-0 m-0"
                    style={{ background: "transparent", color: "#01be96" }}
                    onClick={() => navigate(`/prompts/edit/${_id}`)}
                    title="Edit"
                  >
                    <FaPen />
                  </button>
                  <button
                    className="border-0 p-0 m-0"
                    style={{ background: "transparent", color: "rgba(252, 63, 63, 0.664)" }}
                    onClick={() => handleDelete(_id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", color: "white", padding: "2rem" }}>
                No prompts found. Click "+Add Prompt" to create one.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

