export default function PromptForm({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
}) {
  const maxChars = 300;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
      <h2 className="text-xl font-semibold mb-4">
        Describe your video
      </h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="A cinematic sunset over a futuristic city..."
        maxLength={maxChars}
        className="w-full h-32 p-3 rounded-md border border-gray-300
                   dark:border-gray-600 dark:bg-gray-900
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition"
      />

      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500">
          {prompt.length}/{maxChars}
        </span>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition-all
            ${
              isGenerating || !prompt.trim()
                ? "bg-gray-400 cursor-not-allowed opacity-80"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
            }`}
        >
          {isGenerating && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {isGenerating ? "Generating..." : "Generate Video"}
        </button>
      </div>
    </div>
  );
}