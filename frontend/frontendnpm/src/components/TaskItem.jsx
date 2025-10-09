export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
    const deadline = task.deadline ? new Date(task.deadline).toLocaleDateString() : "—";

    return (
        <div
            className={`task-card transition-all duration-300 ${
                task.completed ? "bg-green-200 border-green-500 shadow-lg" : ""
            }`}
        >
            <div className="flex-1">
                <h3
                    className={`text-lg font-semibold ${
                        task.completed ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                >
                    {task.title}
                </h3>
                {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                <p className="text-xs text-gray-400 mt-2">⏰ {deadline}</p>
            </div>

            <div className="flex items-center gap-2">
                {/* Checkbox */}
                <label className="relative cursor-pointer w-6 h-6">
                    <input
                        type="checkbox"
                        checked={!!task.completed}
                        onChange={() => onToggle(task)}
                        className="absolute w-6 h-6 opacity-0 cursor-pointer"
                    />
                    <span
                        className={`absolute inset-0 rounded-md border-2 flex items-center justify-center transition-all duration-300
              ${
                            task.completed
                                ? "bg-green-500 border-green-600 scale-110 animate-bounce-check"
                                : "bg-white border-gray-300"
                        }`}
                    >
            {task.completed && (
                <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )}
          </span>
                </label>

                {/* Edit */}
                <button
                    onClick={() => onEdit(task)}
                    className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    title="Редактировать"
                >
                    ✏️
                </button>

                {/* Delete */}
                <button
                    onClick={() => onDelete(task.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    title="Удалить"
                >
                    🗑
                </button>
            </div>
        </div>
    );
}
