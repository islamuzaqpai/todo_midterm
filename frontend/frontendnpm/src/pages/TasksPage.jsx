import { useState, useEffect, useRef } from "react";
import TaskList from "../components/TaskList";
import TasksCalendar from "../components/TaskCalendar.jsx";
import ConfirmModal from "../components/modal/ConfirmModal.jsx";
import MonthPickerModal from "../components/modal/MothPickerModal.jsx";
import TaskFormModal from "../components/modal/TaskFormModal.jsx";
import {
    getTasks as fetchTasks,
    addTask as createTask,
    updateTask as modifyTask,
    deleteTask as removeTask,
    toggleTaskCompleted,
} from "../api/tasks.js";

export default function TaskPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const topRef = useRef(null);

    // --- Модалки ---
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [monthModalOpen, setMonthModalOpen] = useState(false);

    const formatDateForBackend = (date) => (date ? new Date(date).toISOString() : null);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await fetchTasks();
            setTasks(data);
        } catch (err) {
            console.error("Ошибка загрузки задач:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleAddTask = async (task) => {
        try {
            const payload = { ...task, deadline: formatDateForBackend(task.deadline) };
            await createTask(payload);
            await loadTasks();
            setShowForm(false);
        } catch (err) {
            console.error("Ошибка добавления:", err);
        }
    };

    const handleUpdateTask = async (task) => {
        try {
            const payload = { ...task, deadline: formatDateForBackend(task.deadline) };
            await modifyTask(task.id, payload);
            await loadTasks();
            setEditingTask(null);
            setShowForm(false);
        } catch (err) {
            console.error("Ошибка обновления:", err);
        }
    };

    const confirmDeleteTask = (task) => {
        setTaskToDelete(task);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await removeTask(taskToDelete.id);
            setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
        } catch (err) {
            console.error("Ошибка удаления:", err);
        } finally {
            setDeleteModalOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleToggleTask = async (task) => {
        const updated = { ...task, completed: !task.completed };
        setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
        try {
            await toggleTaskCompleted(task);
        } catch (err) {
            console.error("Ошибка переключения completed:", err);
            setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowForm(true);
        setTimeout(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    };

    const tasksForSelectedDate = tasks.filter(task => {
        if (!task.deadline) return false;
        const taskDate = new Date(task.deadline);
        return taskDate.toDateString() === selectedDate.toDateString();
    });

    return (
        <div
            ref={topRef}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10 px-6"
        >
            <div className="max-w-5xl w-full bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
                        Today’s Tasks
                    </h1>

                    {/* Кнопка выбора месяца по центру */}
                    <div className="flex justify-center w-full sm:w-auto">
                        <button
                            onClick={() => setMonthModalOpen(true)}
                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg shadow-sm transition font-semibold"
                        >
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </button>
                    </div>

                    {/* Кнопка добавления новой задачи */}
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditingTask(null);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md"
                    >
                        ➕ Новая задача
                    </button>
                </header>

                {/* Календарь */}
                <TasksCalendar
                    tasks={tasks}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    currentMonth={currentMonth}
                />

                {/* Список задач */}
                {loading ? (
                    <p className="text-center text-gray-500 mt-6 animate-pulse">
                        ⏳ Загружаем задачи...
                    </p>
                ) : (
                    <TaskList
                        tasks={tasksForSelectedDate}
                        onToggle={handleToggleTask}
                        onDelete={confirmDeleteTask}
                        onEdit={handleEdit}
                    />
                )}

                {/* Модалки */}
                <ConfirmModal
                    isOpen={deleteModalOpen}
                    title="Удаление задачи"
                    message={`Вы уверены, что хотите удалить "${taskToDelete?.title}"?`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteModalOpen(false)}
                />

                <MonthPickerModal
                    isOpen={monthModalOpen}
                    selectedMonth={currentMonth}
                    onSelectMonth={(month) => {
                        setCurrentMonth(month);
                        setMonthModalOpen(false);
                        setSelectedDate(new Date(month.getFullYear(), month.getMonth(), 1));
                    }}
                    onCancel={() => setMonthModalOpen(false)}
                />

                <TaskFormModal
                    isOpen={showForm}
                    onClose={() => setShowForm(false)}
                    onAdd={handleAddTask}
                    onUpdate={handleUpdateTask}
                    editingTask={editingTask}
                />
            </div>
        </div>
    );
}
