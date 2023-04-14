import { useState } from "react";

export default function Info() {
  const [data, setData] = useState({
    name: "",
    field: "",
    address:"",
    phone:"",
    email:"",
    message: "",
    account:"",
    accountUrl:"",
    image: "",
  });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("field", data.field);
    formData.append("message", data.message);
    formData.append("account", data.account);
    formData.append("accountUrl", data.accountUrl);
    formData.append("image", data.image);
  };

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Dev Information</h1>
      <form method="post" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          id=""
          onChange={handleChange}
          value={data.name}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="field"
          id=""
          onChange={handleChange}
          value={data.field}
          placeholder="Field"
          required
        />
        <input
          type="text"
          name="address"
          id=""
          onChange={handleChange}
          value={data.address}
          placeholder="Address"
          required
        />
        <input
          type="number"
          name="phone"
          id=""
          onChange={handleChange}
          value={data.phone}
          placeholder="+92"
          required
        />
        <input
          type="email"
          name="email"
          id=""
          onChange={handleChange}
          value={data.email}
          placeholder="example@email.com"
          required
        />
        <textarea
          name="message"
          id=""
          onChange={handleChange}
          value={data.message}
          col="30"
          rows="10"
          placeholder="About Yourself"
          required
        />
        <select name="" id="" placeholder="Personal Accounts">
          <option value="">Select Accounts...</option>
          <option value={data.account}>Github</option>
          <option value={data.account}>LinkedIn</option>
          <option value={data.account}>StackOverflow</option>
        </select>
        <input
          type="url"
          name="acoountsUrl"
          id=""
          accept=""
          onChange={handleChange}
          placeholder="Accounts Url https//:"
          required
        />
        <input
          type="file"
          name="image"
          id=""
          accept="image/jpg, image/jpeg, image/png"
          onChange={handleChange}
          required
        />
        <button>SUBMIT</button>
      </form>
    </div>
  );
}
