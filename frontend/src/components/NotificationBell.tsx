// 📁 components/NotificationBell.tsx
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNotifications } from "../hooks/useNotifications";

export interface Notification {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    read: boolean;
}

const BellContainer = styled.div`
  position: relative;
`;

const BellButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover, &:focus {
    outline: none;
    opacity: 0.8;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #e53935;
  color: white;
  font-size: 0.7rem;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dropdown = styled.div<{ visible: boolean }>`
  position: absolute;
  right: 0;
  top: 2.2rem;
  width: 320px;
  max-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  z-index: 100;
  opacity: ${props => (props.visible ? "1" : "0")};
  transform: ${props => (props.visible ? "translateY(0)" : "translateY(-10px)")};
  visibility: ${props => (props.visible ? "visible" : "hidden")};
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
`;

const NotificationHeader = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ isRead: boolean }>`
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s ease;
  background-color: ${props => (props.isRead ? "white" : "#f0f7ff")};

  &:hover {
    background-color: #f9f9f9;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 4px;
`;

const Content = styled.div`
  font-size: 0.85rem;
  color: #555;
`;

const Time = styled.div`
  font-size: 0.75rem;
  color: #999;
  margin-top: 4px;
`;

const MarkAllButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 0.85rem;
  padding: 0.5rem;
  width: 100%;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }

  &:disabled {
    color: #aaa;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #666;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 400px;
  animation: ${fadeIn} 0.2s ease;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
`;

export const NotificationBell: React.FC = () => {
    const userId = localStorage.getItem("userId") || "";
    const { notifications = [], markAsRead, markAllAsRead } = useNotifications(userId);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;
    const hasNotifications = notifications.length > 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                bellRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !bellRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const formatTime = (timestamp: string): string => {
        try {
            return new Date(timestamp).toLocaleString("ru-RU", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return timestamp;
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        setSelectedNotification(notification);
    };

    const handleBellClick = () => {
        setIsOpen(prev => !prev);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    const closeModal = () => setSelectedNotification(null);

    return (
        <BellContainer>
            <BellButton
                ref={bellRef}
                onClick={handleBellClick}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                🔔
                {unreadCount > 0 && <Badge aria-hidden="true">{unreadCount}</Badge>}
            </BellButton>

            <Dropdown
                ref={dropdownRef}
                visible={isOpen}
                role="menu"
                aria-label="Notifications"
            >
                <NotificationHeader>
                    Уведомления
                    {hasNotifications && (
                        <MarkAllButton
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                            aria-label="Отметить все уведомления как прочитанные"
                        >
                            Отметить все
                        </MarkAllButton>
                    )}
                </NotificationHeader>

                {!hasNotifications ? (
                    <EmptyState>Нет уведомлений</EmptyState>
                ) : (
                    <NotificationList>
                        {notifications.map((notification, index) => (
                            <NotificationItem
                                key={notification.id || index} // 🔒 fallback на index, если id отсутствует
                                isRead={notification.read}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <Title>{notification.title}</Title>
                                <Content>{notification.content}</Content>
                                <Time>{formatTime(notification.timestamp)}</Time>
                            </NotificationItem>
                        ))}
                    </NotificationList>
                )}
            </Dropdown>

            {selectedNotification && (
                <ModalBackdrop onClick={closeModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <CloseButton onClick={closeModal}>&times;</CloseButton>
                        <h3>{selectedNotification.title}</h3>
                        <p>{selectedNotification.content}</p>
                        <small>{formatTime(selectedNotification.timestamp)}</small>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </BellContainer>
    );
};