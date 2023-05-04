import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";

export default function Services() {
  const [serviceData, setServiceData] = useState(null);

  const getData = async () => {
    const res = await fetch(
      "http://localhost:5000/service/6450cb8a8eb415ba6bd72ae9"
    ).then((res) => res.json());
    setServiceData(res.data);
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
        <select name="field" id="" required>
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
          value={serviceData?.message}
          col="30"
          rows="5"
          placeholder="Discription"
          required
        />
        <button>SUBMIT</button>
      </form>
      <div className="table-responsive-lg table-responsive-md table-responsive-sm">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">NAME</th>
              <th scope="col">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {serviceData && serviceData.map((i, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{i.name}</td>
                <td>{i.description}</td>
                <td className="delete_icon">
                  <MdDelete />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
