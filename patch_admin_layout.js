const fs = require('fs');
let file = 'frontend/src/components/AdminLayout.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
content = content.replace(
  "import { LayoutDashboard",
  "import { requestForToken, onMessageListener } from '../firebase';\nimport toast from 'react-hot-toast';\nimport { Bell, LayoutDashboard"
);

// Add state and logic inside AdminLayout
const notificationLogic = `
  const [isTokenFound, setTokenFound] = React.useState(false);

  React.useEffect(() => {
    onMessageListener().then(payload => {
      toast.success(payload.notification.body, { duration: 5000, icon: '🛍️' });
    }).catch(err => console.log('failed: ', err));
  }, []);

  const enableNotifications = async () => {
    try {
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        toast.error('VAPID key is missing in environment variables');
        return;
      }
      const token = await requestForToken(vapidKey);
      if (token) {
        setTokenFound(true);
        // Send token to backend
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/users/fcm-token', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userInfo.token
          },
          body: JSON.stringify({ fcmToken: token })
        });
        if (res.ok) {
          toast.success('Notifications enabled successfully!');
        } else {
          toast.error('Failed to save notification settings.');
        }
      }
    } catch (error) {
      toast.error('Could not enable notifications.');
      console.error(error);
    }
  };

  const notificationBtn = (
    <button 
      onClick={enableNotifications} 
      title="Enable Push Notifications"
      style={{ background: 'var(--accent-primary)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
    >
      <Bell size={16} /> Enable Alerts
    </button>
  );
`;

content = content.replace(
  "const [openMenus, setOpenMenus] = React.useState({ Products: true, Settings: true });",
  "const [openMenus, setOpenMenus] = React.useState({ Products: true, Settings: true });\n" + notificationLogic
);

// Add button to desktop sidebar top
content = content.replace(
  '<h2 className="heading-lg" style={{ color: \'var(--text-primary)\', margin: 0 }}>Admin Panel</h2>',
  '<h2 className="heading-lg" style={{ color: \'var(--text-primary)\', margin: 0 }}>Admin Panel</h2>\n          <div className="hide-on-mobile">{notificationBtn}</div>'
);

// Add button to mobile header
content = content.replace(
  '<button onClick={() => setMobileMenuOpen(true)} style={{ background: \'none\', border: \'none\', color: \'var(--text-primary)\' }}>',
  '<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>\n          <div className="hide-on-desktop">{notificationBtn}</div>\n          <button onClick={() => setMobileMenuOpen(true)} style={{ background: \'none\', border: \'none\', color: \'var(--text-primary)\' }}>'
);
content = content.replace(
  '<Menu size={24} />\n        </button>\n      </div>',
  '<Menu size={24} />\n        </button>\n        </div>\n      </div>'
);

fs.writeFileSync(file, content);
console.log('AdminLayout updated with notification button');
