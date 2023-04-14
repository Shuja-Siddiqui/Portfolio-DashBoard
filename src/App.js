import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Navbar/Header';
import Dashboard from './components/Navbar/Dshboard';
import Services from './Pages/Services';
import Info from "./Pages/Info";
import Projects from './Pages/Projects';
import Testimonials from './Pages/Testimonials';

function App() {
  return (
  <BrowserRouter>
  <Header>
  <Routes>
    <Route path="/" element={<Dashboard/>} />
    <Route path="/info" element={<Info/>} />
    <Route path="/services" element={<Services/>} />
    <Route path="/projects" element={<Projects/>} />
    <Route path="/testimonials" element={<Testimonials/>} />
  </Routes>
  </Header>
  </BrowserRouter>
  );
}

export default App;
