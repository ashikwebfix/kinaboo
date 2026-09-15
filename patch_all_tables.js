const fs = require('fs');

const files = [
  'frontend/src/pages/admin/AdminBundles.jsx',
  'frontend/src/pages/admin/AdminCategories.jsx',
  'frontend/src/pages/admin/AdminCoupons.jsx',
  'frontend/src/pages/admin/AdminCustomers.jsx',
  'frontend/src/pages/admin/AdminPages.jsx',
  'frontend/src/pages/admin/AdminProducts.jsx',
  'frontend/src/pages/admin/AdminUsers.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if table is already wrapped (AdminUsers might not have a div wrapper before it)
    if (content.includes('overflow: \'hidden\'') && content.includes('<table style={{ width: \'100%\', borderCollapse: \'collapse\' }}>')) {
      // It has the div wrapper before it
      content = content.replace(/overflow: 'hidden' \}\}>/, 'overflowX: "auto" }}>');
      content = content.replace(/<table style=\{\{ width: '100%', borderCollapse: 'collapse' \}\}>/, '<table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>');
    } else if (content.includes('<table style={{ width: \'100%\', borderCollapse: \'collapse\' }}>')) {
      content = content.replace(/<table style=\{\{ width: '100%', borderCollapse: 'collapse' \}\}>/, '<div className="table-responsive-wrapper" style={{ overflowX: "auto" }}>\n<table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>');
      content = content.replace(/<\/table>/, '</table>\n</div>');
    }

    fs.writeFileSync(file, content);
    console.log('Patched', file);
  }
});
