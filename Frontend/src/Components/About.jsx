import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          About AI Tools Hub
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
          Your gateway to the latest and most innovative AI-powered solutions.
        </p>
      </motion.div>

      {/* Our Mission */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-16 text-center max-w-2xl"
      >
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="mt-4 text-gray-300">
          To connect users with the most advanced AI tools, optimizing their workflow and creativity.
        </p>
      </motion.div>

      {/* Why Choose Us */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {[
          { title: "Curated AI Solutions", desc: "Find only the best AI tools tailored for your needs." },
          { title: "Seamless Experience", desc: "Smart filtering and intuitive UI for effortless navigation." },
          { title: "Cutting-Edge Tech", desc: "Stay ahead with the latest AI innovations." },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.3 }}
            className="p-6 bg-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            <h2 className="text-xl font-semibold">{feature.title}</h2>
            <p className="mt-2 text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default About;
