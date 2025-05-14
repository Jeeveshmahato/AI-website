import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar"
import Home from "./Components/Home";
import About from "./Components/About";
import AITool from "./Components/AiTool";
import AITools from "./Components/AITools"
import Contact from "./Components/Contact";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tools" element={<AITool />} />
        <Route path="/aitools" element={<AITools />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;