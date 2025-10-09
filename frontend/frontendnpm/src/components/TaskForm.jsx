import { useState, useEffect } from "react";

function toInputDate(value) {
    if (!value) return "";
    // Если приходит ISO (2025-10-11T00:00:00Z) — берем YYYY-MM-DD
    if (typeof value === "string" && value.includes("T")) return value.slice(0, 10);
    return value; // уже YYYY-MM-DD
}

export default function TaskForm({ onAdd, onUpdate, editingTask, onCancel }) {
    const [form, setForm] = useState({ title: "", description: "", deadline: "" });

    useEffect(() => {
        if (editingTask) {
            setForm({
                title: editingTask.title || "",
                description: editingTask.description || "",
                deadline: toInputDate(editingTask.deadline) || "",
            });
        } else {
            setForm({ title: "", description: "", deadline: "" });
        }
    }, [editingTask]);

    const formatForBackend = (dateStr) => {
        if (!dateStr) return null;
        // преобразуем YYYY-MM-DD -> ISO
        const d = new Date(dateStr);
        return d.toISOString();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;

        const payload = {
            title: form.title,
            description: form.description || "",
            deadline: form.deadline ? formatForBackend(form.deadline) : null,
            // не трогаем completed здесь — бэк сам оставит либо default либо текущее значение
        };

        if (editingTask) {
            onUpdate({ ...editingTask, ...payload });
        } else {
            onAdd(payload);
        }

        // сбрасываем/закрываем форму только если не в режиме редактирования
        if (!editingTask) {
            setForm({ title: "", description: "", deadline: "" });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg mx-auto bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-4 transition-all"
        >
            <h2 className="text-lg font-semibold text-gray-800 text-center">
                {editingTask ? "Редактирование задачи" : "Добавить задачу"}
            </h2>

            <input
                type="text"
                placeholder="Заголовок"
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
                placeholder="Описание"
                rows="3"
                className="input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
                type="date"
                className="input"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />

            <div className="flex gap-3 mt-2">
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                >
                    {editingTask ? "Обновить" : "➕ Добавить"}
                </button>

                {editingTask && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary w-1/3"
                    >
                        Отмена
                    </button>
                )}
            </div>
        </form>
    );
}
