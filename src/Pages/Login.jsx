import { useState } from "react";

export default function Login() {
  const [data, setData] = useState({
    username:"",
    password:"",
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
        <button>LogIn</button>
      </form>
    </div>
  );
}
