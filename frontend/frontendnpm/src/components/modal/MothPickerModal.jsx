import React from "react";

export default function MonthPickerModal({ isOpen, selectedMonth, onSelectMonth, onCancel }) {
    if (!isOpen) return null;

    const months = Array.from({ length: 12 }).map((_, i) => {
        const date = new Date(selectedMonth.getFullYear(), i, 1);
        return date;
    });

    const now = new Date();

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 max-w-full animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 text-center">Выберите месяц</h2>
                <div className="grid grid-cols-3 gap-3">
                    {months.map((month) => {
                        const isPast = month < new Date(now.getFullYear(), now.getMonth(), 1);
                        const isSelected =
                            month.getMonth() === selectedMonth.getMonth() &&
                            month.getFullYear() === selectedMonth.getFullYear();

                        return (
                            <button
                                key={month.getMonth()}
                                onClick={() => !isPast && onSelectMonth(month)}
                                className={`px-3 py-2 rounded-lg text-center transition-all
                                    ${isSelected ? "bg-blue-500 text-white font-semibold"
                                    : isPast ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-100 hover:bg-blue-100 text-gray-800"}`}
                            >
                                {month.toLocaleString("default", { month: "short" })}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}
