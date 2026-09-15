const fs = require('fs');
let file = 'frontend/src/pages/admin/AdminSettings.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' \}\}>/g, '<div className="form-grid-2">');
content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' \}\}>/g, '<div className="form-grid-2">');
content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' \}\}>/g, '<div className="form-grid-2">');
content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0\.5rem' \}\}>/g, '<div className="form-grid-2" style={{ marginTop: "0.5rem" }}>');
content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1\.5rem', maxWidth: '800px' \}\}>/g, '<div className="form-grid-2" style={{ maxWidth: "800px" }}>');

fs.writeFileSync(file, content);
console.log('AdminSettings patched');
