import { Link } from "react-router-dom";
import Seo from "../Components/Seo";

const NotFound = () => (
  <div className="container-page flex min-h-[60vh] max-w-xl flex-col items-start justify-center pt-16">
    <Seo title="Page not found" noindex />
    <p className="font-mono text-sm text-fg-subtle">404</p>
    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg">This page doesn't exist</h1>
    <p className="mt-3 text-fg-muted">The link may be broken, or the tool may have been removed from the directory.</p>
    <div className="mt-8 flex gap-2">
      <Link to="/aitools" className="btn-primary">
        Browse tools
      </Link>
      <Link to="/" className="btn-secondary">
        Go home
      </Link>
    </div>
  </div>
);

export default NotFound;
