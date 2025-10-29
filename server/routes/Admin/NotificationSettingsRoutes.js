import express from 'express';
import {
  getNotificationSettings,
  updateNotificationSettings,
  resetNotificationSettings,
  getAllNotificationSettings
} from '../../controllers/admin/notificationSettingsController.js';
import isAdminAuthenticated from '../../middlewares/isAdminAuthenticated.js';
import isAuthenticated from '../../middlewares/isAuthenticated.js';

const router = express.Router();

// Get notification settings for current user
router.route('/settings').get(isAuthenticated, getNotificationSettings);

// Update notification settings for current user
router.route('/settings').patch(isAuthenticated, updateNotificationSettings);

// Reset notification settings to default
router.route('/settings/reset').post(isAuthenticated, resetNotificationSettings);

// Get all notification settings (admin only)
router.route('/settings/all').get(isAdminAuthenticated, getAllNotificationSettings);

export default router;
