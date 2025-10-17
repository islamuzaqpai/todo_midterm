import React from "react";
import TaskForm from "../TaskForm";

export default function TaskFormModal({ isOpen, onClose, onAdd, onUpdate, editingTask }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-lg relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
                >
                    ✖
                </button>
                <TaskForm
                    onAdd={onAdd}
                    onUpdate={onUpdate}
                    editingTask={editingTask}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}
