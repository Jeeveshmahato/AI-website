import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Base_Url } from "./const";
import { sanitizeUrl, sanitizeImageSrc } from "../utils/sanitize";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const [aiTools, setAiTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  // Debounce search input
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  // Fetch AI tools from API with retry for mobile networks + localStorage cache
  useEffect(() => {
    const controller = new AbortController();
    const CACHE_KEY = "aitools_cache";
    const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

    const getCachedTools = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL && Array.isArray(data)) {
          return data;
        }
      } catch {
        // ignore corrupted cache
      }
      return null;
    };

    const setCachedTools = (data) => {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      } catch {
        // ignore storage full
      }
    };

    const fetchWithTimeout = (url, options, timeoutMs = 15000) => {
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      return fetch(url, options).finally(() => clearTimeout(timeoutId));
    };

    const fetchTools = async (retries = 3) => {
      try {
        setLoading(true);
        setError(null);
        if (!Base_Url) {
          throw new Error("API URL not configured");
        }
        const response = await fetchWithTimeout(
          `${Base_Url}/api/aitools`,
          {
            signal: controller.signal,
            headers: { Accept: "application/json" },
            mode: "cors",
          },
          15000
        );
        if (!response.ok) {
          throw new Error(`Failed to load tools (${response.status})`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }
        setAiTools(data);
        setCachedTools(data);
      } catch (err) {
        if (err.name === "AbortError" && retries > 0) {
          // Timeout - retry with longer wait (server may be cold-starting)
          await new Promise((r) => setTimeout(r, 3000));
          return fetchTools(retries - 1);
        }
        if (err.name === "AbortError") return;
        if (retries > 0 && (err.message === "Failed to fetch" || err.name === "TypeError")) {
          await new Promise((r) => setTimeout(r, 3000));
          return fetchTools(retries - 1);
        }
        // Fall back to cached data on network failure
        const cached = getCachedTools();
        if (cached) {
          setAiTools(cached);
          return;
        }
        console.error("Error fetching tools:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Show cached data immediately while fetching fresh data
    const cached = getCachedTools();
    if (cached) {
      setAiTools(cached);
      setLoading(false);
    }

    fetchTools();
    return () => controller.abort();
  }, []);

  const filteredTools = useMemo(() => {
    const search = debouncedSearch.toLowerCase();
    return aiTools.filter((tool) => {
      const matchesSearch =
        !search ||
        (tool.name && tool.name.toLowerCase().includes(search)) ||
        (tool.category && tool.category.toLowerCase().includes(search));
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;
      const matchesPrice =
        selectedPrice === "All" || tool.price === selectedPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [aiTools, debouncedSearch, selectedCategory, selectedPrice]);

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
        type="search"
        placeholder="Search AI Tools..."
        value={searchTerm}
        className="border p-3 w-full max-w-md mt-6 rounded-lg bg-gray-700 text-white text-center mx-auto block focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
        onChange={handleSearchChange}
      />

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-2 rounded-lg text-sm sm:text-base text-white font-semibold shadow-md min-h-[44px] ${
              selectedCategory === category
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600 active:bg-gray-500"
            } transition-colors`}
          >
            {category}
          </button>
        ))}
        {prices.map((price) => (
          <button
            key={price}
            onClick={() => setSelectedPrice(price)}
            className={`px-3 py-2 rounded-lg text-sm sm:text-base text-white font-semibold shadow-md min-h-[44px] ${
              selectedPrice === price
                ? "bg-green-500"
                : "bg-gray-700 hover:bg-gray-600 active:bg-gray-500"
            } transition-colors`}
          >
            {price}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center mt-16">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center mt-16 px-4">
          <p className="text-red-400 text-lg mb-2">Failed to load tools</p>
          <p className="text-gray-400 text-sm mb-4">
            The server may be starting up. Please wait a moment and try again.
          </p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              const retryController = new AbortController();
              fetch(`${Base_Url}/api/aitools`, {
                signal: retryController.signal,
                headers: { Accept: "application/json" },
                mode: "cors",
              })
                .then((res) => res.json())
                .then((data) => {
                  if (Array.isArray(data)) setAiTools(data);
                })
                .catch(() => setError("Still unable to load. Please try again later."))
                .finally(() => setLoading(false));
            }}
            className="px-6 py-3 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition-colors min-h-[44px]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTools.length === 0 && (
        <p className="text-center text-gray-400 mt-16 text-lg">
          No tools found matching your search.
        </p>
      )}

      {/* AI Tools Listing */}
      {!loading && !error && filteredTools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
          {filteredTools.map((tool) => (
            <motion.div
              key={tool._id || tool.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border border-gray-700 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all"
              onClick={() =>
                setExpandedCard(expandedCard === tool._id ? null : tool._id)
              }
            >
              <img
                src={sanitizeImageSrc(tool.image) || "https://via.placeholder.com/100"}
                alt={tool.name || "AI Tool"}
                loading="lazy"
                className="mx-auto mb-3 w-20 h-20 sm:max-w-32 sm:max-h-32 p-2 sm:p-4 bg-white rounded-lg shadow-md object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100";
                }}
              />
              <h2 className="text-base sm:text-lg font-semibold text-center">
                {tool.name}
              </h2>
              <p
                className={`text-sm font-semibold text-center mt-2 ${
                  tool.price === "Free" ? "text-green-400" : "text-red-400"
                }`}
              >
                {tool.price}
              </p>
              <a
                href={sanitizeUrl(tool.link)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-500 text-center block mt-2 text-sm sm:text-base hover:underline"
              >
                Visit Site
              </a>

              {expandedCard === tool._id && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-gray-300 text-center text-sm sm:text-base"
                >
                  {tool.description}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AITools;
