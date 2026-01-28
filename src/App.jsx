import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PromptForm from "./components/PromptForm";
import VideoCard from "./components/VideoCard";
import useDarkMode from "./hooks/useDarkMode";

export default function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState([]);

  // Load saved videos on first load
  useEffect(() => {
    const savedVideos = localStorage.getItem("generatedVideos");
    if (savedVideos) {
      setGeneratedVideos(JSON.parse(savedVideos));
    }
  }, []);

  // Save videos whenever they change
  useEffect(() => {
    localStorage.setItem(
      "generatedVideos",
      JSON.stringify(generatedVideos)
    );
  }, [generatedVideos]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const newVideo = {
        id: Date.now(),
        prompt,
        status: "Completed",
        createdAt: new Date().toLocaleTimeString(),
      };

      setGeneratedVideos((prev) => [newVideo, ...prev]);
      setPrompt("");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200 space-y-8">
        <PromptForm
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {generatedVideos.length > 0 ? (
          <section>
            <h3 className="text-lg font-semibold mb-4">
              Generated Videos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>No videos generated yet.</p>
            <p className="text-sm mt-1">
              Enter a prompt above to create your first video.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}