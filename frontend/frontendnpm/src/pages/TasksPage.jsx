import { useState, useEffect, useRef } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const API_URL = "http://localhost:8080/task";

export default function TaskPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const topRef = useRef(null);

    const formatDateForBackend = (date) => (date ? new Date(date).toISOString() : null);

    const getTasks = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Ошибка загрузки задач");
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    const addTask = async (task) => {
        try {
            const payload = { ...task, deadline: formatDateForBackend(task.deadline) };
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            await getTasks();
            setShowForm(false);
        } catch (err) {
            console.error("Ошибка добавления:", err);
        }
    };

    const updateTask = async (task) => {
        try {
            const payload = { ...task, deadline: formatDateForBackend(task.deadline) };
            await fetch(`${API_URL}/${task.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            await getTasks();
            setEditingTask(null);
            setShowForm(false);
        } catch (err) {
            console.error("Ошибка обновления:", err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.error("Ошибка удаления:", err);
        }
    };

    const toggleTask = async (task) => {
        const updatedTask = { ...task, completed: !task.completed };

        setTasks((prev) => prev.map((t) => (
            t.id === task.id ? updatedTask : t)));

        try {
            await fetch(`${API_URL}/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: updatedTask.completed }),
            });
        } catch (err) {
            console.error("Ошибка переключения completed:", err);
            setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowForm(true);
        setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    };

    return (
        <div
            ref={topRef}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10 px-6"
        >
            <div className="max-w-5xl w-full bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
                        Today’s Tasks
                    </h1>
                    <button
                        onClick={() => {
                            setShowForm((s) => !s);
                            setEditingTask(null);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md"
                    >
                        {showForm ? "Закрыть" : "➕ Новая задача"}
                    </button>
                </header>

                {showForm && (
                    <div className="mb-8 animate-fadeIn">
                        <TaskForm
                            onAdd={addTask}
                            onUpdate={updateTask}
                            editingTask={editingTask}
                            onCancel={() => {
                                setEditingTask(null);
                                setShowForm(false);
                            }}
                        />
                    </div>
                )}

                {loading ? (
                    <p className="text-center text-gray-500 mt-6 animate-pulse">⏳ Загружаем задачи...</p>
                ) : (
                    <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={handleEdit} />
                )}
            </div>
        </div>
    );
}
