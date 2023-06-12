import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  createTestimonialRequest,
  deleteTestimonialRequest,
  getImageRequest,
  getTestimonialRequest,
} from "../api";
import { EditTestimonial, EditImage } from "../components";
import { Confirm, Toaster } from "../common";

export default function Testimonials() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [testimonialId, setTestimonialId] = useState("");
  const [testimonialData, setTestimonialData] = useState(null);
  const [file, setFile] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [data, setData] = useState({
    client_name: "",
    review: "",
    stars: "",
    field: "",
  });

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleCloseImageModel = () => {
    setIsImageEditing(false);
  };

  const handleDeleteClick = (id) => {
    const testimonial = testimonialData.find(
      (testimonial) => testimonial._id === id
    );
    setTestimonialId(id);
    setShowConfirm(true);
    setModalData(testimonial);
  };

  const handleEditClick = (id) => {
    const testimonial = testimonialData.find(
      (testimonial) => testimonial._id === id
    );
    setIsEditing(true);
    setModalData(testimonial);
  };

  const handleImageEditClick = (id) => {
    const testimonial = testimonialData.find(
      (testimonial) => testimonial._id === id
    );
    setIsImageEditing(true);
    setModalData(testimonial);
  };

  const getData = async () => {
    const { data } = await getTestimonialRequest();
    setTestimonialData(data?.data);
  };

  const handleCreateTestimonial = async () => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("client_name", data.client_name);
    formData.append("review", data.review);
    formData.append("field", data.field);
    formData.append("stars", data.stars);
    const response = await createTestimonialRequest(formData);
    setData({
      client_name: "",
      review: "",
      stars: "",
      field: "",
    });

    response?.status && getData();
  };

  const handleDeleteTestimonial = async () => {
    const response = await deleteTestimonialRequest(testimonialId);
    response?.status === 204 && getData();
    setShowToaster(true);
    setToasterMessage("Testimonial deleted successfuly");
    setShowConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Testimonials</h1>
      <form method="post" onSubmit={handleSubmit}>
        <textarea
          name="review"
          id=""
          col="30"
          rows="5"
          value={data.review}
          onChange={(e) => setData({ ...data, review: e.target.value })}
          placeholder="Client Review"
          required
        />
        <input
          type="text"
          name="client_name"
          id=""
          value={data.client_name}
          onChange={(e) => setData({ ...data, client_name: e.target.value })}
          placeholder="Client Name"
          required
        />
        <input
          type="text"
          name="field"
          value={data.field}
          onChange={(e) => setData({ ...data, field: e.target.value })}
          id=""
          placeholder="Field"
          required
        />
        <select
          name="star"
          id=""
          value={data.stars}
          required
          onChange={(e) => setData({ ...data, stars: e.target.value })}
        >
          <option value="">Select Star...</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
        <input
          type="file"
          name="image"
          id=""
          value=""
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/jpg, image/jpeg, image/png"
        />
        <button onClick={handleCreateTestimonial}>SUBMIT</button>
      </form>
      <div className="table-responsive-lg table-responsive-md table-responsive-sm">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Client NAME</th>
              <th scope="col">FIELD</th>
              <th scope="col">STARS</th>
              <th scope="col">REVIEW</th>
              <th scope="col">IMAGE</th>
              <th scope="col">EDIT</th>
              <th scope="col">DELETE</th>
            </tr>
          </thead>
          {testimonialData &&
            testimonialData.map((i, index) => (
              <tbody key={index}>
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{i.client_name}</td>
                  <td>{i.field}</td>
                  <td>{i.stars}</td>
                  <td>{i.review}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleImageEditClick(i?._id);
                    }}
                  >
                    <img
                      style={{ width: "40px", height: "40px" }}
                      src={getImageRequest(i?.image)}
                    />
                  </td>
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
              </tbody>
            ))}
        </table>
      </div>
      {isEditing && (
        <EditTestimonial
          data={modalData}
          onClose={handleCloseModal}
          getData={getData}
          setToasterMessage={setToasterMessage}
          setShowToaster={setShowToaster}
        />
      )}
      {showToaster && (
        <Toaster
          text={toasterMessage}
          showToaster={showToaster}
          setShowToaster={setShowToaster}
        />
      )}
      {isImageEditing && (
        <EditImage
          data={modalData}
          onClose={handleCloseImageModel}
          getData={getData}
          setShowToaster={setShowToaster}
          setToasterMessage={setToasterMessage}
        />
      )}
      {showConfirm && (
        <Confirm
          data={modalData}
          onClose={setShowConfirm}
          onConfirm={handleDeleteTestimonial}
        />
      )}
    </div>
  );
}
