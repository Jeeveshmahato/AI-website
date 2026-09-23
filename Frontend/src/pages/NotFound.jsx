import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import Seo from "../Components/Seo";

const NotFound = () => (
  <div className="container-page flex min-h-[60vh] flex-col items-center justify-center pt-16 text-center">
    <Seo title="Page not found" noindex />
    <p className="text-gradient text-7xl font-extrabold sm:text-8xl">404</p>
    <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">We couldn't find that page</h1>
    <p className="mt-3 max-w-md text-slate-400">The link may be broken, or the tool may have been removed from the directory.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link to="/" className="btn-secondary">
        <FiArrowLeft aria-hidden="true" /> Back home
      </Link>
      <Link to="/aitools" className="btn-primary">
        <FiSearch aria-hidden="true" /> Browse tools
      </Link>
    </div>
  </div>
);

export default NotFound;
