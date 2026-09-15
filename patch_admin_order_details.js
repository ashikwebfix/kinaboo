const fs = require('fs');
let file = 'frontend/src/pages/admin/AdminOrderDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the left column wrapper
content = content.replace(
  /<div ref=\{printRef\} style=\{\{ background: '#fff', padding: '3rem', borderRadius: '12px', border: '1px solid var\(--border-color\)', boxShadow: '0 4px 6px -1px rgba\(0,0,0,0\.05\)' \}\}>/,
  '<div ref={printRef} className="invoice-card">'
);

// Replace the header inside left column
content = content.replace(
  /<div style=\{\{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var\(--border-color\)', paddingBottom: '2rem', marginBottom: '2rem' \}\}>/,
  '<div className="invoice-header">'
);

fs.writeFileSync(file, content);
console.log('AdminOrderDetails patched');
