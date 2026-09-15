const fs = require('fs');

let file = 'frontend/src/pages/admin/AdminProductForm.jsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' \}\}>/g, '<div className="form-grid-2-1" style={{ gap: "2rem" }}>');
  content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' \}\}>/g, '<div className="form-grid-2-1" style={{ marginBottom: "1rem" }}>');
  content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' \}\}>/g, '<div className="form-grid-3">');
  content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' \}\}>/g, '<div className="form-grid-3" style={{ marginBottom: "1rem" }}>');
  fs.writeFileSync(file, content);
}

file = 'frontend/src/pages/admin/AdminBundleForm.jsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' \}\}>/g, '<div className="form-grid-2-1" style={{ gap: "2rem" }}>');
  content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' \}\}>/g, '<div className="form-grid-2-1" style={{ marginBottom: "1rem" }}>');
  content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' \}\}>/g, '<div className="form-grid-3">');
  content = content.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' \}\}>/g, '<div className="form-grid-3" style={{ marginBottom: "1rem" }}>');
  fs.writeFileSync(file, content);
}

console.log('Forms patched');
