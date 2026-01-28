export default function PromptForm({
    prompt, 
    setPrompt, 
    onGenerate, 
    isGenerating,
}) {
    const maxChars = 300;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                    {prompt.length}/{maxChars}
                </span>

               <button
                    onClick={onGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className={`px-4 py-2 rounded-md text-white font-medium
                        ${
                        isGenerating || !prompt.trim()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                    {isGenerating ? "Generating..." : "Generate Video"}
                </button>
            </div>
        </div>
    );
}