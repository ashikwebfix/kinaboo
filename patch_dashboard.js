const fs = require('fs');
let file = 'frontend/src/pages/admin/Dashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch(import.meta.env.VITE_API_URL + '/api/products'),
          fetch(import.meta.env.VITE_API_URL + '/api/users', { headers: { Authorization: \`Bearer \${token}\` } }),
          fetch(import.meta.env.VITE_API_URL + '/api/orders', { headers: { Authorization: \`Bearer \${token}\` } })
        ]);
        
        if (usersRes.status === 401 || ordersRes.status === 401) {
          localStorage.removeItem('userInfo');
          navigate('/login');
          return;
        }
`;

content = content.replace(
  "const [productsRes, usersRes, ordersRes] = await Promise.all([\n          fetch(import.meta.env.VITE_API_URL + '/api/products'),\n          fetch(import.meta.env.VITE_API_URL + '/api/users', { headers: { Authorization: `Bearer ${token}` } }),\n          fetch(import.meta.env.VITE_API_URL + '/api/orders', { headers: { Authorization: `Bearer ${token}` } })\n        ]);",
  replacement
);

fs.writeFileSync(file, content);
console.log('Dashboard patched');
