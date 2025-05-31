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

const AITools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const aiTools = [
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

  const filteredTools = aiTools.filter((tool) => {
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
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold">AI Tools</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search AI Tools..."
        className="border p-2 w-64 mt-4"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Category & Price Filters */}
      <div className="mt-4 flex gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 m-2 rounded ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
        {prices.map((price) => (
          <button
            key={price}
            onClick={() => setSelectedPrice(price)}
            className={`px-4 py-2 m-2 rounded ${
              selectedPrice === price
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {price}
          </button>
        ))}
      </div>

      {/* AI Tools Listing with Expandable Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {filteredTools.map((tool, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
            onClick={() =>
              setExpandedCard(expandedCard === index ? null : index)
            }
          >
            <img
              src={tool.image}
              alt={tool.name}
              className="mx-auto mb-2 w-24 h-24 rounded"
            />
            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <p
              className={`text-sm font-semibold ${
                tool.price === "Free" ? "text-green-500" : "text-red-500"
              }`}
            >
              {tool.price}
            </p>
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Visit Site
            </a>

            {/* Animated Description Reveal */}
            {expandedCard === index && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-2 text-gray-500"
              >
                {tool.description}
              </motion.p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITools;
