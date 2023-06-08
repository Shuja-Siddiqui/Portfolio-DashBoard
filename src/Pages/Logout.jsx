import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setLoggedIn(false);
    navigate("/");
  }, []);

  return;
}

export default Logout;
