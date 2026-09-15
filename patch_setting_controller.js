const fs = require('fs');
let file = 'server/controllers/settingController.js';
let content = fs.readFileSync(file, 'utf8');

const firebaseLogic = `      } else if (req.params.key === 'firebase_settings') {
        res.json({
          apiKey: '',
          authDomain: '',
          projectId: '',
          storageBucket: '',
          messagingSenderId: '',
          appId: '',
          vapidKey: '',
          serviceAccountJson: ''
        });`;

content = content.replace(
  "} else if (req.params.key === 'fraud_protection') {",
  firebaseLogic + "\n" + "} else if (req.params.key === 'fraud_protection') {"
);

// Mask the service account if it exists
content = content.replace(
  "if (setting) {",
  `if (setting) {
      if (req.params.key === 'firebase_settings' && setting.value.serviceAccountJson) {
        // Create a copy to avoid mutating the db object in memory
        const maskedValue = { ...setting.value };
        maskedValue.serviceAccountJson = '*** HIDDEN ***';
        return res.json(maskedValue);
      }`
);

fs.writeFileSync(file, content);
console.log('settingController updated');
