const categories = [
  {
    title: 'Electronics',
    subtitle: 'Next-Generation Tech',
    description: 'Explore the latest in high-performance electronics, designed to keep you connected and productive.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Wearables',
    subtitle: 'Smart Fashion',
    description: 'Track your health and stay in style with our premium selection of smartwatches and fitness trackers.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop'
  },
  {
    title: 'Furniture',
    subtitle: 'Modern Living',
    description: 'Upgrade your workspace and home with our ergonomic and modern furniture collection.',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2069&auto=format&fit=crop'
  },
  {
    title: 'Photography',
    subtitle: 'Capture the Moment',
    description: 'Professional cameras, lenses, and accessories for both enthusiasts and professional photographers.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop'
  },
  {
    title: 'Accessories',
    subtitle: 'The Perfect Additions',
    description: 'Enhance your daily setup with premium bags, wallets, cases, and input devices.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=2000&auto=format&fit=crop'
  }
];

const products = [
  // ELECTRONICS (4)
  {
    name: 'Aura Pro 4K Monitor',
    price: 499.00,
    sellPrice: 429.99,
    description: 'Stunning 27-inch 4K UHD display engineered for creative professionals with a 99% sRGB color gamut and incredibly thin bezels.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d4aff?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Electronics',
    stock: 25,
    keypoints: ["27-inch IPS panel", "4K UHD (3840 x 2160)", "99% sRGB color gamut", "AMD FreeSync Premium", "USB-C Power Delivery (65W)"],
    variations: [],
    longDescription: "<h1>Uncompromising Visual Brilliance</h1><p>See every detail in stunning 4K clarity. Perfect for creative professionals, avid gamers, and anyone who refuses to compromise on visual fidelity. The Aura Pro 4K Monitor features a vibrant IPS panel with factory-calibrated color accuracy right out of the box.</p><h2>Seamless Connectivity</h2><p>Declutter your desk with single-cable USB-C connectivity that delivers video, data, and up to 65W of power to your laptop simultaneously.</p>",
    faq: [{ q: "Does it come with a VESA mount?", a: "Yes, it supports standard 100x100mm VESA mounting." }, { q: "What is the refresh rate?", a: "The monitor operates at 60Hz natively." }]
  },
  {
    name: 'Nimbus Wireless ANC Headphones',
    price: 299.99,
    sellPrice: 249.99,
    description: 'Immersive high-fidelity audio with adaptive active noise cancellation and an impressive 40-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=2069&auto=format&fit=crop'
    ],
    category: 'Electronics',
    stock: 45,
    keypoints: ["Adaptive Active Noise Cancellation", "40-hour battery life", "Bluetooth 5.2", "Multipoint connection", "Spatial Audio support"],
    variations: [{ name: "Color", options: ["Matte Black", "Lunar Silver", "Midnight Blue"] }],
    longDescription: "<h1>Silence the World, Elevate Your Music</h1><p>Experience unparalleled sound quality with the Nimbus Wireless Headphones. Designed for audiophiles and commuters alike, these headphones deliver crystal clear highs and deep, resonant bass, all while intelligently blocking out environmental noise.</p><h2>All-Day Comfort</h2><p>Featuring memory foam earcups wrapped in breathable protein leather, you can listen for hours without fatigue.</p>",
    faq: [{ q: "How long does it take to charge?", a: "A full charge takes approximately 2 hours, but a quick 10-minute charge gives you 4 hours of playback." }]
  },
  {
    name: 'Echo Pod Smart Speaker',
    price: 129.50,
    sellPrice: null,
    description: 'Control your entire smart home, stream music, and get answers instantly with this voice-activated hub featuring room-filling sound.',
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=2071&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=2071&auto=format&fit=crop'],
    category: 'Electronics',
    stock: 80,
    keypoints: ["Room-filling 360-degree sound", "Built-in voice assistant", "Smart home hub capabilities", "Privacy microphone disconnect"],
    variations: [{ name: "Color", options: ["Charcoal", "Glacier White"] }],
    longDescription: "<h1>The Center of Your Smart Home</h1><p>The Echo Pod is more than just a speaker. It is a central hub that connects all your smart devices. With a customized acoustic architecture, it delivers rich, detailed sound that adapts to the acoustics of your room.</p>",
    faq: [{ q: "Does it work with Apple Music?", a: "Yes, it supports Spotify, Apple Music, Amazon Music, and more." }]
  },
  {
    name: 'Velocity Portable SSD 1TB',
    price: 149.99,
    sellPrice: 119.99,
    description: 'Ultra-fast NVMe portable solid-state drive with read speeds up to 1050MB/s, housed in a rugged aluminum enclosure.',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=1964&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=1964&auto=format&fit=crop'],
    category: 'Electronics',
    stock: 120,
    keypoints: ["1TB Storage Capacity", "Up to 1050MB/s read speeds", "USB-C 3.2 Gen 2", "Drop-resistant up to 2 meters", "Hardware encryption"],
    variations: [{ name: "Capacity", options: ["1TB", "2TB", "4TB"] }],
    longDescription: "<h1>Speed That Keeps Up With You</h1><p>Transfer massive files in seconds with the Velocity Portable SSD. Utilizing NVMe technology, this drive offers blazing fast speeds in a form factor small enough to fit in your coin pocket.</p>",
    faq: [{ q: "Is it compatible with Mac and PC?", a: "Yes, it comes formatted in exFAT to work seamlessly across both platforms." }]
  },

  // WEARABLES (4)
  {
    name: 'Zenith Minimalist Smartwatch',
    price: 249.00,
    sellPrice: 199.50,
    description: 'A masterpiece of wearable technology that looks like a traditional mechanical watch but houses advanced health tracking and GPS.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Wearables',
    stock: 60,
    keypoints: ["Continuous Heart Rate Tracking", "Blood Oxygen (SpO2) sensor", "Built-in GPS", "5ATM water resistance", "14-day battery life"],
    variations: [{ name: "Case Color", options: ["Brushed Steel", "Matte Black"] }, { name: "Strap Material", options: ["Leather", "Silicone"] }],
    longDescription: "<h1>Classic Aesthetics, Modern Intelligence</h1><p>The Zenith Smartwatch bridges the gap between classic horology and modern fitness tracking. Designed for those who want health data without sacrificing style, it features an always-on AMOLED display hidden beneath a traditional analog face.</p><h2>Comprehensive Health Tracking</h2><p>Monitor your sleep stages, stress levels, heart rate, and blood oxygen 24/7 without needing to charge every night.</p>",
    faq: [{ q: "Can I shower with it?", a: "Yes, the 5ATM rating means it is safe for showering and surface swimming." }, { q: "Does it support contactless payments?", a: "Yes, via NFC." }]
  },
  {
    name: 'Pulse Active Fitness Band',
    price: 79.99,
    sellPrice: null,
    description: 'An ultra-lightweight fitness tracker that provides accurate metrics for over 50 sports, perfect for the dedicated athlete.',
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=2070&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=2070&auto=format&fit=crop'],
    category: 'Wearables',
    stock: 150,
    keypoints: ["1.4-inch AMOLED display", "50+ sports modes", "Sleep quality scoring", "Lightweight design (18g)", "10-day battery"],
    variations: [{ name: "Color", options: ["Onyx Black", "Coral Pink", "Mint Green"] }],
    longDescription: "<h1>Your Personal Coach</h1><p>Keep track of every step, run, and swim with the Pulse Active. Its unobtrusive design ensures it never gets in the way of your workout.</p>",
    faq: [{ q: "Does it require a smartphone?", a: "You need a smartphone for the initial setup and detailed data analysis via the companion app." }]
  },
  {
    name: 'Aero XR Smart Glasses',
    price: 599.00,
    sellPrice: null,
    description: 'Augmented reality smart glasses that project a 120-inch virtual screen before your eyes for immersive media consumption.',
    image: 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?q=80&w=2040&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1573455494060-c5595004fb6c?q=80&w=2040&auto=format&fit=crop'],
    category: 'Wearables',
    stock: 0, // OUT OF STOCK TEST
    keypoints: ["Micro-OLED dual displays", "120-inch virtual screen equivalent", "Built-in directional speakers", "USB-C DisplayPort support"],
    variations: [{ name: "Frame Style", options: ["Wayfarer", "Aviator"] }],
    longDescription: "<h1>A Theater on Your Face</h1><p>Experience movies and gaming like never before. The Aero XR glasses plug directly into your smartphone or console and project a massive, crisp virtual display directly into your field of vision.</p>",
    faq: [{ q: "Are they heavy?", a: "No, they weigh only 79 grams and are comfortable for hours of use." }]
  },
  {
    name: 'Titanium Smart Ring',
    price: 299.00,
    sellPrice: 275.00,
    description: 'Discreet, highly accurate health tracking packed into a sleek aerospace-grade titanium ring.',
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2009&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2009&auto=format&fit=crop'],
    category: 'Wearables',
    stock: 35,
    keypoints: ["Aerospace-grade titanium", "Advanced sleep tracking", "Temperature sensors", "7-day battery life"],
    variations: [{ name: "Finish", options: ["Silver", "Stealth Black", "Gold"] }, { name: "Size", options: ["Size 8", "Size 9", "Size 10", "Size 11"] }],
    longDescription: "<h1>Invisibly Smart</h1><p>Don't like wearing watches to bed? The Titanium Smart Ring provides clinical-grade sleep and recovery metrics from your finger, offering more accurate pulse readings than wrist-based trackers.</p>",
    faq: [{ q: "How do I know my size?", a: "We recommend visiting a local jeweler to confirm your standard US ring size before ordering." }]
  },

  // FURNITURE (4)
  {
    name: 'ErgoPro Executive Desk Chair',
    price: 349.00,
    sellPrice: 299.00,
    description: 'Designed for ultimate comfort during long work sessions, featuring dynamic lumbar support, breathable mesh, and 4D armrests.',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2069&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965&auto=format&fit=crop'
    ],
    category: 'Furniture',
    stock: 12,
    keypoints: ["Dynamic auto-adjusting lumbar support", "Premium breathable Korean mesh", "4D adjustable armrests", "Aluminum alloy base", "Weight capacity: 300 lbs"],
    variations: [{ name: "Color", options: ["Graphite Black", "Ash Grey", "Navy Blue"] }],
    longDescription: "<h1>Sit Better, Work Better</h1><p>Say goodbye to back pain. The ErgoPro Executive chair adapts to your movements, providing continuous support whether you are leaning forward to type or reclining to take a call. The high-tension mesh prevents heat buildup.</p><h2>Fully Customizable Fit</h2><p>With 11 points of adjustment, you can tailor this chair to perfectly fit your unique body geometry.</p>",
    faq: [{ q: "Does it come assembled?", a: "It requires minimal assembly (about 15 minutes). Tools are included." }]
  },
  {
    name: 'Apex Standing Desk',
    price: 499.00,
    sellPrice: 449.00,
    description: 'A dual-motor electric standing desk with a solid wood top and memory presets for seamless transitions between sitting and standing.',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=2070&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=2070&auto=format&fit=crop'],
    category: 'Furniture',
    stock: 8,
    keypoints: ["Dual electric motors", "Solid bamboo or walnut top", "4 programmable height presets", "Anti-collision technology", "Supports up to 220 lbs"],
    variations: [{ name: "Wood Type", options: ["Bamboo", "Walnut", "Oak"] }, { name: "Size", options: ["48-inch", "60-inch"] }],
    longDescription: "<h1>Elevate Your Workspace</h1><p>Transition seamlessly from sitting to standing with the push of a button. The Apex Standing Desk features whisper-quiet dual motors and a rock-solid steel frame to ensure absolute stability even at its highest setting.</p>",
    faq: [{ q: "Is the wood sustainably sourced?", a: "Yes, our bamboo tops are 100% sustainable and FSC certified." }]
  },
  {
    name: 'Nordic Lounge Sofa',
    price: 899.00,
    sellPrice: null,
    description: 'A minimalist 3-seater sofa inspired by Scandinavian design, featuring premium linen upholstery and solid oak legs.',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop'],
    category: 'Furniture',
    stock: 4,
    keypoints: ["Premium Linen blend upholstery", "High-density foam cushions", "Solid kiln-dried oak frame", "Seats 3 comfortably"],
    variations: [{ name: "Color", options: ["Oatmeal", "Charcoal", "Olive"] }],
    longDescription: "<h1>Timeless Comfort</h1><p>The Nordic Lounge Sofa brings understated elegance to any living room. The deep seats and high-density foam offer sink-in comfort that retains its shape over years of use.</p>",
    faq: [{ q: "Are the cushion covers washable?", a: "The seat and back cushion covers are removable and machine washable on a gentle, cold cycle." }]
  },
  {
    name: 'Aura Ambient Floor Lamp',
    price: 129.99,
    sellPrice: null,
    description: 'A sleek, minimalist LED floor lamp that bathes your room in customizable, diffused RGB light.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2070&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2070&auto=format&fit=crop'],
    category: 'Furniture',
    stock: 22,
    keypoints: ["16 million colors", "Dimmable via smartphone app", "Corner-fit minimalist design", "Syncs with music"],
    variations: [{ name: "Finish", options: ["Black", "White"] }],
    longDescription: "<h1>Paint Your Room With Light</h1><p>Designed to fit perfectly into the corner of your room, the Aura Ambient lamp reflects light off your walls to create a stunning, atmospheric glow without taking up floor space.</p>",
    faq: []
  },

  // PHOTOGRAPHY (4)
  {
    name: 'Lumina X1 Mirrorless Camera',
    price: 1499.00,
    sellPrice: 1399.00,
    description: 'A professional-grade full-frame mirrorless camera offering 45 Megapixels, 8K video recording, and advanced subject tracking autofocus.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Photography',
    stock: 5,
    keypoints: ["45MP Full-Frame CMOS Sensor", "8K RAW Video Recording", "In-Body Image Stabilization (IBIS)", "AI-driven Autofocus", "Weather-sealed alloy body"],
    variations: [{ name: "Kit", options: ["Body Only", "With 24-70mm f/2.8 Lens"] }],
    longDescription: "<h1>The Ultimate Creative Tool</h1><p>Whether you are shooting high-fashion portraits or cinematic documentaries, the Lumina X1 delivers uncompromising image quality. Its revolutionary autofocus system locks onto eyes, faces, and animals with terrifying precision.</p><h2>Robust and Reliable</h2><p>Constructed from magnesium alloy and heavily weather-sealed, it is built to withstand the harshest shooting conditions.</p>",
    faq: [{ q: "Does it overheat during 8K recording?", a: "It can record 8K video continuously for up to 45 minutes before thermal limits are reached at room temperature." }]
  },
  {
    name: 'Prime 50mm f/1.4 Lens',
    price: 599.00,
    sellPrice: null,
    description: 'The essential "nifty fifty" prime lens, featuring an ultra-fast f/1.4 aperture for stunning bokeh and low-light performance.',
    image: 'https://images.unsplash.com/photo-1617005082833-1eb58574108c?q=80&w=1964&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1617005082833-1eb58574108c?q=80&w=1964&auto=format&fit=crop'],
    category: 'Photography',
    stock: 14,
    keypoints: ["f/1.4 maximum aperture", "9-blade circular aperture diaphragm", "Nano AR Coating", "Silent autofocus motor"],
    variations: [{ name: "Mount", options: ["Sony E", "Canon RF", "Nikon Z"] }],
    longDescription: "<h1>The Storyteller's Lens</h1><p>Render your subjects with razor-sharp clarity against beautifully blurred backgrounds. This 50mm lens is a must-have for portraits, street photography, and low-light environments.</p>",
    faq: [{ q: "Does it have optical stabilization?", a: "No, this lens relies on your camera's In-Body Image Stabilization (IBIS)." }]
  },
  {
    name: 'Aero Drone Pro',
    price: 899.00,
    sellPrice: 849.00,
    description: 'A compact, foldable drone featuring a Hasselblad camera, omnidirectional obstacle sensing, and 45 minutes of flight time.',
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=2070&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=2070&auto=format&fit=crop'],
    category: 'Photography',
    stock: 10,
    keypoints: ["20MP 1-inch CMOS Sensor", "5.4K/30fps Video", "Omnidirectional Obstacle Sensing", "12km Video Transmission", "45-minute flight time"],
    variations: [{ name: "Package", options: ["Standard", "Fly More Combo (3 Batteries)"] }],
    longDescription: "<h1>Capture The World From Above</h1><p>The Aero Drone Pro puts professional aerial cinematography in a backpack-friendly form factor. Master shots feature automates complex flight paths so you can focus on directing.</p>",
    faq: [{ q: "Do I need a license to fly this?", a: "It weighs over 250g, so registration with local aviation authorities (like the FAA) is required in many countries." }]
  },
  {
    name: 'Carbon Fiber Tripod',
    price: 199.00,
    sellPrice: null,
    description: 'An ultra-light, extremely rigid carbon fiber tripod with a 360-degree panoramic ball head. Folds down to just 15 inches.',
    image: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=1964&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=1964&auto=format&fit=crop'],
    category: 'Photography',
    stock: 25,
    keypoints: ["10-layer carbon fiber tubes", "Folds to 15.3 inches", "Max height of 62 inches", "Load capacity: 22 lbs", "Arca-Swiss compatible ball head"],
    variations: [],
    longDescription: "<h1>The Traveler's Best Friend</h1><p>Don't let a heavy tripod weigh you down on your hikes. This carbon fiber tripod provides rock-solid stability for long exposures in windy conditions, while remaining incredibly light to carry.</p>",
    faq: []
  },

  // ACCESSORIES (4)
  {
    name: 'Nexus Mechanical Keyboard',
    price: 149.99,
    sellPrice: 119.99,
    description: 'A premium wireless mechanical keyboard with tactile switches, PBT keycaps, and a stunning solid aluminum chassis.',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop'
    ],
    category: 'Accessories',
    stock: 32,
    keypoints: ["Hot-swappable tactile switches", "Tri-mode (Bluetooth, 2.4GHz, USB-C)", "Double-shot PBT keycaps", "Mac/Windows compatible", "Customizable RGB"],
    variations: [{ name: "Switch Type", options: ["Tactile (Brown)", "Linear (Red)", "Clicky (Blue)"] }, { name: "Layout", options: ["75%", "100% Full Size"] }],
    longDescription: "<h1>The Ultimate Typing Experience</h1><p>Every keystroke feels incredibly satisfying. The hot-swappable PCB allows you to change switches without soldering, making it the perfect gateway into the world of custom keyboards.</p>",
    faq: [{ q: "How long does the battery last on wireless?", a: "Up to 72 hours with RGB on, and over 200 hours with RGB off." }]
  },
  {
    name: 'Nomad Premium Leather Wallet',
    price: 65.00,
    sellPrice: null,
    description: 'A handcrafted, minimalist front-pocket wallet made from full-grain Horween leather that develops a beautiful patina over time.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=2000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=2000&auto=format&fit=crop'],
    category: 'Accessories',
    stock: 80,
    keypoints: ["Full-grain Horween leather", "Holds up to 8 cards and cash", "RFID-blocking inner layer", "Hand-stitched durability"],
    variations: [{ name: "Color", options: ["Rustic Brown", "Midnight Black", "English Tan"] }],
    longDescription: "<h1>A Wallet That Ages With You</h1><p>Crafted in the USA from premium leather sourced from one of the oldest tanneries in the country. This wallet will mold to your pocket and develop a rich patina that tells the story of your travels.</p>",
    faq: []
  },
  {
    name: 'Aero Wireless Gaming Mouse',
    price: 89.99,
    sellPrice: 69.99,
    description: 'An ultra-lightweight 60-gram wireless mouse featuring a flawless 25K DPI sensor and PTFE glide skates for precision tracking.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2067&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2067&auto=format&fit=crop'],
    category: 'Accessories',
    stock: 40,
    keypoints: ["60g ultra-lightweight design", "25,000 max DPI sensor", "Optical switches (0.2ms response)", "Virgin-grade PTFE feet"],
    variations: [{ name: "Color", options: ["Matte Black", "Matte White"] }],
    longDescription: "<h1>Speed and Precision</h1><p>Dominate your competitive matches. By stripping away unnecessary weight and utilizing lightning-fast optical switches, the Aero mouse translates your reflexes into in-game actions with zero lag.</p>",
    faq: [{ q: "Is the battery rechargeable?", a: "Yes, via the included paracord USB-C cable. You can use it while it charges." }]
  },
  {
    name: 'Hydro Thermal Flask',
    price: 34.99,
    sellPrice: null,
    description: 'A 32oz double-wall vacuum insulated stainless steel water bottle that keeps beverages ice cold for 24 hours.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1974&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1974&auto=format&fit=crop'],
    category: 'Accessories',
    stock: 120,
    keypoints: ["18/8 Pro-Grade Stainless Steel", "Double-wall vacuum insulation", "Sweat-free powder coat finish", "BPA-Free"],
    variations: [{ name: "Color", options: ["Ocean Blue", "Forest Green", "Lava Red", "Graphite"] }],
    longDescription: "<h1>Hydration on the Go</h1><p>Whether you're hiking a mountain or sitting at a desk, the Hydro Thermal Flask ensures your water stays perfectly chilled. The proprietary powder coat prevents condensation, keeping your hands and bag dry.</p>",
    faq: [{ q: "Is it dishwasher safe?", a: "Yes, the flask and lid are top-rack dishwasher safe." }]
  }
];

module.exports = { categories, products };
