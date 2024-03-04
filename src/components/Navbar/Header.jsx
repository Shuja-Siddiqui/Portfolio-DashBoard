import { useState } from "react";
import { FaBars, FaUserAlt, FaDiceD20, FaBox, FaDashcube } from "react-icons/fa";
import { AiOutlineProject } from "react-icons/ai";
import { GiNothingToSay } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { MdLogout, MdSettings } from "react-icons/md";

export default function Header({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    {
      path: "/developers",
      name: "Dashboard",
      icon: <FaDashcube />,
    },
    {
      path: "/info",
      name: "Dev-Info",
      icon: <FaUserAlt />,
    },
    {
      path: "/services",
      name: "Services",
      icon: <FaDiceD20 />,
    },
    {
      path: "/projects",
      name: "Project",
      icon: <AiOutlineProject />,
    },

    {
      path: "/testimonials",
      name: "Testiminials",
      icon: <GiNothingToSay />,
    },
    {
      path: "/settings",
      name: "Settings",
      icon: <MdSettings />,
    },
    {
      path: "/logout",
      name: "Logout",
      icon: <MdLogout />,
    }
  ];
  return (
    <>
      <div
        className="container_div"
        style={{ position: "fixed", height: "100%", left: 0, top: 0 }}
      >
        <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
          <div className="top_section">
            <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
              Logo
            </h1>
            <div
              style={{ marginLeft: isOpen ? "50px" : "0px" }}
              className="bars"
            >
              <FaBars onClick={toggle} />
            </div>
          </div>
          <div className="menu">
            {menuItem?.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="link"
              >
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
      <main style={{ minHeight: "100vh" }}>{children}</main>
    </>
  );
}
