import axiosInstance from "../api/axiosInstance.ts";

export const fetchTaskSummary = async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date(todayStr);

    // 🔹 Получаем ВСЕ задачи текущего пользователя
    const res = await axiosInstance.get("/tasks/my");
    const tasks = res.data;

    // 🔸 Группируем по статусу
    const done = tasks.filter(task => task.status === "DONE");
    const inProgress = tasks.filter(task => task.status === "IN_PROGRESS");
    const todo = tasks.filter(task => task.status === "TODO");

    // 🔸 Просроченные задачи
    const overdue = tasks.filter(task =>
        (task.status === "TODO" || task.status === "IN_PROGRESS") &&
        new Date(task.deadline) < today
    );

    // 🔸 Ближайшие по сроку (макс 3)
    const nearest = tasks
        .filter(task => new Date(task.deadline) >= today)
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 3);

    return {
        total: tasks.length,
        done: done.length,
        inProgress: inProgress.length,
        todo: todo.length,
        overdue,
        nearest,
    };
};

export const fetchWeeklyStats = async (userId: string) => {
    const response = await axiosInstance.get("/tasks/stats/weekly", {
        params: { userId }
    });
    return response.data;
};

