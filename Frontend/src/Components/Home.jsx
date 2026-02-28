import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
          Discover the Power of AI
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl mx-auto">
          Explore top AI tools and enhance productivity like never before.
        </p>
        <Link to="/aitools">
          <button className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-colors min-h-[44px]">
            Get Started
          </button>
        </Link>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl">
        {[
          { title: "Smart Chatbots", desc: "AI-powered conversations that feel natural." },
          { title: "Creative Generators", desc: "Generate images, text, and code seamlessly." },
          { title: "Automation Tools", desc: "Streamline tasks and optimize workflows." },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">{feature.title}</h2>
            <p className="mt-2 text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
