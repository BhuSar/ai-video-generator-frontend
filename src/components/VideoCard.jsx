export default function VideoCard({ video, onDelete, onSelect}) {
  return (
    <div
      onClick={onSelect}
      className="group relative cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition"
    >
      {/* Thumbnail */}
      <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-xl text-gray-500">
        🎬 Video Preview
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <p className="text-sm font-medium line-clamp-2">
          {video.prompt}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{video.createdAt}</span>
          <span className="text-green-600 dark:text-green-400">
            {video.status}
          </span>
        </div>
      </div>

      {/* Delete Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(video.id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
        aria-label="Delete video"
        >
          ✕
        </button>
    </div>
  );
}