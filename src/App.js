import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Navbar/Header";
import Services from "./Pages/Services";
import Info from "./Pages/Info";
import Projects from "./Pages/Projects";
import Testimonials from "./Pages/Testimonials";
import Settings from "./Pages/Settings";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Logout from "./Pages/Logout";
import { DeveloperDashboard } from "./components";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("@token")) {
      setLoggedIn(true);
    }
  });

  return (
    <BrowserRouter>
      {loggedIn ? (
        <Header>
          <Container fluid>
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              <Route path="/info" element={<Info />} />
              <Route path="/services" element={<Services />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/developers" element={<DeveloperDashboard />} />
              <Route path="/developers/view/:id" element={<Info />} />
              <Route path="/developers/edit/:id" element={<Info />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/view/:id" element={<Projects />} />
              <Route path="/projects/edit/:id" element={<Projects />} />

              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Container>
        </Header>
      ) : (
        <Container fluid style={{ background: "#2C2C36", height: "100vh" }}>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </Container>
      )}
    </BrowserRouter>
  );
}

export default App;
