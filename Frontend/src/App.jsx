import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import AITools from "./Components/AITools";
import Contact from "./Components/Contact";
import Submit from "./Components/Submit";

const App = () => {
  const [aiTools, setAiTools] = useState(() => {
    const savedTools = localStorage.getItem("aiTools");
    return savedTools ? JSON.parse(savedTools) : [
      { name: "ChatGPT", category: "Chatbot", price: "Free", link: "https://chat.openai.com", description: "AI chatbot.", image: "https://via.placeholder.com/100" },
      { name: "Stable Diffusion", category: "Image Generation", price: "Free", link: "https://stablediffusionweb.com", description: "Image generation AI.", image: "https://via.placeholder.com/100" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("aiTools", JSON.stringify(aiTools));
  }, [aiTools]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/aitools" element={<AITools aiTools={aiTools} setAiTools={setAiTools} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/submit" element={<Submit aiTools={aiTools} setAiTools={setAiTools} />} />
      </Routes>
    </Router>
  );
};

export default App;
