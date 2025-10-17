import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete, onEdit }) {
    if (!tasks.length) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <p className="italic text-lg">Нет задач 😴</p>
                <p className="text-sm text-gray-400">Добавь первую, чтобы начать!</p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-gray-200 bg-white rounded-2xl shadow-md overflow-hidden">
            {tasks.map((task) => (
                <li key={task.id} className="hover:bg-gray-50 transition-colors">
                    <TaskItem
                        task={task}
                        onToggle={onToggle}
                        onDelete={() => onDelete(task)}
                        onEdit={onEdit}
                    />
                </li>
            ))}
        </ul>
    );
}
