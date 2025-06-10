import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const categories = ["All", "Chatbot", "Image Generation", "Code Assistance", "Translation", "Writing Assistant"];
const prices = ["All", "Free", "Paid"];

const AITools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const [aiTools, setAiTools] = useState([]);

  // Fetch AI tools from MongoDB on component mount
  useEffect(() => {
  const fetchTools = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/aitools");
      const data = await response.json();
      setAiTools(data);
    } catch (error) {
      console.error("Error fetching tools:", error);
    }
  };
  fetchTools();
}, []);

  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    const matchesPrice = selectedPrice === "All" || tool.price === selectedPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-center"
      >
        AI Tools Directory
      </motion.h1>

      {/* Search Bar */}
      <motion.input
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        type="text"
        placeholder="Search AI Tools..."
        className="border p-3 w-64 mt-6 rounded-lg bg-gray-700 text-white text-center mx-auto block focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md ${
              selectedCategory === category ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
            } transition-all`}
          >
            {category}
          </motion.button>
        ))}
        {prices.map((price) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            key={price}
            onClick={() => setSelectedPrice(price)}
            className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md ${
              selectedPrice === price ? "bg-green-500" : "bg-gray-700 hover:bg-gray-600"
            } transition-all`}
          >
            {price}
          </motion.button>
        ))}
      </div>

      {/* AI Tools Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {filteredTools.map((tool, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="border bg-gray-800 p-6 rounded-lg shadow-xl cursor-pointer transform hover:scale-105 transition-all hover:shadow-lg"
            onClick={() => setExpandedCard(expandedCard === index ? null : index)}
          >
            <img src={tool.image} alt={tool.name} className="mx-auto mb-4 w-32 h-32 rounded-lg shadow-md" />
            <h2 className="text-lg font-semibold text-center">{tool.name}</h2>
            <p className={`text-sm font-semibold text-center mt-2 ${tool.price === "Free" ? "text-green-400" : "text-red-400"}`}>
              {tool.price}
            </p>
            <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-center block mt-2">
              Visit Site
            </a>

            {/* Animated Description Reveal */}
            {expandedCard === index && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 text-gray-300 text-center"
              >
                {tool.description}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AITools;
