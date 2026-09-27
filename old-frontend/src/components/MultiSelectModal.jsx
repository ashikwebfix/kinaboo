import React, { useState, useMemo } from 'react';
import { X, Search, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

const MultiSelectModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  items = [], 
  selectedItems = [], 
  title = "Select Items",
  itemKey = "id",
  itemLabel = "name",
  itemImage = null,
  itemSubtitle = null
}) => {
  const [search, setSearch] = useState('');
  const [localSelected, setLocalSelected] = useState(new Set(selectedItems));

  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter(item => {
      const labelMatch = String(item[itemLabel] || '').toLowerCase().includes(search.toLowerCase());
      const subMatch = itemSubtitle ? String(item[itemSubtitle] || '').toLowerCase().includes(search.toLowerCase()) : false;
      return labelMatch || subMatch;
    });
  }, [items, search, itemLabel, itemSubtitle]);

  const toggleSelection = (value) => {
    const next = new Set(localSelected);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    setLocalSelected(next);
  };

  const handleSave = () => {
    onSave(Array.from(localSelected));
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-fade-in" style={{ background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
        
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="input-field" 
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {localSelected.size} selected
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No items found.</div>
          ) : (
            filteredItems.map(item => {
              const val = item[itemKey];
              const isSelected = localSelected.has(val);
              
              let imgSrc = null;
              if (itemImage && item[itemImage]) {
                imgSrc = Array.isArray(item[itemImage]) ? item[itemImage][0] : item[itemImage];
              }

              return (
                <div 
                  key={val} 
                  onClick={() => toggleSelection(val)}
                  style={{ 
                    padding: '0.75rem 1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    background: isSelected ? '#f0fdf4' : 'transparent',
                    marginBottom: '0.25rem'
                  }}
                  onMouseOver={(e) => { if(!isSelected) e.currentTarget.style.background = '#f9fafb' }}
                  onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {imgSrc && (
                      <img src={imgSrc} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: isSelected ? 600 : 500, color: isSelected ? '#166534' : 'var(--text-primary)' }}>
                        {item[itemLabel]}
                      </div>
                      {itemSubtitle && item[itemSubtitle] && (
                        <div style={{ fontSize: '0.75rem', color: isSelected ? '#15803d' : 'var(--text-secondary)' }}>
                          {item[itemSubtitle]}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check size={18} color="#166534" />}
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary">Save Selection</button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default MultiSelectModal;
