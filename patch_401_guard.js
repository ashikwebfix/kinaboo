const fs = require('fs');
const path = require('path');

const adminDir = 'frontend/src/pages/admin';
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.jsx'));

// Files and their primary fetch patterns to fix
const fixes = [
  { file: 'AdminUsers.jsx', pattern: /const data = await res\.json\(\);\n(\s+)setUsers\(data\);/, replacement: (m, sp) => `const data = await res.json();\n${sp}if (res.status === 401) { localStorage.removeItem('userInfo'); navigate('/login'); return; }\n${sp}setUsers(Array.isArray(data) ? data : []);` },
  { file: 'AdminOrders.jsx', pattern: /const data = await res\.json\(\);\n(\s+)setOrders\(data\);/, replacement: (m, sp) => `const data = await res.json();\n${sp}if (res.status === 401) { localStorage.removeItem('userInfo'); navigate('/login'); return; }\n${sp}setOrders(Array.isArray(data) ? data : []);` },
  { file: 'AdminBundles.jsx', pattern: /const data = await res\.json\(\);\n(\s+)setBundles\(data\);/, replacement: (m, sp) => `const data = await res.json();\n${sp}if (res.status === 401) { localStorage.removeItem('userInfo'); navigate('/login'); return; }\n${sp}setBundles(Array.isArray(data) ? data : []);` },
  { file: 'AdminCoupons.jsx', pattern: /const data = await res\.json\(\);\n(\s+)setCoupons\(data\);/, replacement: (m, sp) => `const data = await res.json();\n${sp}if (res.status === 401) { localStorage.removeItem('userInfo'); navigate('/login'); return; }\n${sp}setCoupons(Array.isArray(data) ? data : []);` },
  { file: 'AdminMedia.jsx', pattern: /const data = await res\.json\(\);\n(\s+)setMedia\(data\);/, replacement: (m, sp) => `const data = await res.json();\n${sp}if (res.status === 401) { localStorage.removeItem('userInfo'); navigate('/login'); return; }\n${sp}setMedia(Array.isArray(data) ? data : []);` },
  { file: 'AdminAbandonedCarts.jsx', pattern: /const data = await res\.json\(\);\n(\s+)setCarts\(data\);/, replacement: (m, sp) => `const data = await res.json();\n${sp}if (res.status === 401) { localStorage.removeItem('userInfo'); navigate('/login'); return; }\n${sp}setCarts(Array.isArray(data) ? data : []);` },
];

let patchedCount = 0;

fixes.forEach(({ file, pattern, replacement }) => {
  const filepath = path.join(adminDir, file);
  if (!fs.existsSync(filepath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  let content = fs.readFileSync(filepath, 'utf8');
  if (pattern.test(content)) {
    content = content.replace(pattern, replacement);
    fs.writeFileSync(filepath, content);
    console.log(`Patched ${file}`);
    patchedCount++;
  } else {
    console.log(`No match in ${file}`);
  }
});

console.log(`\nDone. Patched ${patchedCount} files.`);
