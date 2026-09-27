import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Eye, EyeOff, LayoutTemplate, Image as ImageIcon, XCircle } from 'lucide-react';
import MediaPickerModal from '../../components/MediaPickerModal';

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero (Main Banner & Promos)' },
  { value: 'trust_badges', label: 'Trust Badges' },
  { value: 'popular_categories', label: 'Popular Categories Circle' },
  { value: 'super_hour', label: 'Super Hour Deals' },
  { value: 'editorial', label: 'Editorial Fashion Showcase' },
  { value: 'deals', label: 'Category-Wise Deals' },
  { value: 'featured', label: 'Featured Products' },
  { value: 'promo_bento', label: 'Promotional Bento Banners' },
  { value: 'trending', label: 'Trending Products' },
  { value: 'custom', label: 'Custom Product Section' },
  { value: 'product_grid', label: 'Dynamic Product Grid' },
  { value: 'faq', label: 'Frequently Asked Questions (FAQ)' }
];

const getDefaultData = (type) => {
  switch (type) {
    case 'hero': return { heroType: 'multi', singleHeroImage: '', singleHeroLink: '', heroBanners: [], promotionalBanners: [] };
    case 'trust_badges': return { trustBadges: [] };
    case 'popular_categories': return { title: 'Explore Popular Categories', viewAllLink: '/shop', items: [], selectedCategoryNames: [] };
    case 'super_hour': return { productIds: [], endTime: '' };
    case 'editorial': return {
      title: 'Elevate Your Style With Bold Fashion', centerBtnText: 'Explore Collections', centerBtnLink: '/shop',
      card1Img: '', card1Link: '/shop', card2Img: '', card2Link: '/shop', card3Img: '', card3Link: '/shop',
      card4Img: '', card4Link: '/shop', card5Img: '', card5Link: '/shop', card6Img: '', card6Link: '/shop', card7Img: '', card7Link: '/shop'
    };
    case 'deals': return { title: '🔥 Deals You Can\'t Miss', subtitle: 'ক্যাটাগরি ভিত্তিক আকর্ষণীয় ছাড়', viewAllText: 'সব দেখুন', productIds: [], limit: 8 };
    case 'featured': return { title: 'ফিচারড প্রোডাক্ট', productIds: [], limit: 12, sliderEnabled: true };
    case 'promo_bento': return { card1Img: '', card1Link: '', card2Img: '', card2Link: '', card3Img: '', card3Link: '', card4Img: '', card4Link: '' };
    case 'trending': return { title: 'নতুন কালেকশন', buttonText: 'সব দেখুন', buttonLink: '/shop', productIds: [], limit: 8, sliderEnabled: false, category: '' };
    case 'custom': return { title: 'Custom Section', category: '', limit: 8, displayMode: 'grid' };
    case 'product_grid': return { title: 'Product Showcase', queryType: 'latest', limit: 8, sliderEnabled: false };
    case 'faq': return { 
      title: 'Frequently Asked Questions', 
      subtitle: 'Find answers to common questions about our products and services.', 
      items: [
        { id: 1, question: 'What is your return policy?', answer: 'We offer a 30-day hassle-free return policy.' },
        { id: 2, question: 'How long does shipping take?', answer: 'Usually within 3-5 business days.' }
      ] 
    };
    default: return {};
  }
};

const ImageSelector = ({ value, onChange, onPick }) => {
  return value ? (
    <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <button type="button" onClick={() => onChange('')} style={{ position:'absolute', top: 2, right: 2, background:'#fff', borderRadius:'50%', padding: 2, border:'none', cursor:'pointer' }}>
        <XCircle size={14} color="#ef4444" />
      </button>
    </div>
  ) : (
    <button type="button" className="btn btn-secondary" onClick={onPick} style={{ width: '100px', height: '100px', display: 'flex', flexDirection: 'column', gap: '0.25rem', border: '2px dashed var(--border-color)', padding: 0, justifyContent: 'center' }}>
      <ImageIcon size={18} /> Add Image
    </button>
  );
};

const SortableItem = ({ id, section, updateSection, removeSection, setPickerType, allCategories }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [expanded, setExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '1rem',
    overflow: 'hidden'
  };

  const data = section.data || {};
  
  const updateData = (field, value) => {
    updateSection(id, { ...section, data: { ...data, [field]: value } });
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: '#f9fafb', borderBottom: expanded ? '1px solid #e5e7eb' : 'none' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', marginRight: '1rem', color: '#9ca3af' }}>
          <GripVertical size={20} />
        </div>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {SECTION_TYPES.find(t => t.value === section.type)?.label || section.type}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', background: '#e5e7eb', padding: '2px 8px', borderRadius: '12px' }}>
            {section.type}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button type="button" onClick={() => updateSection(id, { ...section, active: !section.active })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: section.active ? '#10b981' : '#9ca3af' }}>
            {section.active ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <button type="button" onClick={() => removeSection(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
            <Trash2 size={20} />
          </button>
          <button type="button" onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Body / Content Editor */}
      {expanded && (
        <div style={{ padding: '1.5rem', opacity: section.active ? 1 : 0.6 }}>
          
          {section.type === 'hero' && (
            <div>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" checked={data.heroType !== 'single'} onChange={() => updateData('heroType', 'multi')} /> Multi Image
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" checked={data.heroType === 'single'} onChange={() => updateData('heroType', 'single')} /> Single Image
                </label>
              </div>

              {data.heroType === 'single' ? (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Single Hero Image</label>
                  <div style={{ marginBottom: '1rem' }}>
                    <ImageSelector value={data.singleHeroImage || ''} onChange={val => updateData('singleHeroImage', val)} onPick={() => setPickerType(`${id}:singleHeroImage`)} />
                  </div>
                  <label>Link URL</label>
                  <input className="input-field" value={data.singleHeroLink || ''} onChange={e => updateData('singleHeroLink', e.target.value)} />
                </div>
              ) : (
                <div>
                  <h4>Main Banners</h4>
                  {(data.heroBanners || []).map((b, i) => (
                    <div key={b.id || i} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                       <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Banner Image</label>
                       <ImageSelector value={b.image} onChange={val => {
                         const nb = [...data.heroBanners]; nb[i].image = val; updateData('heroBanners', nb);
                       }} onPick={() => setPickerType(`${id}:heroBanners:${i}:image`)} />
                       <input className="input-field" placeholder="Link" value={b.link} onChange={e => {
                         const nb = [...data.heroBanners]; nb[i].link = e.target.value; updateData('heroBanners', nb);
                       }} style={{marginTop: '0.5rem'}}/>
                       <button type="button" onClick={() => updateData('heroBanners', data.heroBanners.filter((_, idx) => idx !== i))} style={{color:'red', marginTop: '0.5rem'}}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary" onClick={() => updateData('heroBanners', [...(data.heroBanners||[]), {id: Date.now(), image:'', link:'/'}])}>Add Banner</button>
                  
                  <h4 style={{marginTop: '2rem'}}>Promotional Mini Banners</h4>
                  {(data.promotionalBanners || []).map((b, i) => (
                    <div key={b.id || i} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                       <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Promo Image</label>
                       <ImageSelector value={b.image} onChange={val => {
                         const nb = [...data.promotionalBanners]; nb[i].image = val; updateData('promotionalBanners', nb);
                       }} onPick={() => setPickerType(`${id}:promotionalBanners:${i}:image`)} />
                       <button type="button" onClick={() => updateData('promotionalBanners', data.promotionalBanners.filter((_, idx) => idx !== i))} style={{color:'red', marginTop: '0.5rem'}}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary" onClick={() => updateData('promotionalBanners', [...(data.promotionalBanners||[]), {id: Date.now(), image:'', link:'/'}])}>Add Promo</button>
                </div>
              )}
            </div>
          )}

          {section.type === 'trust_badges' && (
             <div>
                {(data.trustBadges || []).map((b, i) => (
                  <div key={b.id || i} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                    <input className="input-field" placeholder="Text" value={b.text} onChange={e => {
                      const nb = [...data.trustBadges]; nb[i].text = e.target.value; updateData('trustBadges', nb);
                    }} />
                    <select className="input-field" value={b.icon} onChange={e => {
                      const nb = [...data.trustBadges]; nb[i].icon = e.target.value; updateData('trustBadges', nb);
                    }}>
                      <option value="Star">Star</option>
                      <option value="Truck">Truck</option>
                      <option value="ShieldCheck">Shield</option>
                      <option value="RotateCcw">Rotate</option>
                      <option value="Sparkles">Sparkles</option>
                    </select>
                    <button type="button" onClick={() => updateData('trustBadges', data.trustBadges.filter((_, idx) => idx !== i))} style={{color:'red'}}>Remove</button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={() => updateData('trustBadges', [...(data.trustBadges||[]), {id: Date.now(), text:'', icon:'Star'}])}>Add Badge</button>
             </div>
          )}

          {['featured', 'deals', 'trending', 'custom', 'super_hour', 'product_grid'].includes(section.type) && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {section.type !== 'super_hour' && (
                <>
                  <label>Section Title</label>
                  <input className="input-field" value={data.title || ''} onChange={e => updateData('title', e.target.value)} />
                </>
              )}
              {['featured', 'trending', 'product_grid'].includes(section.type) && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={data.sliderEnabled} onChange={e => updateData('sliderEnabled', e.target.checked)} />
                  Enable Slider Mode
                </label>
              )}
              {['custom', 'trending', 'deals'].includes(section.type) && (
                <>
                  <label>Filter by Category (Optional)</label>
                  <select className="input-field" value={data.category || ''} onChange={e => updateData('category', e.target.value)}>
                    <option value="">All Categories</option>
                    {allCategories.map(c => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </>
              )}
              <label>Specific Product IDs (Comma separated, optional)</label>
              <input className="input-field" value={(data.productIds || []).join(', ')} onChange={e => updateData('productIds', e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} placeholder="e.g. 64a1b2, 64a1b3" />
              <label>Limit (Number of products)</label>
              <input type="number" className="input-field" value={data.limit || 8} onChange={e => updateData('limit', parseInt(e.target.value))} />
              
              {section.type === 'product_grid' && (
                <>
                  <label>Query Type</label>
                  <select className="input-field" value={data.queryType || 'latest'} onChange={e => updateData('queryType', e.target.value)}>
                    <option value="latest">Latest Arrivals</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest_rated">Highest Rated</option>
                    <option value="price_low_high">Price: Low to High</option>
                    <option value="price_high_low">Price: High to Low</option>
                  </select>
                </>
              )}
            </div>
          )}

          {section.type === 'faq' && (
            <div>
              <div style={{display: 'flex', gap: '1rem', flexDirection: 'column', marginBottom: '2rem'}}>
                <label>Main Title</label>
                <input className="input-field" value={data.title || ''} onChange={e => updateData('title', e.target.value)} />
                <label>Subtitle / Description</label>
                <textarea className="input-field" value={data.subtitle || ''} onChange={e => updateData('subtitle', e.target.value)} rows="2" />
              </div>

              <h4 style={{marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem'}}>FAQ Items</h4>
              {(data.items || []).map((item, i) => (
                <div key={item.id || i} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
                  <input className="input-field" placeholder="Question" value={item.question} onChange={e => {
                    const nb = [...data.items]; nb[i].question = e.target.value; updateData('items', nb);
                  }} style={{marginBottom: '0.5rem'}}/>
                  <textarea className="input-field" placeholder="Answer" value={item.answer} onChange={e => {
                    const nb = [...data.items]; nb[i].answer = e.target.value; updateData('items', nb);
                  }} rows="2" />
                  <button type="button" onClick={() => updateData('items', data.items.filter((_, idx) => idx !== i))} style={{color:'red', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer'}}>Remove Question</button>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={() => updateData('items', [...(data.items||[]), {id: Date.now(), question:'', answer:''}])}>Add FAQ Item</button>
            </div>
          )}

          {section.type === 'popular_categories' && (
            <div>
              <label>Title</label>
              <input className="input-field" value={data.title || ''} onChange={e => updateData('title', e.target.value)} style={{marginBottom:'1rem'}} />
              <label>Selected Categories for Quick Access</label>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem'}}>
                {allCategories.map(cat => {
                   const isSelected = (data.selectedCategoryNames || []).includes(cat.name);
                   return (
                     <button key={cat._id || cat.name} type="button" onClick={() => {
                        const cur = data.selectedCategoryNames || [];
                        updateData('selectedCategoryNames', isSelected ? cur.filter(c => c !== cat.name) : [...cur, cat.name]);
                     }} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: isSelected ? '1px solid blue' : '1px solid #ccc', background: isSelected ? '#eef2ff' : '#fff' }}>
                       {cat.name}
                     </button>
                   );
                })}
              </div>
            </div>
          )}

          {section.type === 'editorial' && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div style={{gridColumn: 'span 2'}}>
                <label>Main Title</label>
                <input className="input-field" value={data.title || ''} onChange={e => updateData('title', e.target.value)} />
              </div>
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} style={{border: '1px solid #ddd', padding: '1rem'}}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Card {i} Image</label>
                  <div style={{ marginBottom: '1rem' }}>
                    <ImageSelector value={data[`card${i}Img`] || ''} onChange={val => updateData(`card${i}Img`, val)} onPick={() => setPickerType(`${id}:card${i}Img`)} />
                  </div>
                  <label>Card {i} Link</label>
                  <input className="input-field" value={data[`card${i}Link`] || ''} onChange={e => updateData(`card${i}Link`, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {section.type === 'promo_bento' && (
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{border: '1px solid #ddd', padding: '1rem'}}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bento Card {i} Image</label>
                  <div style={{ marginBottom: '1rem' }}>
                    <ImageSelector value={data[`card${i}Img`] || ''} onChange={val => updateData(`card${i}Img`, val)} onPick={() => setPickerType(`${id}:card${i}Img`)} />
                  </div>
                  <label>Card {i} Link</label>
                  <input className="input-field" value={data[`card${i}Link`] || ''} onChange={e => updateData(`card${i}Link`, e.target.value)} />
                </div>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default function StorefrontBuilder({ layout, onChange, allProducts, allCategories }) {
  const [newSectionType, setNewSectionType] = useState('hero');
  const [localPickerType, setLocalPickerType] = useState(null);

  const handleMediaSelect = (selection) => {
    if (!localPickerType) return;
    const [sectionId, ...path] = localPickerType.split(':');
    
    const sectionIndex = layout.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) {
      setLocalPickerType(null);
      return;
    }
    
    const section = layout[sectionIndex];
    const data = { ...section.data };
    
    if (path.length === 1) {
      data[path[0]] = selection;
    } else if (path.length === 3) {
      const [arrayName, indexStr, propName] = path;
      const idx = parseInt(indexStr);
      const arr = [...data[arrayName]];
      arr[idx] = { ...arr[idx], [propName]: selection };
      data[arrayName] = arr;
    } else if (path.length === 2 && path[0] === 'items') {
       // popularCategories items
       const [arrayName, indexStr] = path;
       const idx = parseInt(indexStr);
       const arr = [...data[arrayName]];
       arr[idx] = { ...arr[idx], image: selection };
       data[arrayName] = arr;
    }
    
    const newLayout = [...layout];
    newLayout[sectionIndex] = { ...section, data };
    onChange(newLayout);
    
    setLocalPickerType(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = layout.findIndex((item) => item.id === active.id);
      const newIndex = layout.findIndex((item) => item.id === over.id);
      onChange(arrayMove(layout, oldIndex, newIndex));
    }
  };

  const addSection = () => {
    const newSection = {
      id: `${newSectionType}-${Date.now()}`,
      type: newSectionType,
      active: true,
      data: getDefaultData(newSectionType)
    };
    onChange([newSection, ...layout]); // Add to top
  };

  const updateSection = (id, newSection) => {
    onChange(layout.map(s => s.id === id ? newSection : s));
  };

  const removeSection = (id) => {
    onChange(layout.filter(s => s.id !== id));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Add New Section</label>
          <select className="input-field" value={newSectionType} onChange={e => setNewSectionType(e.target.value)} style={{ width: '100%', background: '#fff' }}>
            {SECTION_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn btn-primary" onClick={addSection} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Section
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={layout.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {layout.map((section, index) => (
            <SortableItem
              key={section.id}
              id={section.id}
              index={index}
              section={section}
              updateSection={updateSection}
              removeSection={removeSection}
              setPickerType={setLocalPickerType}
              allCategories={allCategories}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      {layout.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', border: '2px dashed #e5e7eb', borderRadius: '8px' }}>
          <LayoutTemplate size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <p>No sections added yet. Add a section above to start building your storefront.</p>
        </div>
      )}

      <MediaPickerModal
        isOpen={!!localPickerType}
        onClose={() => setLocalPickerType(null)}
        multiSelect={false}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
