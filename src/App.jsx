import Navbar from "./components/Navbar";
import useDarkMode from "./hooks/useDarkMode";

export default function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Navbar darkMode= {darkMode} toggleDarkMode={toggleDarkMode} />
       
      <main className="max-w-6xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200">
        <p className="text-lg">
          Day 2 complete. Navbar and dark mode are live.
        </p>
      </main>
    </div>
  );
}