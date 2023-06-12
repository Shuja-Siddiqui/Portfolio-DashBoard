import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  getDeveloperInfoRequest,
  getImageRequest,
  updateDeveloperInfoRequest,
} from "../api";

import { Toaster } from "../common";
// const uid = localStorage.getItem("user_id");

export default function Info() {
  const [showToaster, setShowToaster] = useState(false);
  const [show, setShow] = useState(false);
  const [myData, setMyData] = useState(null);
  const [editMyData, setEditMyData] = useState(null);
  const [file, setFile] = useState("");

  const showForm = () => {
    setShow(true);
  };

  const removeLink = (index) => {
    setEditMyData((prevData) => {
      const updatedLinks = [...prevData.links];
      updatedLinks.splice(index, 1);
      return {
        ...prevData,
        links: updatedLinks,
      };
    });
  };

  const addLink = () => {
    setEditMyData((prevData) => ({
      ...prevData,
      links: [...prevData.links, { title: "", path: "" }],
    }));
  };

  const getData = async () => {
    const { data } = await getDeveloperInfoRequest();
    setMyData(data?.data);
    setEditMyData(data?.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUpdateDeveloperInfoRequest = async () => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", editMyData?.name);
    formData.append("field", editMyData?.field);
    formData.append("address", editMyData?.address);
    formData.append("email", editMyData?.email);
    formData.append("phone", editMyData?.phone);
    formData.append("about", editMyData?.about);
    formData.append("links", JSON.stringify(editMyData.links));
    const response = await updateDeveloperInfoRequest(formData);
    response?.status === 200 && getData();
    setShow(false);
    setShowToaster(true);
  };

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Dev Information</h1>

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
              onChange={(e) =>
                setEditMyData({ ...editMyData, name: e.target.value })
              }
              placeholder="Full Name"
              required
            />
            <input
              type="text"
              name="field"
              id=""
              value={editMyData?.field}
              onChange={(e) =>
                setEditMyData({ ...editMyData, field: e.target.value })
              }
              placeholder="Field"
              required
            />
            <input
              type="text"
              name="address"
              id=""
              value={editMyData?.address}
              onChange={(e) =>
                setEditMyData({ ...editMyData, address: e.target.value })
              }
              placeholder="Address"
              required
            />
            <input
              type="text"
              name="phone"
              id=""
              value={editMyData?.phone}
              onChange={(e) =>
                setEditMyData({ ...editMyData, phone: e.target.value })
              }
              placeholder="Mobile Number"
              required
            />
            <input
              type="email"
              name="email"
              id=""
              value={editMyData?.email}
              onChange={(e) =>
                setEditMyData({ ...editMyData, email: e.target.value })
              }
              placeholder="example@email.com"
              required
            />
            <textarea
              name="message"
              id=""
              col="30"
              rows="10"
              value={editMyData?.about}
              placeholder="About Yourself!"
              onChange={(e) =>
                setEditMyData({ ...editMyData, about: e.target.value })
              }
              required
            >
              {editMyData?.about}
            </textarea>
            {editMyData?.links?.map((link, index) => (
              <div key={index}>
                <select
                  name=""
                  id=""
                  value={link.title}
                  onChange={(e) => {
                    const updatedLinks = [...editMyData.links];
                    updatedLinks[index].title = e.target.value;
                    setEditMyData({ ...editMyData, links: updatedLinks });
                  }}
                >
                  <option value="">Select Accounts...</option>
                  <option value={"github"}>Github</option>
                  <option value={"linkedIn"}>LinkedIn</option>
                  <option value={"stackoverflow"}>StackOverflow</option>
                </select>
                <input
                  type="url"
                  name="accountsUrl"
                  id=""
                  accept=""
                  value={link.path}
                  onChange={(e) => {
                    const updatedLinks = [...editMyData.links];
                    updatedLinks[index].path = e.target.value;
                    setEditMyData({ ...editMyData, links: updatedLinks });
                  }}
                  placeholder="Accounts URL https://"
                  required
                />
                <button
                  style={{ marginBottom: "5px" }}
                  onClick={() => removeLink(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button onClick={addLink}>Add Social</button>
            <>
              {editMyData?.image?._id && (
                <img
                  style={{ width: "150px", height: "150px" }}
                  src={getImageRequest(editMyData?.image?._id)}
                  alt="Preview"
                />
              )}
              <input
                type="file"
                name="image"
                id=""
                accept="image/jpg, image/jpeg, image/png"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </>
            <button onClick={handleUpdateDeveloperInfoRequest}>SUBMIT</button>
          </form>

          {showToaster && (
            <Toaster
              text="Developer added"
              showToaster={showToaster}
              setShowToaster={setShowToaster}
            />
          )}

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
              <div className="col-lg-3 col-sm-12">
                <img
                  src={getImageRequest(myData?.image)}
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
