import api from './axios';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  notification_type: 'task_alert' | 'status_update' | 'delivery_update' | 'reminder' | 'badge_earned' | 'rating_received' | 'system';
  is_read: boolean;
  link?: string;
  delivered_channels?: string[];
  created_at: string;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  task_alerts: boolean;
  delivery_updates: boolean;
  reminders: boolean;
  marketing_promos: boolean;
}

export interface ChatMessageItem {
  id: string;
  room_id: string;
  sender_name: string;
  sender_role: string;
  message: string;
  attachment_url?: string;
  created_at: string;
}

export const notificationApi = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    try {
      const res = await api.get('/notifications/');
      return res.data.results || res.data;
    } catch {
      return [
        {
          id: 'n-1',
          title: '🛵 New Surplus Pickup Nearby',
          body: '30 kg of Fresh Produce listed by Golden Gate Bakery (1.2 km away).',
          notification_type: 'task_alert',
          is_read: false,
          link: '/volunteer/tasks/nearby',
          created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        },
        {
          id: 'n-2',
          title: '📦 Delivery Status Update: In Transit',
          body: 'Volunteer Alex Johnson has picked up donation #891 and is heading to Hope Sanctuary.',
          notification_type: 'delivery_update',
          is_read: false,
          link: '/donor/history',
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        },
        {
          id: 'n-3',
          title: '⏰ Perishability Reminder',
          body: 'Listing #894 (Baked Goods) expires in 45 minutes. Action required.',
          notification_type: 'reminder',
          is_read: true,
          link: '/ngo/browse',
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
        {
          id: 'n-4',
          title: '🏅 Badge Unlocked: First Mile Hero',
          body: 'Congratulations! You earned the First Mile Hero badge for completing your first rescue mission.',
          notification_type: 'badge_earned',
          is_read: true,
          link: '/volunteer/badges',
          created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        },
      ];
    }
  },

  getUnreadCount: async (): Promise<number> => {
    try {
      const res = await api.get('/notifications/unread-count/');
      return res.data.unread_count;
    } catch {
      return 2;
    }
  },

  markAsRead: async (id: string) => {
    try {
      const res = await api.patch(`/notifications/${id}/read/`);
      return res.data;
    } catch {
      return { success: true };
    }
  },

  markAllAsRead: async () => {
    try {
      const res = await api.post('/notifications/read-all/');
      return res.data;
    } catch {
      return { success: true };
    }
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    try {
      const res = await api.get('/notifications/preferences/');
      return res.data;
    } catch {
      return {
        email_enabled: true,
        sms_enabled: true,
        push_enabled: true,
        in_app_enabled: true,
        task_alerts: true,
        delivery_updates: true,
        reminders: true,
        marketing_promos: false,
      };
    }
  },

  updatePreferences: async (prefs: Partial<NotificationPreferences>) => {
    try {
      const res = await api.put('/notifications/preferences/', prefs);
      return res.data;
    } catch {
      return { success: true, preferences: prefs };
    }
  },

  getChatMessages: async (roomId: string): Promise<ChatMessageItem[]> => {
    try {
      const res = await api.get(`/notifications/chat/${roomId}/`);
      return res.data;
    } catch {
      return [
        { id: 'c-1', room_id: roomId, sender_name: 'Donor (Golden Gate Bakery)', sender_role: 'donor', message: 'Hello! The 30kg of baked goods are packed in thermal containers and ready for pickup at the back entrance.', created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
        { id: 'c-2', room_id: roomId, sender_name: 'Volunteer (Alex Johnson)', sender_role: 'volunteer', message: 'Got it! I am on my way with a van, ETA 8 minutes.', created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
        { id: 'c-3', room_id: roomId, sender_name: 'NGO (Hope Sanctuary)', sender_role: 'ngo', message: 'Awesome! Our kitchen team is ready to receive the delivery.', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      ];
    }
  },

  sendChatMessage: async (roomId: string, message: string, attachmentUrl?: string): Promise<ChatMessageItem> => {
    try {
      const res = await api.post(`/notifications/chat/${roomId}/`, { message, attachment_url: attachmentUrl });
      return res.data;
    } catch {
      return {
        id: `c-${Date.now()}`,
        room_id: roomId,
        sender_name: 'You',
        sender_role: 'user',
        message,
        attachment_url: attachmentUrl,
        created_at: new Date().toISOString(),
      };
    }
  }
};
