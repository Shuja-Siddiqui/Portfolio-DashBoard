import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  addTestimonials,
  baseURL,
  createImageId,
  fetchTestimonial,
  updateTestimonial,
} from "../../api";

export const Testimonials = () => {
  const [file, setFile] = useState("");
  const [view, setView] = useState(false);
  const [id, setId] = useState("");
  const [heroToShow, setHeroToShow] = useState("");
  const [formData, setFormData] = useState({
    clientName: "",
    clientReview: "",
    stars: 1,
    clientImage: "",
  });
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const handleHero = (e) => {
    setFile(e.target.files[0]);
    const heroimage = URL.createObjectURL(e.target.files[0]);
    setHeroToShow(heroimage);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (!params?.id) {
      if (file !== "") {
        let hero = await createImageId(file);
        formData["clientImage"] = hero;
      }
      res = await addTestimonials(formData);
    } else {
      if (formData.clientImage !== file && file !== "") {
        let hero = await createImageId(file);
        formData["clientImage"] = hero;
      }
      formData["clientImage"] = formData?.clientImage;
      res = await updateTestimonial(id, formData);
    }
    if (res) navigate("/testimonialsDashboard");
  };
  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    }
    if (location.pathname.split("/")[2] === "view") {
      setView(true);
    }
  }, [params]);
  const getTestimonial = async () => {
    const res = await fetchTestimonial(id);
    if (res) {
      setHeroToShow(`${baseURL}/file/${res?.clientImage}`);
      setFormData(res);
    }
  };
  useEffect(() => {
    if (id) getTestimonial();
  }, [id]);
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <div>
      <h1 style={{ color: "white", textAlign: "center" }}>Testimonials</h1>
      <form method="post" onSubmit={handleSubmit}>
        <fieldset disabled={view ? "disabled" : ""}>
          <label className="mb-3" htmlFor="clientReview">
            Client Review
          </label>
          <textarea
            name="clientReview"
            className="mb-3 m-0 p-0"
            id=""
            col="30"
            rows="5"
            value={formData.clientReview}
            onChange={(e) =>
              setFormData({ ...formData, clientReview: e.target.value })
            }
            placeholder="Client Review"
            required
          />
          <label className="mb-3" htmlFor="clientName">
            Client Name
          </label>

          <input
            className="mb-3 mt-0"
            type="text"
            name="clientName"
            id=""
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            placeholder="Client Name"
            required
          />
          <label className="mb-3" htmlFor="stars">
            Select Rating
          </label>

          <select
            name="stars"
            id=""
            value={formData.stars}
            required
            onChange={(e) =>
              setFormData({ ...formData, stars: e.target.value })
            }
          >
            <option value="">Select Star...</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
          <label className="mb-3" htmlFor="hero">
            Hero Image:
          </label>
          <input
            className="mb-3"
            type="file"
            name="hero"
            id="hero"
            onChange={handleHero}
            accept="image/*"
          />
          {heroToShow && (
            <div
              style={{
                backgroundImage: `url(${heroToShow})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%", // Adjust as per your design
                height: "390px", // Adjust as per your design
                border: "2px solid #aaa",
                marginBottom: "10px",
              }}
            ></div>
          )}
          {!view && <button>{id ? "UPDATE" : "SUBMIT"}</button>}
        </fieldset>
      </form>
    </div>
  );
};
