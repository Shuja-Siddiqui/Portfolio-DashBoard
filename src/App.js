import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Navbar/Header";
import Services from "./Pages/Services";
import Info from "./Pages/Info";
import Projects from "./Pages/Projects";
import Settings from "./Pages/Settings";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Logout from "./Pages/Logout";
import { DeveloperDashboard } from "./components/Info/DeveloperDashboard";
import { ProjectDashboard } from "./components/Info/ProjectDashboard";
import { TestimonialsDashboard } from "./Pages/TestimonialsDashboard";
import { Testimonials } from "./components/Testimonial/Testimonials";
import { ServicesDashboard } from "./components";
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
              <Route
                path="/servicesDashboard"
                element={<ServicesDashboard />}
              />
              <Route path="/services" element={<Services />} />
              <Route path="/services/view/:id" element={<Services />} />
              <Route path="/services/edit/:id" element={<Services />} />
              <Route
                path="/testimonialsDashboard"
                element={<TestimonialsDashboard />}
              />
              <Route path="/testimonials/edit/:id" element={<Testimonials />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/testimonials/view/:id" element={<Testimonials />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/developers" element={<DeveloperDashboard />} />
              <Route path="/projectDashboard" element={<ProjectDashboard />} />
              <Route path="/developers/view/:id" element={<Info />} />
              <Route path="/developers/edit/:id" element={<Info />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projectDashboard/view/:id" element={<Projects />} />
              <Route path="/projectDashboard/edit/:id" element={<Projects />} />

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
