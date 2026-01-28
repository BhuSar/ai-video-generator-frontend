export default function VideoCard({ video }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {/* Placeholder for generated video */}
                <span className="text-gray-500 dark:text-gray-300 text-sm">
                    Generated Video Preview
                </span>
            </div>    

            <div className="p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {video.prompt}
                </p>

                <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>{video.status}</span>
                    <span>{video.createdAt}</span>
                </div>
            </div>
        </div>
    );
}