const fs = require('fs');
let file = 'server/controllers/settingController.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "if (setting) {",
  `if (setting) {
      if (key === 'firebase_settings' && value.serviceAccountJson === '*** HIDDEN ***') {
        value.serviceAccountJson = setting.value.serviceAccountJson;
      }`
);

fs.writeFileSync(file, content);
console.log('settingController update logic patched');
