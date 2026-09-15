const fs = require('fs');
let file = 'frontend/src/components/AdminLayout.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace old imports
content = content.replace(
  "import { requestForToken, onMessageListener } from '../firebase';",
  "import { requestForToken, onMessageListener, initFirebase } from '../firebase';"
);

// Update enableNotifications
content = content.replace(
  "const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;\n      if (!vapidKey) {\n        toast.error('VAPID key is missing in environment variables');\n        return;\n      }\n      const token = await requestForToken(vapidKey);",
  `const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const initialized = await initFirebase(userInfo.token);
      if (!initialized) {
        toast.error('Firebase is not configured in Settings.');
        return;
      }
      const token = await requestForToken();`
);

content = content.replace(
  "const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');\n        const res = await fetch",
  "const res = await fetch"
);

// We need to initialize firebase on mount as well to listen to messages
content = content.replace(
  "onMessageListener().then(payload => {",
  `const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    initFirebase(userInfo.token).then(initialized => {
      if (initialized) {
        onMessageListener().then(payload => {
          toast.success(payload.notification.body, { duration: 5000, icon: '🛍️' });
        }).catch(err => console.log('failed: ', err));
      }
    });`
);
content = content.replace(
  "}).catch(err => console.log('failed: ', err));\n  }, []);",
  "  }, []);" // The catch was replaced above inside the block
);

fs.writeFileSync(file, content);
console.log('AdminLayout updated with dynamic init');
