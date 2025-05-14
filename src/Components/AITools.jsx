import { useState } from "react";

const categories = ["All", "Chatbot", "Image Generation", "Code Assistance"];
const aiTools = [
  {
    name: "ChatGPT",
    image: "https://play-lh.googleusercontent.com/lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A=w480-h960-rw",
    link: "https://chat.openai.com",
    category: "Chatbot",
  },
  {
    name: "Microsoft Copilot",
    image: "https://play-lh.googleusercontent.com/p8R1lAZI5_WCOzmvBYnOQasCWcjc9d2vM7z4PaVku8b9AfxGhqQqM0ldJ8KULHblVj-g=w480-h960-rw",
    link: "https://copilot.microsoft.com",
    category: "Code Assistance",
  },
  {
    name: "Stable Diffusion",
    image: "https://play-lh.googleusercontent.com/y6s2JZNmdvbfXhqe-lmicCb3vkJhe34mPNp2JIk2VNH_Y_t5TKsifxAH3-Gq5oDfIA=w480-h960-rw",
    link: "https://stablediffusionweb.com",
    category: "Image Generation",
  },
  {
    name: "Midjourney",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV0-rwNymX0X_oHvghLATckTDDorUgbla2EoKInOTY7Oe8vfnF4tgndtQM9FO5Cu63Clw&usqp=CAU",
    link: "https://www.midjourney.com",
    category: "Image Generation",
  },
  {
    name: "OpenAI Codex",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7qDr_Oprxb8E2EwKCZlVtoo5j4XL_Jn_-ouw4YiDibmSErrxwLVxkn4ObS4fgCoC0B6c&usqp=CAU",
    link: "https://openai.com/research/codex",
    category: "Code Assistance",
  },
];
const AITools = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

      {/* Category Filter */}
      <div className="mt-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 m-2 rounded ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } transition-transform transform hover:scale-105`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* AI Tools Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {filteredTools.map((tool, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md">
            <img
              src={tool.image}
              alt={tool.name}
              className="mx-auto mb-2 w-24 h-24 rounded"
            />
            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <p className="text-sm text-gray-500">{tool.category}</p>
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Visit Site
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITools;
