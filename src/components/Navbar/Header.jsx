import { useState } from "react";
import { FaBars, FaUserAlt, FaDiceD20, FaBox } from "react-icons/fa";
import { AiOutlineProject } from "react-icons/ai";
import { GiNothingToSay } from "react-icons/gi";
import { NavLink } from "react-router-dom";

export default function Header({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    {
      path: "/",
      name: "Dashboard",
      icon: <FaBox />,
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
  ];
  return (
    <div className="container_div">
      <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            Logo
          </h1>
          <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        <div className="menu">
          {menuItem.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="link"
              actviveclassName="active"
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
      <main>{children}</main>
    </div>
  );
}
