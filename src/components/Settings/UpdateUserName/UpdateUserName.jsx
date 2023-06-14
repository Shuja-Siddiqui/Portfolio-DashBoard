import { useState } from "react";
import { updateUserRequest } from "../../../api";
import { Toaster } from "../../../common";

export const UpdateUserName = () => {
  const [data, setData] = useState({
    username: "",
    new_username: "",
  });
  const [showToaster, setShowToaster] = useState(false);

  const handleCreateSettings = async () => {
    const response = await updateUserRequest(data);
    console.log(response);
    response?.status === 200 && setShowToaster(true);
    setData({
      username: "",
      new_username: "",
    });
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
      <label>Current Username</label>
      <input
        type="text"
        name="current_username"
        id=""
        value={data.username}
        onChange={(e) => setData({ ...data, username: e.target.value })}
        placeholder="Current username"
        required
      />
      <label>New Username</label>
      <input
        type="text"
        name="new_username"
        value={data.new_username}
        onChange={(e) => setData({ ...data, new_username: e.target.value })}
        id=""
        placeholder="New username"
        required
      />

      <button type="button" onClick={handleCreateSettings}>
        Update
      </button>
    </form>
  );
};
