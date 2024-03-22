import { useState } from "react";
import {
  FaBars,
  FaUserAlt,
  FaDiceD20,
  FaBox,
  FaDashcube,
} from "react-icons/fa";
import { AiOutlineProject } from "react-icons/ai";
import { GiNothingToSay } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { MdLogout, MdSettings } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import logo from "../../assets/img/logo.png";
export default function Header({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    {
      path: "/projectDashboard",
      name: "Projects",
      icon: <AiOutlineProject />,
    },
    {
      path: "/developers",
      name: "Developers",
      icon: <FaUserAlt />,
    },
    {
      path: "/servicesDashboard",
      name: "Services",
      icon: <FaDiceD20 />,
    },

    {
      path: "/testimonialsDashboard",
      name: "Testiminials",
      icon: <GiNothingToSay />,
    },
    {
      path: "/education",
      name: "Education",
      icon: <GiGraduateCap />,
    },
    {
      path: "/logout",
      name: "Logout",
      icon: <MdLogout />,
    },
  ];
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div className="container_div" style={{ height: "100vh" }}>
        <div
          style={{
            width: isOpen ? "250px" : "50px",
          }}
          className="sidebar"
        >
          <div className="top_section">
            {isOpen && (
              <div
                onClick={toggle}
                style={{
                  marginLeft: "0px",
                  backgroundImage: `url(${logo})`, // Set background image
                  backgroundSize: "cover", // Cover the entire container
                  backgroundPosition: "center", // Center the background image
                  width: "100px", // Set width
                  height: "100px", // Set height
                }}
              ></div>
            )}
            {!isOpen && (
              <button onClick={toggle} style={{ padding: "0", margin: "0" }}>
                {" "}
                <FaBars />
              </button>
            )}
          </div>
          <div className="menu">
            {menuItem?.map((item, index) => (
              <NavLink to={item.path} key={index} className="link">
                <div className="icon">{item.icon}</div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  {item.name}
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <main
        style={{
          minHeight: "100vh",
          width: isOpen ? "calc(100%-250px)" : "calc(100%-50px)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
