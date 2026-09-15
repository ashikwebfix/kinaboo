const fs = require('fs');
const file = 'frontend/src/pages/admin/AdminOrderDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

const importReplacement = `import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Truck, MapPin, User, FileText, CheckCircle, Clock, Package, X, Send, Edit, Trash2, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';`;
content = content.replace(/import React[\s\S]*?import toast from 'react-hot-toast';/, importReplacement);

const stateReplacement = `  const [shippingData, setShippingData] = useState({
    name: '', phone: '', shippingAddress: '', city: '', postalCode: ''
  });

  // Order Items Edit State
  const [editItemsMode, setEditItemsMode] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
`;
content = content.replace(/  const \[shippingData, setShippingData\] = useState\(\{[\s\S]*?  \}\);/, stateReplacement);


const fetchReplacement = `      if (foundOrder) {
        setOrder(foundOrder);
        setEditedItems(foundOrder.orderItems || []);
        setStatus(foundOrder.status || 'Pending');`;
content = content.replace(/      if \(foundOrder\) \{\n        setOrder\(foundOrder\);\n        setStatus\(foundOrder.status \|\| 'Pending'\);/, fetchReplacement);


const functionsToInject = `
  const handleEditItemsToggle = () => {
    if (editItemsMode) {
      // cancel
      setEditedItems(order.orderItems || []);
      setEditItemsMode(false);
    } else {
      setEditedItems(order.orderItems || []);
      setEditItemsMode(true);
    }
  };

  const handleItemQtyChange = (index, delta) => {
    const newItems = [...editedItems];
    if (newItems[index].qty + delta > 0) {
      newItems[index].qty += delta;
      setEditedItems(newItems);
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = [...editedItems];
    newItems.splice(index, 1);
    setEditedItems(newItems);
  };

  const searchProducts = async (q) => {
    setProductSearch(q);
    if (!q || q.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/api/products?search=\${q}\`);
      const data = await res.json();
      setSearchResults(data.products || data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const addProductToOrder = (product) => {
    // Check if already in order
    const existingIndex = editedItems.findIndex(i => i.productId === product.id);
    if (existingIndex >= 0) {
      handleItemQtyChange(existingIndex, 1);
    } else {
      setEditedItems([...editedItems, {
        productId: product.id,
        product: product,
        qty: 1,
        price: product.sellPrice || product.price,
        selectedVariations: null // default variations
      }]);
    }
    setProductSearch('');
    setSearchResults([]);
  };

  const handleSaveItems = async () => {
    if (editedItems.length === 0) {
      return toast.error('Order must have at least one item');
    }
    try {
      const res = await fetch(\`\${import.meta.env.VITE_API_URL}/api/orders/\${id}/items\`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\` 
        },
        body: JSON.stringify({ orderItems: editedItems })
      });
      if (res.ok) {
        toast.success('Order items updated successfully!');
        setEditItemsMode(false);
        fetchOrder();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update items');
      }
    } catch (error) {
      toast.error('Error saving items');
    }
  };
`;
content = content.replace(/  useEffect\(\(\) => \{\n    if \(selectedCity\)/, functionsToInject + "\n  useEffect(() => {\n    if (selectedCity)");

fs.writeFileSync(file, content);
console.log('patched');
