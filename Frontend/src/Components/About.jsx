import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
          About AI Tools Hub
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl mx-auto">
          Your gateway to the latest and most innovative AI-powered solutions.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-16 text-center max-w-2xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold">Our Mission</h2>
        <p className="mt-4 text-gray-300">
          To connect users with the most advanced AI tools, optimizing their workflow and creativity.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl">
        {[
          { title: "Curated AI Solutions", desc: "Find only the best AI tools tailored for your needs." },
          { title: "Seamless Experience", desc: "Smart filtering and intuitive UI for effortless navigation." },
          { title: "Cutting-Edge Tech", desc: "Stay ahead with the latest AI innovations." },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
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

export default About;
