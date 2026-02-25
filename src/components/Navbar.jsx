export default function Navbar({ darkMode, toggleDarkMode }) {
    return (
        <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Video Generator
                </h1>
                <button
                    onClick={toggleDarkMode}
                    className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600
                                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {darkMode ? "☀️ Light" : "🌙 Dark"}
                 </button>
            </div>
        </nav>
    );
}