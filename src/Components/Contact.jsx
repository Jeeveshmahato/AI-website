import { motion } from "framer-motion";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {/* Contact Header Animation */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </motion.div>

      {/* Contact Form */}
      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <input type="text" placeholder="Your Name" className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white" />
        <input type="email" placeholder="Your Email" className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white" />
        <textarea placeholder="Your Message" className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white"></textarea>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-green-500 p-3 rounded-lg text-white font-semibold shadow-lg hover:bg-green-600 transition-all"
        >
          Send Message
        </motion.button>
      </motion.form>

      {/* Social Links */}
      <div className="mt-12 flex gap-6">
        {[
          { name: "LinkedIn", link: "https://linkedin.com" },
          { name: "Twitter", link: "https://twitter.com" },
          { name: "GitHub", link: "https://github.com" },
        ].map((social, index) => (
          <motion.a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            className="text-lg font-semibold text-blue-400 hover:text-blue-500 transition-all"
          >
            {social.name}
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
