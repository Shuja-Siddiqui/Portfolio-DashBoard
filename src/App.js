import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Navbar/Header";
import Services from "./Pages/Services";
import Info from "./Pages/Info";
import Projects from "./Pages/Projects";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Logout from "./Pages/Logout";
import { DeveloperDashboard } from "./components/Info/DeveloperDashboard";
import { TestimonialsDashboard } from "./Pages/TestimonialsDashboard";
import { Testimonials } from "./components/Testimonial/Testimonials";
import { ProjectDashboard } from "./components";
import { ServicesDashboard } from "./components/Services/ServicesDashboard";
import { Education } from "./Pages/Education";
import { Experience } from "./Pages/Experience";
import { EducationDashboard } from "./components/Info/EducationDashboard";
import { ExperienceDashboard } from "./components/Info/ExperienceDashboard";
import { PromptsDashboard } from "./components/Prompts/PromptsDashboard";
import Prompts from "./Pages/Prompts";
import { VideosDashboard } from "./components/Info/VideosDashboard";
import Videos from "./Pages/Videos";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const token = localStorage.getItem("@token");

  useEffect(() => {
    if (token != null) {
      setLoggedIn(true);
    }
  }, [token]);

  useEffect(() => {
    console.log("loggedIn", loggedIn);
  }, [loggedIn]);

  return (
    <BrowserRouter>
      {loggedIn ? (
        <Container fluid style={{ backgroundColor: "#191923", padding: "0" }}>
          <Header>
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
              <Route path="/developers" element={<DeveloperDashboard />} />
              <Route path="/projectDashboard" element={<ProjectDashboard />} />
              <Route path="/developers/view/:id" element={<Info />} />
              <Route path="/developers/edit/:id" element={<Info />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projectDashboard/view/:id" element={<Projects />} />
              <Route path="/projectDashboard/edit/:id" element={<Projects />} />
              <Route path="/education" element={<Education />} />
              <Route path="/education/edit/:id" element={<Education />} />
              <Route path="/education/view/:id" element={<Education />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/experience/edit/:id" element={<Experience />} />
              <Route path="/experience/view/:id" element={<Experience />} />
              <Route
                path="/educationDashboard"
                element={<EducationDashboard />}
              />
              <Route
                path="/experienceDashboard"
                element={<ExperienceDashboard />}
              />
              <Route
                path="/promptsDashboard"
                element={<PromptsDashboard />}
              />
              <Route path="/prompts" element={<Prompts />} />
              <Route path="/prompts/view/:id" element={<Prompts />} />
              <Route path="/prompts/edit/:id" element={<Prompts />} />
              <Route
                path="/videosDashboard"
                element={<VideosDashboard />}
              />
              <Route path="/videos" element={<Videos />} />
              <Route path="/videos/view/:id" element={<Videos />} />
              <Route path="/videos/edit/:id" element={<Videos />} />

              <Route
                path="/logout"
                element={<Logout setLoggedIn={setLoggedIn} />}
              />
            </Routes>
          </Header>
        </Container>
      ) : (
        <Container fluid style={{ background: "#2C2C36", height: "100vh" }}>
          <Routes>
            <Route
              path="/"
              element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
            />
          </Routes>
        </Container>
      )}
    </BrowserRouter>
  );
}

export default App;
