import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

let app;
let messaging;
let vapidKey = '';

export const initFirebase = async (token) => {
  if (app) return true;
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + '/api/settings/firebase_settings', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const config = await res.json();
      if (config.apiKey) {
        app = initializeApp(config);
        messaging = getMessaging(app);
        vapidKey = config.vapidKey;
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error("Firebase init failed", err);
    return false;
  }
};

export const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = (callback) => {
  if (!messaging) return;
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};
