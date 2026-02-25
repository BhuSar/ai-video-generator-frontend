import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import PromptForm from "./components/PromptForm";
import VideoCard from "./components/VideoCard";
import useDarkMode from "./hooks/useDarkMode";

export default function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  // Load saved videos safely on first load
  useEffect(() => {
    const savedVideos = localStorage.getItem("generatedVideos");
    if (!savedVideos) return;

    try {
      const parsed = JSON.parse(savedVideos);
      setGeneratedVideos(parsed);
      if (parsed.length > 0) {
        setActiveVideo(parsed[0]);
      }
    } catch {
      console.warn("Corrupted localStorage detected. Clearing videos.");
      localStorage.removeItem("generatedVideos");
    }
  }, []);

  // Save videos whenever they change
  useEffect(() => {
    localStorage.setItem(
      "generatedVideos",
      JSON.stringify(generatedVideos)
    );
  }, [generatedVideos]);

  // Real Generate (Backend Connected)
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation failed");
      }

      const newVideo = {
        id: data.id, 
        prompt, 
        status: "Completed", 
        videoUrl: data.videoUrl,
        createdAt: new Date().toLocaleTimeString(),
      };

      setGeneratedVideos((prev) => [newVideo, ...prev]);
      setActiveVideo(newVideo);
      setPrompt("");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download video
  const handleDownload = () => {
    if (!activeVideo?.videoUrl || isGenerating) return;

    const link = document.createElement("a");
    link.href = activeVideo.videoUrl;
    link.download = `ai-video-${activeVideo.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete video
  const handleDeleteVideo = (id) => {
    setGeneratedVideos((prev) =>
      prev.filter((video) => video.id !== id)
    );

    if (activeVideo?.id === id) {
      setActiveVideo(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200 space-y-8">
        {/* Main video preview */}
        {activeVideo ? (
          <div className="space-y-3">
            <video
              key={activeVideo.id}
              src={activeVideo.videoUrl}
              controls
              autoPlay
              className="w-full rounded-xl shadow-lg"
            />

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Prompt: {activeVideo.prompt}
            </p>

            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download video
              </button>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-400 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400">
            Generate a video to preview it here
          </div>
        )}

        {/* Prompt input */}
        <PromptForm
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Video gallery */}
        {generatedVideos.length > 0 ? (
          <section>
            <h3 className="text-lg font-semibold mb-4">
              Generated videos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onDelete={handleDeleteVideo}
                  onSelect={() => setActiveVideo(video)}
                />
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