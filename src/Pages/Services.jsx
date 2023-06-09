import { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { createServiceRequest, deleteServiceRequest } from "../api";

import { EditService } from "../components";
import { Toaster, Confirm } from "../common";
// const uid = localStorage.getItem("user_id");

export default function Services() {
  const [serviceId, setServiceId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToaster, setShowToaster] = useState(false);
  const [serviceData, setServiceData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleEditClick = (id) => {
    const service = serviceData.find((service) => service._id === id);
    setIsEditing(true);
    setModalData(service);
  };

  const handleDeleteClick = (id) => {
    const service = serviceData.find((project) => project._id === id);
    setServiceId(id);
    setShowConfirm(true);
    setModalData(service);
  };

  const getData = async () => {
    const res = await fetch(
      `http://localhost:5000/service/6450cb8a8eb415ba6bd72ae9`
    ).then((res) => res.json());
    setServiceData(res.data);
  };

  const handleCeateService = async () => {
    const response = await createServiceRequest(data);
    setData({
      name: "",
      description: "",
    });
    response.status === 201 && getData();
  };

  // const handleDeleteClick = () => {
  //   setShowConfirm(true);
  // };

  const handleDeleteService = async () => {
    const response = await deleteServiceRequest(serviceId);

    response?.status === 200 && getData();
    setShowConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("field", serviceData?.field);
    formData.append("message", serviceData?.message);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>SERVICES</h1>
      <form method="post" onSubmit={handleSubmit}>
        <select
          name="field"
          id=""
          required
          value={data?.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        >
          <option value="">Select...</option>
          <option value={"ui/ux designer"}>ui/ux designer</option>
          <option value={"graphic designer"}>graphic designer</option>
          <option value={"web designer"}>web designer</option>
          <option value={"App Development"}>App Development</option>
          <option value={"Web Development"}>Web Development</option>
        </select>
        <textarea
          name="message"
          id=""
          value={data?.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          col="30"
          rows="5"
          placeholder="Discription"
          required
        />
        <button
          disabled={!data?.name || !data?.description}
          onClick={handleCeateService}
        >
          SUBMIT
        </button>
      </form>
      <div className="table-responsive-lg table-responsive-md table-responsive-sm">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">NAME</th>
              <th scope="col">DESCRIPTION</th>
              <th scope="col">EDIT</th>
              <th scope="col">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {serviceData &&
              serviceData?.map((i, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{i.name}</td>
                  <td>{i.description}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    className="edit_icon"
                    onClick={() => handleEditClick(i?._id)}
                  >
                    <MdEdit />
                  </td>
                  <td
                    className="delete_icon"
                    onClick={() => {
                      handleDeleteClick(i?._id);
                    }}
                  >
                    <MdDelete />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isEditing && (
        <EditService
          data={modalData}
          onClose={handleCloseModal}
          getData={getData}
        />
      )}
      {showToaster && (
        <Toaster
          text="Service deleted"
          showToaster={showToaster}
          setShowToaster={setShowToaster}
        />
      )}
      {showConfirm && (
        <Confirm
          data={modalData}
          onClose={setShowConfirm}
          onConfirm={handleDeleteService}
        />
      )}
    </div>
  );
}
