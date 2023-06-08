import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Navbar/Header";
import Dashboard from "./components/Navbar/Dshboard";
import Services from "./Pages/Services";
import Info from "./Pages/Info";
import Projects from "./Pages/Projects";
import Testimonials from "./Pages/Testimonials";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Logout from "./Pages/Logout";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    token ? setLoggedIn(true) : setLoggedIn(false);
  }, [token]);
  return (
    <BrowserRouter>
      {loggedIn ? (
        <Header>
          <Container fluid>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/info" element={<Info />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/logout" element={<Logout setLoggedIn={setLoggedIn} />} />
            </Routes>
          </Container>
        </Header>
      ) : (
        <Container fluid style={{ background: "#2C2C36", height: "100vh" }}>
          <Routes>
            <Route path="*" element={<Login setToken={setToken} />} />
          </Routes>
        </Container>
      )}
    </BrowserRouter>
  );
}

export default App;
