import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

export default function Info() {
  const [show, setShow] = useState(false);

  const showForm = () => {
    setShow(true);
    console.log(show);
  };

  const [input, setInput] = useState(0);

  const handleId = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editMyData?.name);
    formData.append("field", editMyData?.field);
    formData.append("message", editMyData?.message);
    formData.append("account", editMyData?.account);
    formData.append("accountUrl", editMyData?.accountUrl);
    // formData.append("image", editMyData?.image);
  };

  const [myData, setMyData] = useState(null);
  const [editMyData, setEditMyData] = useState(null);

  const getData = async () => {
    const res = await fetch(
      "http://localhost:5000/developer_info/6450cb8a8eb415ba6bd72ae9"
    ).then((res) => res.json());
    setMyData(res.data);
    setEditMyData(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Dev Information</h1>
      <form>
        <input
          type="number"
          name="id"
          onChange={handleId}
          value={editMyData?._id}
          placeholder="enter id"
        />
      </form>
      {myData && (
        <div className="container">
          <form
            method="post"
            onSubmit={handleSubmit}
            className={show ? "show" : "dontShow"}
          >
            <input
              type="text"
              name="name"
              id=""
              value={editMyData?.name}
              placeholder="Full Name"
              required
            />
            <input
              type="text"
              name="field"
              id=""
              value={editMyData?.field}
              placeholder="Field"
              required
            />
            <input
              type="text"
              name="address"
              id=""
              value={editMyData?.address}
              placeholder="Address"
              required
            />
            <input
              type="number"
              name="phone"
              id=""
              value={editMyData?.phone}
              placeholder="Mobile Number"
              required
            />
            <input
              type="email"
              name="email"
              id=""
              value={editMyData?.email}
              placeholder="example@email.com"
              required
            />
            <textarea
              name="message"
              id=""
              col="30"
              rows="10"
              placeholder="About Yourself!"
              required
            >
              {editMyData?.about}
            </textarea>
            <select name="" id="" placeholder="Personal Accounts">
              <option value="">Select Accounts...</option>
              <option value={editMyData?._id}>Github</option>
              <option value={editMyData?._id}>LinkedIn</option>
              <option value={editMyData?._id}>StackOverflow</option>
            </select>
            <input
              type="url"
              name="acoountsUrl"
              id=""
              accept=""
              placeholder="Accounts Url https//:"
              required
            />
            <input
              type="file"
              name="image"
              id=""
              accept="image/jpg, image/jpeg, image/png"
              required
            />
            <button>SUBMIT</button>
          </form>

          {/* Information */}
          <div className="container-fluid mb-4 mb-lg-2">
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
                <img
                  src={"https://i.imgur.com/TarFi3P.png"}
                  alt=""
                  width={"100%"}
                />
              </div>
            </div>
          </div>

          <button onClick={showForm} className={show ? "dontShow" : "show"}>
            <FaEdit /> EDIT
          </button>
        </div>
      )}
    </div>
  );
}
