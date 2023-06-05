import { useState } from "react";
import { loginRequest } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({setToken}) {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("field", data.field);
    formData.append("message", data.message);
    formData.append("projectDescription", data.projectDescription);
    formData.append("url", data.url);
  };

  const handleLogin = async () => {
    const response = await loginRequest(data);
    console.log("response for login is", response)
    localStorage.setItem("token", response?.data?.data?.token);
    localStorage.setItem('user_id', response?.data?.data?.user_id);
    setToken(response?.data?.data?.token);
    return response.status === 200 && navigate("/info");
  };

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Login</h1>
      <form method="post" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          id=""
          onChange={handleChange}
          value={data.name}
          placeholder="UserName"
          required
        />
        <input
          type="password"
          name="password"
          id=""
          onChange={handleChange}
          value={data.password}
          placeholder="Password"
          required
        />
        <button onClick={handleLogin}>LogIn</button>
      </form>
    </div>
  );
}
