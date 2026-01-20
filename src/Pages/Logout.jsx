import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    setLoggedIn(false);
    navigate("/");
  }, [navigate, setLoggedIn]);

  return;
}

export default Logout;
