import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "./const";
import { isValidHttpUrl, sanitizeText, sanitizeImageSrc } from "../utils/sanitize";

const categories = [
  "Chatbot",
  "Image Generation",
  "Code Assistance",
  "Translation",
  "Writing Assistant",
];

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

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
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTool((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only PNG, JPEG, GIF, and WebP images are allowed." }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 2MB." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImagePreview(result);
      setNewTool((prev) => ({ ...prev, image: result }));
      setErrors((prev) => ({ ...prev, image: null }));
    };
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, image: "Failed to read file." }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrl = (e) => {
    const value = e.target.value;
    setNewTool((prev) => ({ ...prev, image: value }));
    const sanitized = sanitizeImageSrc(value);
    setImagePreview(sanitized || null);
    if (value && !sanitized) {
      setErrors((prev) => ({ ...prev, image: "Please enter a valid image URL (https)." }));
    } else {
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const name = sanitizeText(newTool.name);
    if (!name || name.length < 2) {
      newErrors.name = "Tool name is required (at least 2 characters).";
    }
    if (name.length > 100) {
      newErrors.name = "Tool name must be under 100 characters.";
    }
    if (!isValidHttpUrl(newTool.link)) {
      newErrors.link = "A valid website URL is required (https://...).";
    }
    if (!newTool.image) {
      newErrors.image = "An image is required (upload or paste URL).";
    } else if (!sanitizeImageSrc(newTool.image)) {
      newErrors.image = "Invalid image. Upload a file or enter a valid https URL.";
    }
    const desc = sanitizeText(newTool.description);
    if (desc.length > 2000) {
      newErrors.description = "Description must be under 2000 characters.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: sanitizeText(newTool.name),
        category: newTool.category,
        price: newTool.price,
        link: newTool.link.trim(),
        description: sanitizeText(newTool.description),
        image: newTool.image,
      };

      const response = await fetch(`${Base_Url}/api/aitools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submission failed (${response.status})`);
      }

      const addedTool = await response.json();
      setAiTools([...aiTools, addedTool]);
      navigate("/aitools");
    } catch (error) {
      console.error("Submit Error:", error);
      setErrors({ form: `Submission failed: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        Submit an AI Tool
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
        noValidate
      >
        {errors.form && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
            {errors.form}
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Tool Name *"
            value={newTool.name}
            onChange={handleChange}
            maxLength={100}
            className="w-full p-3 bg-gray-700 rounded-lg text-white text-base"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Category:</label>
          <select
            name="category"
            value={newTool.category}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded-lg text-white text-base"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Price:</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
              <input
                type="radio"
                name="price"
                value="Free"
                checked={newTool.price === "Free"}
                onChange={handleChange}
                className="accent-green-500 w-4 h-4"
              />
              Free
            </label>
            <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
              <input
                type="radio"
                name="price"
                value="Paid"
                checked={newTool.price === "Paid"}
                onChange={handleChange}
                className="accent-red-500 w-4 h-4"
              />
              Paid
            </label>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="url"
            name="link"
            placeholder="Website Link (https://...) *"
            value={newTool.link}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded-lg text-white text-base"
          />
          {errors.link && <p className="text-red-400 text-sm mt-1">{errors.link}</p>}
        </div>

        <div className="mb-4">
          <textarea
            name="description"
            placeholder="Description"
            value={newTool.description}
            onChange={handleChange}
            maxLength={2000}
            rows={3}
            className="w-full p-3 bg-gray-700 rounded-lg text-white resize-y"
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Upload Image: *</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleImageUpload}
            className="w-full text-gray-300 bg-gray-700 p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-600 file:text-white file:cursor-pointer"
          />
          <label className="block text-gray-300 mt-3 mb-1">Or Paste Image URL:</label>
          <input
            type="url"
            placeholder="https://example.com/image.png"
            onChange={handleImageUrl}
            className="w-full p-3 bg-gray-700 rounded-lg text-white text-base"
          />
          {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image}</p>}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 w-24 h-24 rounded-lg shadow-lg object-contain bg-white p-1"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-500 p-3 rounded-lg text-white font-semibold shadow-lg hover:bg-green-600 active:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          {submitting ? "Submitting..." : "Submit Tool"}
        </button>
      </form>
    </div>
  );
};

export default Submit;
