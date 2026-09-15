const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/admin/AdminSettings.jsx', 'utf8');

if (!content.includes("onClick={() => navigate('/admin/settings?tab=firebase')}")) {
  content = content.replace(
    /<button className={`tab-btn \${activeTab === 'courier' \? 'active' : ''}`} onClick=\{\(\) => navigate\('\/admin\/settings\?tab=courier'\)\}>Courier API<\/button>/,
    "<button className={`tab-btn ${activeTab === 'courier' ? 'active' : ''}`} onClick={() => navigate('/admin/settings?tab=courier')}>Courier API</button>\n        <button className={`tab-btn ${activeTab === 'firebase' ? 'active' : ''}`} onClick={() => navigate('/admin/settings?tab=firebase')}>Firebase Push</button>"
  );
}

if (!content.includes("activeTab === 'firebase' &&")) {
  const firebaseContent = `
        {activeTab === 'firebase' && (
          <div className="settings-section animate-fade-in">
            <h2 className="heading-md">Firebase Push Notifications</h2>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Configure Firebase Cloud Messaging to receive new order alerts on your devices.</p>
            
            <div className="input-group">
              <label>API Key</label>
              <input type="text" className="input-field" value={firebaseSettings.apiKey} onChange={e => setFirebaseSettings({...firebaseSettings, apiKey: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Auth Domain</label>
              <input type="text" className="input-field" value={firebaseSettings.authDomain} onChange={e => setFirebaseSettings({...firebaseSettings, authDomain: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Project ID</label>
              <input type="text" className="input-field" value={firebaseSettings.projectId} onChange={e => setFirebaseSettings({...firebaseSettings, projectId: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Storage Bucket</label>
              <input type="text" className="input-field" value={firebaseSettings.storageBucket} onChange={e => setFirebaseSettings({...firebaseSettings, storageBucket: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Messaging Sender ID</label>
              <input type="text" className="input-field" value={firebaseSettings.messagingSenderId} onChange={e => setFirebaseSettings({...firebaseSettings, messagingSenderId: e.target.value})} />
            </div>
            <div className="input-group">
              <label>App ID</label>
              <input type="text" className="input-field" value={firebaseSettings.appId} onChange={e => setFirebaseSettings({...firebaseSettings, appId: e.target.value})} />
            </div>
            <div className="input-group">
              <label>VAPID Public Key</label>
              <input type="text" className="input-field" value={firebaseSettings.vapidKey} onChange={e => setFirebaseSettings({...firebaseSettings, vapidKey: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Service Account JSON (Server-side)</label>
              <textarea className="input-field" rows="4" value={firebaseSettings.serviceAccountJson} onChange={e => setFirebaseSettings({...firebaseSettings, serviceAccountJson: e.target.value})} placeholder="Paste the entire JSON content of your Firebase service account key..."></textarea>
            </div>
          </div>
        )}
`;
  content = content.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*<div style=\{\{ display: 'flex'/,
    "</div>\n" + firebaseContent + "\n      </div>\n    </div>\n      <div style={{ display: 'flex'"
  );
}

if (!content.includes("fetch(import.meta.env.VITE_API_URL + '/api/settings/firebase_settings', { method: 'PUT'")) {
  const saveFirebase = `
      await fetch(import.meta.env.VITE_API_URL + '/api/settings/firebase_settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
        body: JSON.stringify({ value: firebaseSettings })
      });
`;
  content = content.replace(
    /toast\.success\('Settings saved successfully'\);/,
    saveFirebase + "\n      toast.success('Settings saved successfully');"
  );
}

fs.writeFileSync('frontend/src/pages/admin/AdminSettings.jsx', content);
console.log('Firebase tab added to AdminSettings.jsx');
