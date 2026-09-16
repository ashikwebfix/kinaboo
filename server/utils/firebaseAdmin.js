const admin = require('firebase-admin');

let isInitialized = false;

const initFirebaseAdmin = async () => {
  if (isInitialized) return true;
  try {
    const Setting = require('../models/Setting');
    const fbSettings = await Setting.findOne({ where: { key: 'firebase_settings' } });
    if (fbSettings && fbSettings.value && fbSettings.value.serviceAccountJson) {
      const serviceAccount = JSON.parse(fbSettings.value.serviceAccountJson);
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      }
      isInitialized = true;
      console.log("[FCM] Firebase Admin initialized dynamically from DB.");
      return true;
    }
  } catch (error) {
    console.error("[FCM] Error dynamically initializing Firebase Admin:", error.message);
  }
  return false;
};

const sendOrderNotification = async (order) => {
  const initialized = await initFirebaseAdmin();
  if (!initialized) {
    console.warn("[FCM] Firebase Admin not configured. Cannot send notification.");
    return;
  }
  
  try {
    const User = require('../models/User');
    const { Op } = require('sequelize');

    const admins = await User.findAll({
      where: {
        fcmToken: {
          [Op.not]: null
        },
        [Op.or]: [
          { role: 'superadmin' },
          { role: 'admin' },
          { role: 'manager' },
          { isAdmin: true }
        ]
      }
    });

    if (admins.length === 0) return;

    let tokens = [];
    admins.forEach(a => {
      if (a.fcmToken && a.fcmToken.trim() !== '') {
        try {
          const parsed = JSON.parse(a.fcmToken);
          if (Array.isArray(parsed)) {
            tokens.push(...parsed);
          } else {
            tokens.push(a.fcmToken);
          }
        } catch (e) {
          tokens.push(a.fcmToken); // Fallback to plain string
        }
      }
    });

    tokens = [...new Set(tokens)].filter(t => t); // Unique and non-empty
    if (tokens.length === 0) return;

    const payload = {
      notification: {
        title: 'New Order Received! 🛍️',
        body: `Order #${order.id ? order.id.toString().substring(0,6).toUpperCase() : 'Unknown'} placed for ${order.totalPrice} BDT.`
      },
      tokens: tokens
    };

    const response = await admin.messaging().sendEachForMulticast(payload);
    console.log(`[FCM] ${response.successCount} notifications sent successfully`);
  } catch (error) {
    console.error("Error sending Firebase Notification:", error);
  }
};

module.exports = {
  admin,
  sendOrderNotification
};
