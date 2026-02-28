import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import ErrorBoundary from "./Components/ErrorBoundary";

const Home = lazy(() => import("./Components/Home"));
const About = lazy(() => import("./Components/About"));
const AITools = lazy(() => import("./Components/AITools"));
const Contact = lazy(() => import("./Components/Contact"));
const Submit = lazy(() => import("./Components/Submit"));
const NotFound = lazy(() => import("./Components/NotFound"));

function safeGetLocalStorage(key) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

const Loading = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const [aiTools, setAiTools] = useState(() => {
    return safeGetLocalStorage("aiTools") || [
      { name: "ChatGPT", category: "Chatbot", price: "Free", link: "https://chat.openai.com", description: "AI chatbot.", image: "https://via.placeholder.com/100" },
      { name: "Stable Diffusion", category: "Image Generation", price: "Free", link: "https://stablediffusionweb.com", description: "Image generation AI.", image: "https://via.placeholder.com/100" }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("aiTools", JSON.stringify(aiTools));
    } catch {
      // localStorage full or unavailable — silently ignore
    }
  }, [aiTools]);

  return (
    <ErrorBoundary>
      <Router>
        <Navbar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/aitools" element={<AITools />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/submit" element={<Submit aiTools={aiTools} setAiTools={setAiTools} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
