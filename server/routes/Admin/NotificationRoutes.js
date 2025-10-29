import express from 'express';
import { 
  createNotification, 
  getNotifications, 
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} from '../../controllers/admin/notificationController.js';
import isAdminAuthenticated from './../../middlewares/isAdminAuthenticated.js';
import isAuthenticated from '../../middlewares/isAuthenticated.js';

const router = express.Router();

// Get all notifications for user (SSE)
router.route("/get-all-notification").get(getNotifications);

// Get notifications for current user (regular API)
router.route("/user-notifications").get(isAuthenticated, getUserNotifications);

// Get unread notification count
router.route("/unread-count").get(isAuthenticated, getUnreadCount);

// Create notification (admin only)
router.route("/create-notification").post(isAdminAuthenticated, createNotification);

// Mark notification as read
router.route("/:notificationId/read").patch(isAuthenticated, markAsRead);

// Mark all notifications as read
router.route("/mark-all-read").patch(isAuthenticated, markAllAsRead);

// Delete notification
router.route("/:notificationId").delete(isAuthenticated, deleteNotification);

export default router;