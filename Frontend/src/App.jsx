import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ErrorBoundary from "./Components/ErrorBoundary";
import { ToastProvider } from "./Components/Toast";
import Home from "./pages/Home";

// Home is eager (it's the landing page); everything else is code-split.
const Directory = lazy(() => import("./pages/Directory"));
const ToolDetail = lazy(() => import("./pages/ToolDetail"));
const Categories = lazy(() => import("./pages/Categories"));
const Submit = lazy(() => import("./pages/Submit"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
    <div className="size-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
  </div>
);

// Scroll to top on navigation, except when only the query string changes (filters).
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <ErrorBoundary>
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-indigo-500 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main id="main" className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/aitools" element={<Directory key="all" />} />
                  <Route path="/saved" element={<Directory key="saved" savedOnly />} />
                  <Route path="/tools/:slug" element={<ToolDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/submit" element={<Submit />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </MotionConfig>
  </ErrorBoundary>
);

export default App;
