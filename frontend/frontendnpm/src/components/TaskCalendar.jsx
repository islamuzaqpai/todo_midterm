import React from "react";

export default function TasksCalendar({ tasks, selectedDate, onSelectDate }) {
    const daysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const days = daysInMonth(currentYear, currentMonth);

    const hasTasksOnDay = (day) => {
        return tasks.some(
            (task) =>
                task.deadline &&
                new Date(task.deadline).toDateString() === day.toDateString()
        );
    };

    return (
        <div className="flex flex-col gap-2 mb-6">
            {/* Сетка дней */}
            <div className="flex gap-2 overflow-x-auto py-2 px-1">
                {days.map((day) => {
                    const isSelected = day.toDateString() === selectedDate.toDateString();
                    const hasTasks = hasTasksOnDay(day);

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onSelectDate(day)}
                            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
                                ${isSelected
                                ? "bg-blue-500 text-white"
                                : hasTasks
                                    ? "bg-blue-200 text-gray-800"
                                    : "bg-gray-100 text-gray-500"}
                                hover:scale-105`}
                        >
                            <span className="font-semibold">
                                {day.toLocaleDateString("en-US", { weekday: "short" })}
                            </span>
                            <span className="text-sm">{day.getDate()}</span>
                            {hasTasks && (
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-1"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
