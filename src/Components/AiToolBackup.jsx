import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  "All",
  "Chatbot",
  "Image Generation",
  "Code Assistance",
  "Translation",
  "Writing Assistant",
];
const prices = ["All", "Free", "Paid"];

const AIToolsBackup = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const aiToolsBackup = [
    {
      name: "ChatGPT",
      image:
        "https://play-lh.googleusercontent.com/lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A=w480-h960-rw",
      link: "https://chat.openai.com",
      category: "Chatbot",
      price: "Free",
      description:
        "A powerful AI chatbot by OpenAI for conversations and tasks.",
    },
    {
      name: "Microsoft Copilot",
      image:
        "https://play-lh.googleusercontent.com/p8R1lAZI5_WCOzmvBYnOQasCWcjc9d2vM7z4PaVku8b9AfxGhqQqM0ldJ8KULHblVj-g=w480-h960-rw",
      link: "https://copilot.microsoft.com",
      category: "Code Assistance",
      price: "Paid",
      description: "An AI coding assistant that boosts productivity.",
    },
    {
      name: "Stable Diffusion",
      image:
        "https://play-lh.googleusercontent.com/y6s2JZNmdvbfXhqe-lmicCb3vkJhe34mPNp2JIk2VNH_Y_t5TKsifxAH3-Gq5oDfIA=w480-h960-rw",
      link: "https://stablediffusionweb.com",
      category: "Image Generation",
      price: "Free",
      description: "AI-powered image generation tool for creatives.",
    },
    {
      name: "Midjourney",
      image:
        "https://avatars.githubusercontent.com/u/61396273?s=200&v=4",
      link: "https://www.midjourney.com",
      category: "Image Generation",
      price: "Paid",
      description: "Generate high-quality images using AI-driven algorithms.",
    },
    {
      name: "OpenAI Codex",
      image: "https://miro.medium.com/v2/resize:fit:1100/format:webp/1*FiIDOSUteSdwzwk5CXmU2w.png",
      link: "https://openai.com/research/codex",
      category: "Code Assistance",
      price: "Free",
      description:
        "A powerful AI model that helps generate and understand code.",
    },
    {
      name: "Runway ML",
      image:
        "https://aianimation.com/wp-content/uploads/2024/01/runway-ml-logo.jpg",
      link: "https://runwayml.com",
      category: "Image Generation",
      price: "Paid",
      description: "AI-powered creative tools for video editing and design.",
    },
    {
      name: "DeepL Translator",
      image: "https://images-eds-ssl.xboxlive.com/image?url=4rt9.lXDC4H_93laV1_eHHFT949fUipzkiFOBH3fAiZZUCdYojwUyX2aTonS1aIwMrx6NUIsHfUHSLzjGJFxxnCzTIURlExTvn6vGrmhWYr6qq9Wyqf4yHAX5J05LTdObixKM1Rzi2UxtiHC.jApv6q6tMwTPL1Kz3Nur9RJDuw-&format=source",
      link: "https://www.deepl.com",
      category: "Translation",
      price: "Free",
      description:
        "A highly accurate AI-powered translator for multiple languages.",
    },
    {
      name: "Grammarly",
      image:
        "https://play-lh.googleusercontent.com/6Xe9DWiMC76daosOC80Im9gqe25Q9P55LxJIGPTLbcdFkMXOur4mk8jTVxoqOaiAvAG4",
      link: "https://www.grammarly.com",
      category: "Writing Assistant",
      price: "Paid",
      description:
        "AI-powered writing assistant to improve grammar and clarity.",
    },
  ];

  const filteredTools = aiToolsBackup.filter((tool) => {
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;
    const matchesPrice =
      selectedPrice === "All" || tool.price === selectedPrice;
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
        className="border p-3 w-64 mt-6 rounded-lg bg-gray-700 text-white text-center mx-auto block"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              selectedCategory === category ? "bg-blue-500 shadow-lg" : "bg-gray-700 hover:bg-gray-600"
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
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              selectedPrice === price ? "bg-green-500 shadow-lg" : "bg-gray-700 hover:bg-gray-600"
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
            className="border bg-gray-800 p-6 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setExpandedCard(expandedCard === index ? null : index)}
          >
            <img src={tool.image} alt={tool.name} className="mx-auto mb-4 w-32 h-32 rounded-lg shadow-md" />
            <h2 className="text-lg font-semibold text-center">{tool.name}</h2>
            <p className={`text-sm font-semibold text-center mt-2 ${
              tool.price === "Free" ? "text-green-400" : "text-red-400"
            }`}>
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

export default AIToolsBackup;
