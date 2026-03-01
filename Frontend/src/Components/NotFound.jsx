import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">404</h1>
      <p className="text-base sm:text-xl text-gray-400 mb-8 text-center px-4">Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition-colors min-h-[44px] flex items-center"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
