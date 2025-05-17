import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client, over } from "stompjs";
import axiosInstance from "../api/axiosInstance";

export interface Notification {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    read: boolean;
}

export const useNotifications = (userId: string | null) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!userId || userId === "null") {
            console.warn("🔕 userId отсутствует — подписка не инициализирована");
            return;
        }

        const fetchInitial = async () => {
            try {
                const res = await axiosInstance.get(`/notifications/${userId}`);
                setNotifications(res.data);
            } catch (err) {
                console.error("❌ Ошибка при загрузке уведомлений:", err);
            }
        };

        fetchInitial();

        // ✅ Use base URL from .env
        const socketUrl = `${import.meta.env.VITE_API_URL}/ws`.replace(/^http/, "ws");
        const socket = new SockJS(socketUrl);
        const client: Client = over(socket);
        let isConnected = false;

        client.connect({}, () => {
            isConnected = true;

            client.subscribe(`/topic/notifications/${userId}`, (message) => {
                const notif: Notification = JSON.parse(message.body);

                setNotifications((prev) => {
                    const alreadyExists = prev.some((n) => n.id === notif.id);
                    return alreadyExists ? prev : [notif, ...prev];
                });
            });
        });

        return () => {
            if (isConnected) {
                client.disconnect(() => console.log("🔌 WebSocket отключён"));
            }
        };
    }, [userId]);

    const markAsRead = async (id: string) => {
        try {
            await axiosInstance.put(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (error) {
            console.error("❌ Не удалось отметить уведомление как прочитанное", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosInstance.put(`/notifications/${userId}/mark-all-read`);
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (err) {
            console.error("❌ Ошибка при пометке всех как прочитанных:", err);
        }
    };

    return { notifications, markAsRead, markAllAsRead };
};
