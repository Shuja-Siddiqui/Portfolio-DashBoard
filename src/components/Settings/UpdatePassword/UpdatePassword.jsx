import { useState } from "react";
import { updateUserRequest } from "../../../api";

export const UpdatePassword = () => {
  const [data, setData] = useState({
    password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleCreateSettings = async () => {
    const response = await updateUserRequest(data);
    response?.status === 200 &&
      setData({
        password: "",
        new_password: "",
        confirm_password: "",
      });
  };
  return (
    <form>
      <label>Current Password</label>
      <input
        type="password"
        name="password"
        id=""
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        placeholder="Current password"
        required
      />
      <label>New Password</label>
      <input
        type="password"
        name="new_password"
        value={data.new_password}
        onChange={(e) => setData({ ...data, new_password: e.target.value })}
        id=""
        placeholder="New password"
        required
      />
      <label>Confirm Password</label>
      <input
        type="password"
        name="confirm_password"
        value={data.confirm_password}
        onChange={(e) => setData({ ...data, confirm_password: e.target.value })}
        id=""
        placeholder="Confirm password"
        required
      />

      <button type="button" onClick={handleCreateSettings}>
        Update
      </button>
    </form>
  );
};
