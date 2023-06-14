import { useState } from "react";
import { updateContactEmailRequest } from "../../../api";
import { Toaster } from "../../../common";

export const UpdateContactEmail = () => {
  const [data, setData] = useState({
    current_email: "",
    new_email: "",
  });
  const [showToaster, setShowToaster] = useState(false);

  const handleCreateSettings = async () => {
    const response = await updateContactEmailRequest(data);
    response?.status === 200 && setShowToaster(true);
    response?.status === 200 &&
      setData({
        current_email: "",
        new_email: "",
      });
  };

  const validateEmail = (email) => {
    const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailPattern.test(email);
  };

  return (
    <form style={{ width: "100%", maxWidth: "100%" }}>
      {showToaster && (
        <Toaster
          text="Updated"
          showToaster={showToaster}
          setShowToaster={setShowToaster}
        />
      )}
      <label>Current Email</label>
      <input
        type="email"
        name="current_email"
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
        placeholder="New email"
        required
      />

      <button
        disabled={
          !data.current_email ||
          !data.new_email ||
          !validateEmail(data.current_email) ||
          !validateEmail(data.new_email)
        }
        type="button"
        onClick={handleCreateSettings}
      >
        Update
      </button>
    </form>
  );
};
