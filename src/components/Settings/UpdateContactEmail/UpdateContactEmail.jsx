import { useState } from "react";
import { updateContactEmailRequest } from "../../../api";

export const UpdateContactEmail = () => {
  const [data, setData] = useState({
    current_email: "",
    new_email: "",
  });

  const handleCreateSettings = async () => {
    const response = await updateContactEmailRequest(data);
    response?.status === 200 &&
      setData({
        current_email: "",
        new_email: "",
      });
    console.log("Creating...", response);
  };
  return (
    <form>
      <label>Current Email</label>
      <input
        type="email"
        name="current_email"
        id=""
        value={data.current_email}
        onChange={(e) => setData({ ...data, current_email: e.target.value })}
        placeholder="Current email"
        required
      />
      <label>New Email</label>
      <input
        type="email"
        name="new_email"
        value={data.new_email}
        onChange={(e) => setData({ ...data, new_email: e.target.value })}
        id=""
        placeholder="New email"
        required
      />

      <button type="button" onClick={handleCreateSettings}>
        Update
      </button>
    </form>
  );
};
