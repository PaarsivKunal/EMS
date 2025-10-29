import Notification from "../../models/notification.model.js";
import User from "../../models/user.model.js";
import Employee from "../../models/employee.model.js";
import { sendBroadcastNotification, markNotificationAsRead, getUnreadNotificationCount } from "../../helpers/notificationService.js";

export const createNotification = async (req, res) => {
  try {
    const { message, type = 'general', priority = 'medium' } = req.body;

    // Simple validation
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const sender = await User.findById(req.user._id);
    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    await sendBroadcastNotification(sender, message, type, { priority });
    
    res.status(201).json({ 
      success: true, 
      message: "Notification sent successfully" 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get notifications for current user (including broadcasts)
export const getNotifications = async (req, res) => {
  try {
    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Function to send notifications
    const sendNotifications = async () => {
      try {
        const notifications = await Notification.find({
          $or: [
            { isBroadcast: true },
            { recipient: req.employee?._id }
          ],
          // Only get notifications created since last check
          createdAt: { $gt: lastCheck }
        }).sort({ createdAt: -1 });

        if (notifications.length > 0) {
          res.write(`data: ${JSON.stringify(notifications)}\n\n`);
          lastCheck = new Date(); // Update last check time
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

   let lastCheck = new Date(Date.now() - 1000 * 60 * 5); // last 5 minutes

    
    // Initial send
    await sendNotifications();

    // Set up polling interval
    const intervalId = setInterval(sendNotifications, 3000);

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });

  } catch (err) {
    console.error('Initial error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get notifications for current user (regular API endpoint)
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || req.employee?._id;
    const { page = 1, limit = 20, type, unreadOnly = false } = req.query;

    const filter = {
      $or: [
        { recipient: userId },
        { isBroadcast: true }
      ]
    };

    if (type) filter.type = type;
    if (unreadOnly === 'true') filter.isRead = false;

    const notifications = await Notification.find(filter)
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);

    res.json({
      success: true,
      notifications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id || req.employee?._id;

    await markNotificationAsRead(notificationId, userId);

    res.json({ 
      success: true, 
      message: "Notification marked as read" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?._id || req.employee?._id;

    await Notification.updateMany(
      {
        $or: [
          { recipient: userId },
          { isBroadcast: true }
        ],
        isRead: false
      },
      { isRead: true }
    );

    res.json({ 
      success: true, 
      message: "All notifications marked as read" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?._id || req.employee?._id;
    const count = await getUnreadNotificationCount(userId);

    res.json({ 
      success: true, 
      unreadCount: count 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user?._id || req.employee?._id;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      $or: [
        { recipient: userId },
        { sender: userId }
      ]
    });

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: "Notification not found or unauthorized" 
      });
    }

    res.json({ 
      success: true, 
      message: "Notification deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};