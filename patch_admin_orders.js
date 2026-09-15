const fs = require('fs');
const file = 'frontend/src/pages/admin/AdminOrders.jsx';
let content = fs.readFileSync(file, 'utf8');

// Wrap table in div.table-responsive-wrapper
content = content.replace(/<table style=\{\{ width: '100%', borderCollapse: 'collapse' \}\}>/, '<div className="table-responsive-wrapper">\n          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>');
content = content.replace(/<\/table>/, '</table>\n          </div>');

fs.writeFileSync(file, content);
console.log('AdminOrders patched');
