import { useEffect, useState } from "react";
import { userData } from "../components/Navbar/Array";

export default function Info() {
  // let a = "";

  const [data, setData] = useState({
    name: "",
    field: "",
    address: "",
    phone: "",
    email: "",
    message: "",
    account: "",
    accountUrl: "",
    image: "",
  });

  const [input, setInput] = useState(0);

  const handleId = (e) => {
    const value = e.target.value;
    setInput(value);
  };

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

  const [myData, setMyData] = useState(null);

  useEffect(() => {
    const temp = userData.filter((item) => item.id == input);
    if (input !== 0) setMyData({ ...temp[0] });
  }, [input]);

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Dev Information</h1>
      <form>
        <input
          type="number"
          name="id"
          onChange={handleId}
          value={input.id}
          placeholder="enter id"
        />
      </form>
      {myData && (
        <div className="container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-8 col-sm-12">
                <div className="row">
                  <div className="row info">
                    <div className="title col-lg-3 col-sm-12">
                      <h3>NAME:</h3>
                    </div>
                    <div className="sub_title col-lg-8 col-sm-12 mb-3">
                      <h4>{myData?.name}</h4>
                    </div>
                  </div>
                  <div className="row info">
                    <div className="title col-lg-3 col-sm-12">
                      <h3>FIELD:</h3>
                    </div>
                    <div className="sub_title col-lg-8 col-sm-12 mb-3">
                      <h4>{myData?.field}</h4>
                    </div>
                  </div>
                  <div className="row info">
                    <div className="title col-lg-3 col-sm-12">
                      <h3>EMAIL:</h3>
                    </div>
                    <div className="sub_title col-lg-8 col-sm-12">
                      <h4>{myData?.email}</h4>
                    </div>
                  </div>
                  <div className="row info">
                    <div className="title col-lg-3">
                      <h3>PHONE:</h3>
                    </div>
                    <div className="sub_title col-lg-8 col-sm-12 mb-3">
                      <h4>{myData?.phone}</h4>
                    </div>
                  </div>
                  <div className="row info">
                    <div className="title col-lg-3 col-sm-12">
                      <h3>ABOUT:</h3>
                    </div>
                    <div className="sub_title col-lg-8 col-sm-12 mb-3">
                      <h4>{myData?.about}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <img src={myData?.image} alt="" width={"100%"} />
              </div>
            </div>
          </div>
        </div>
      )}
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
