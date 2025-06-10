import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  "Chatbot",
  "Image Generation",
  "Code Assistance",
  "Translation",
  "Writing Assistant",
];

const Submit = ({ aiTools, setAiTools }) => {
  const [newTool, setNewTool] = useState({
    name: "",
    category: categories[0],
    price: "Free",
    link: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate(); // 🚀 Navigation Hook

  const handleChange = (e) => {
    setNewTool({ ...newTool, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Preview image
        setNewTool({ ...newTool, image: reader.result }); // Save image URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Image URL Paste
  const handleImageUrl = (e) => {
    setNewTool({ ...newTool, image: e.target.value });
    setImagePreview(e.target.value); // Preview image
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!newTool.name || !newTool.link || !newTool.image) return alert("Please fill all required fields!");

  try {
    const response = await fetch("http://localhost:5000/api/aitools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTool),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const addedTool = await response.json();
    setAiTools([...aiTools, addedTool]); // Update UI
    navigate("/aitools");
  } catch (error) {
    console.error("Submit Error:", error);
    alert(`Submission Failed: ${error.message}`);
  }
};
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        Submit an AI Tool
      </h1>

      {/* Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Tool Name"
          value={newTool.name}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white"
        />

        {/* Dropdown for Category Selection */}
        <div className="mb-4">
          <label className="block text-gray-300">Category:</label>
          <select
            name="category"
            value={newTool.category}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded-lg text-white"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Selection with Radio Buttons */}
        <div className="mb-4">
          <label className="block text-gray-300">Price:</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="price"
                value="Free"
                checked={newTool.price === "Free"}
                onChange={handleChange}
                className="accent-green-500"
              />
              Free
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="price"
                value="Paid"
                checked={newTool.price === "Paid"}
                onChange={handleChange}
                className="accent-red-500"
              />
              Paid
            </label>
          </div>
        </div>

        <input
          type="text"
          name="link"
          placeholder="Website Link"
          value={newTool.link}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newTool.description}
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white"
        ></textarea>

        {/* Image Upload & URL Input */}
        <div className="mb-4">
          <label className="block text-gray-300">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-gray-700 bg-white p-2 rounded-lg mt-2"
          />
          <label className="block text-gray-300 mt-4">
            Or Paste Image URL:
          </label>
          <input
            type="text"
            placeholder="Image URL"
            onChange={handleImageUrl}
            className="w-full p-3 mt-2 bg-gray-700 rounded-lg text-white"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-24 h-24 rounded-lg shadow-lg"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 p-3 rounded-lg text-white font-semibold shadow-lg hover:bg-green-600 transition-all"
        >
          Submit Tool
        </button>
      </form>
    </div>
  );
};

export default Submit;
