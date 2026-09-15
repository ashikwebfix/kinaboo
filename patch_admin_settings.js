const fs = require('fs');
let file = 'frontend/src/pages/admin/AdminSettings.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state variable
content = content.replace(
  "const [generalSettings, setGeneralSettings] = useState({ maintenanceMode: false, maintenanceMessage: 'Site is under maintenance. We will be right back.' });",
  "const [generalSettings, setGeneralSettings] = useState({ maintenanceMode: false, maintenanceMessage: 'Site is under maintenance. We will be right back.' });\n  const [firebaseSettings, setFirebaseSettings] = useState({ apiKey: '', authDomain: '', projectId: '', storageBucket: '', messagingSenderId: '', appId: '', vapidKey: '', serviceAccountJson: '' });"
);

// 2. Add fetch logic
content = content.replace(
  "const pathaoRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/pathao_settings', { headers: { Authorization: `Bearer ${token}` } });",
  `const pathaoRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/pathao_settings', { headers: { Authorization: \`Bearer \${token}\` } });
      const firebaseRes = await fetch(import.meta.env.VITE_API_URL + '/api/settings/firebase_settings', { headers: { Authorization: \`Bearer \${token}\` } });
      if (firebaseRes.ok) {
        const firebaseData = await firebaseRes.json();
        if (firebaseData) setFirebaseSettings(firebaseData);
      }`
);

// 3. Add save logic
content = content.replace(
  "if (activeTab === 'pathao') {",
  `if (activeTab === 'firebase') {
        saveData = firebaseSettings;
        saveUrl = import.meta.env.VITE_API_URL + '/api/settings/firebase_settings';
      } else if (activeTab === 'pathao') {`
);

// 4. Add Tab Button
content = content.replace(
  "{ id: 'pathao', label: 'Pathao SMS/Delivery', icon: <Truck size={18} /> }",
  "{ id: 'pathao', label: 'Pathao SMS/Delivery', icon: <Truck size={18} /> },\n            { id: 'firebase', label: 'Firebase Push', icon: <Flame size={18} /> }"
);

// 5. Add Tab UI
const firebaseTabUI = `
        {activeTab === 'firebase' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="heading-md" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={20} /> Firebase Configuration
              </h2>
            </div>
            <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Frontend Web Config</h3>
              <div className="form-grid">
                <div><label className="input-label">API Key</label><input type="text" className="input-field" value={firebaseSettings.apiKey} onChange={(e) => setFirebaseSettings({...firebaseSettings, apiKey: e.target.value})} /></div>
                <div><label className="input-label">Auth Domain</label><input type="text" className="input-field" value={firebaseSettings.authDomain} onChange={(e) => setFirebaseSettings({...firebaseSettings, authDomain: e.target.value})} /></div>
                <div><label className="input-label">Project ID</label><input type="text" className="input-field" value={firebaseSettings.projectId} onChange={(e) => setFirebaseSettings({...firebaseSettings, projectId: e.target.value})} /></div>
                <div><label className="input-label">Storage Bucket</label><input type="text" className="input-field" value={firebaseSettings.storageBucket} onChange={(e) => setFirebaseSettings({...firebaseSettings, storageBucket: e.target.value})} /></div>
                <div><label className="input-label">Messaging Sender ID</label><input type="text" className="input-field" value={firebaseSettings.messagingSenderId} onChange={(e) => setFirebaseSettings({...firebaseSettings, messagingSenderId: e.target.value})} /></div>
                <div><label className="input-label">App ID</label><input type="text" className="input-field" value={firebaseSettings.appId} onChange={(e) => setFirebaseSettings({...firebaseSettings, appId: e.target.value})} /></div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Web Push Setup (VAPID)</h3>
              <div className="form-grid">
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">VAPID Public Key</label>
                  <input type="text" className="input-field" value={firebaseSettings.vapidKey} onChange={(e) => setFirebaseSettings({...firebaseSettings, vapidKey: e.target.value})} />
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Backend Configuration</h3>
              <div className="form-grid">
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="input-label">Service Account JSON (For Firebase Admin SDK)</label>
                  <textarea className="input-field" rows="6" value={firebaseSettings.serviceAccountJson} onChange={(e) => setFirebaseSettings({...firebaseSettings, serviceAccountJson: e.target.value})} placeholder='{"type": "service_account", ...}' />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Paste the raw JSON contents here. This will be securely hidden after saving.</p>
                </div>
              </div>

            </div>
          </div>
        )}
`;

content = content.replace(
  "{activeTab === 'pathao' && (",
  firebaseTabUI + "\n        {activeTab === 'pathao' && ("
);

fs.writeFileSync(file, content);
console.log('AdminSettings updated with Firebase tab');
