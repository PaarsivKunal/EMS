import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaCheck, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/both/notification/user-notifications?limit=10', {
                withCredentials: true
            });

            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/api/v1/both/notification/unread-count', {
                withCredentials: true
            });

            if (response.data.success) {
                setUnreadCount(response.data.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(`/api/v1/both/notification/${notificationId}/read`, {}, {
                withCredentials: true
            });

            setNotifications(prev => 
                prev.map(notification => 
                    notification._id === notificationId 
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.patch('/api/v1/both/notification/mark-all-read', {}, {
                withCredentials: true
            });

            setNotifications(prev => 
                prev.map(notification => ({ ...notification, isRead: true }))
            );
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`/api/v1/both/notification/${notificationId}`, {
                withCredentials: true
            });

            setNotifications(prev => 
                prev.filter(notification => notification._id !== notificationId)
            );
            
            // Check if the deleted notification was unread
            const deletedNotification = notifications.find(n => n._id === notificationId);
            if (deletedNotification && !deletedNotification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'task_created':
            case 'task_updated':
            case 'task_completed':
                return '📋';
            case 'system':
                return '⚙️';
            case 'general':
                return '📢';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'task_completed':
                return 'text-green-600';
            case 'task_created':
                return 'text-blue-600';
            case 'task_updated':
                return 'text-yellow-600';
            case 'system':
                return 'text-purple-600';
            default:
                return 'text-gray-600';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        fetchNotifications();
                    }
                }}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            <div className="flex space-x-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                        !notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <span className="text-lg">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${getNotificationColor(notification.type)}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatTime(notification.createdAt)}
                                            </p>
                                            {notification.sender && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    From: {notification.sender.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs"
                                                    title="Mark as read"
                                                >
                                                    <FaCheck />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification._id)}
                                                className="text-red-600 hover:text-red-800 text-xs"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    // Navigate to full notifications page
                                    window.location.href = '/notifications';
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
