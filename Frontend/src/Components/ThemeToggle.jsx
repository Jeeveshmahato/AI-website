import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../lib/theme";

// Toggles light/dark. The initial state follows the OS until the user picks one.
const ThemeToggle = ({ className = "" }) => {
  const { resolved, setTheme } = useTheme();
  const next = resolved === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={`icon-btn size-9 ${className}`}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {resolved === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
    </button>
  );
};

export default ThemeToggle;
