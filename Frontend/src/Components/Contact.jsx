import { motion } from "framer-motion";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement contact form submission
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl mx-auto">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Your Name"
          required
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white min-h-[44px]"
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white min-h-[44px]"
        />
        <textarea
          placeholder="Your Message"
          required
          rows={4}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-white resize-y"
        />
        <button
          type="submit"
          className="w-full bg-green-500 p-3 rounded-lg text-white font-semibold shadow-lg hover:bg-green-600 active:bg-green-700 transition-colors min-h-[44px]"
        >
          Send Message
        </button>
      </motion.form>

      <div className="mt-12 flex gap-6">
        {[
          { name: "LinkedIn", link: "https://linkedin.com" },
          { name: "Twitter", link: "https://twitter.com" },
          { name: "GitHub", link: "https://github.com" },
        ].map((social) => (
          <a
            key={social.name}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base sm:text-lg font-semibold text-blue-400 hover:text-blue-500 transition-colors min-h-[44px] flex items-center"
          >
            {social.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
