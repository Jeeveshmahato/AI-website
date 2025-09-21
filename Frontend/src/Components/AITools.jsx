import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Base_Url } from "./const";

const categories = [
  "All",
  "Chatbot",
  "Image Generation",
  "Code Assistance",
  "Translation",
  "Writing Assistant",
];
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
        const response = await fetch(import.meta.env.VITE_BASEURL+ "/api/aitools");
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

    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;
    const matchesPrice =
      selectedPrice === "All" || tool.price === selectedPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-4 sm:p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl sm:text-4xl font-extrabold text-center"
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
        className="border p-2 sm:p-3 w-40 sm:w-64 mt-6 rounded-lg bg-gray-700 text-white text-center mx-auto block focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-lg"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2 sm:gap-3 justify-center">
        {categories.map((category) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-base text-white font-semibold shadow-md ${
              selectedCategory === category
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
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
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-base text-white font-semibold shadow-md ${
              selectedPrice === price
                ? "bg-green-500"
                : "bg-gray-700 hover:bg-gray-600"
            } transition-all`}
          >
            {price}
          </motion.button>
        ))}
      </div>

      {/* AI Tools Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
        {filteredTools.map((tool, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="border bg-gray-800 p-3 sm:p-6 rounded-lg shadow-xl cursor-pointer transform hover:scale-105 transition-all hover:shadow-lg"
            onClick={() =>
              setExpandedCard(expandedCard === index ? null : index)
            }
          >
            <img
              src={tool.image}
              alt={tool.name}
              className="mx-auto mb-2 sm:mb-4 w-20 h-20 sm:max-w-32 sm:max-h-32 p-2 sm:p-4 bg-white rounded-lg shadow-md"
            />
            <h2 className="text-base sm:text-lg font-semibold text-center">{tool.name}</h2>
            <p
              className={`text-xs sm:text-sm font-semibold text-center mt-2 ${
                tool.price === "Free" ? "text-green-400" : "text-red-400"
              }`}
            >
              {tool.price}
            </p>
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-center block mt-2 text-xs sm:text-base"
            >
              Visit Site
            </a>

            {/* Animated Description Reveal */}
            {expandedCard === index && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 text-gray-300 text-center text-xs sm:text-base"
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
