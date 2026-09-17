const { sequelize } = require('./config/db');
const Product = require('./models/Product');

const updateLumina = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const lumina = await Product.findOne({ where: { name: 'Lumina X1 Mirrorless Camera' } });
    
    if (!lumina) {
      console.log('Lumina X1 not found in DB!');
      process.exit(1);
    }

    const reviews = [
      { name: "Alex R.", rating: 5, comment: "Incredible 8K video quality. Worth every penny for professional work.", date: "2024-05-12" },
      { name: "Sarah T.", rating: 5, comment: "The autofocus on this thing is alien technology. It NEVER misses the eye.", date: "2024-04-20" },
      { name: "Michael K.", rating: 4, comment: "Great camera, but the battery drains relatively quickly when shooting 8K.", date: "2024-03-15" },
      { name: "Jessica W.", rating: 5, comment: "Upgraded from my old DSLR and I am blown away. The dynamic range is fantastic.", date: "2024-06-02" },
      { name: "David L.", rating: 5, comment: "The build quality feels like a tank. Very comfortable to hold all day.", date: "2024-05-28" },
      { name: "Emily C.", rating: 4, comment: "Love the image quality. CFexpress cards are expensive though, keep that in mind.", date: "2024-02-10" },
      { name: "Tom H.", rating: 5, comment: "Best mirrorless camera for hybrid shooters. Hands down.", date: "2024-07-11" },
      { name: "Rebecca N.", rating: 5, comment: "Colors straight out of camera are beautiful. Less time grading, more time shooting.", date: "2024-01-22" },
      { name: "Chris P.", rating: 4, comment: "Amazing tech. Menus take some getting used to if you're coming from another brand.", date: "2024-06-18" },
      { name: "Daniel V.", rating: 5, comment: "The IBIS is so good I can shoot handheld at 1/5s and still get sharp photos.", date: "2024-07-05" }
    ];

    const faq = [
      { q: "Does it overheat during 8K recording?", a: "It can record 8K video continuously for up to 45 minutes before thermal limits are reached at room temperature." },
      { q: "What memory cards does it use?", a: "It has dual card slots: one for CFexpress Type B and one for UHS-II SD cards." },
      { q: "Is the body weather-sealed?", a: "Yes, the magnesium alloy body is extensively weather-sealed against dust and moisture." },
      { q: "Does it come with a battery and charger?", a: "Yes, the box includes one LP-X high-capacity battery and a rapid wall charger." },
      { q: "What is the continuous shooting speed?", a: "It can shoot up to 20 fps with the electronic shutter and 12 fps with the mechanical shutter." },
      { q: "Can I use my old DSLR lenses on this?", a: "Yes, you can use older lenses via an official mount adapter (sold separately) with full autofocus support." },
      { q: "Is there a recording limit for 4K video?", a: "No, 4K recording is unlimited, subject to battery and memory card capacity." }
    ];

    const description = "A professional-grade full-frame mirrorless camera offering 45 Megapixels, 8K video recording, and advanced subject tracking autofocus. Perfect for hybrid shooters who demand the best in both photography and videography.";

    const longDescription = `<h1>The Ultimate Creative Tool</h1>
<p>Whether you are shooting high-fashion portraits or cinematic documentaries, the Lumina X1 delivers uncompromising image quality. Its revolutionary autofocus system locks onto eyes, faces, and animals with terrifying precision.</p>
<h2>Robust and Reliable</h2>
<p>Constructed from magnesium alloy and heavily weather-sealed, it is built to withstand the harshest shooting conditions.</p>
<h2>Unmatched 8K Video</h2>
<p>Record stunning 8K RAW video internally. The immense resolution gives you unparalleled flexibility in post-production, allowing you to crop, pan, and zoom without losing 4K detail.</p>
<h2>Next-Gen Image Stabilization</h2>
<p>The 5-axis In-Body Image Stabilization works in tandem with stabilized lenses to provide up to 8 stops of shake correction, making handheld low-light shooting a breeze.</p>`;

    const youtubeReels = [
      "https://youtube.com/shorts/dQw4w9WgXcQ",
      "https://youtube.com/shorts/3jz4b4gT26A",
      "https://youtube.com/shorts/L_jWHffIx5E",
      "https://youtube.com/shorts/tpeZd9235v0",
      "https://youtube.com/shorts/fJ9rUzIMcZQ",
      "https://youtube.com/shorts/kJQP7kiw5Fk",
      "https://youtube.com/shorts/JGwWNGJdvx8",
      "https://youtube.com/shorts/YQHsXMglC9A",
      "https://youtube.com/shorts/Zi_XLOBDo_Y",
      "https://youtube.com/shorts/RgKAFK5djSk"
    ];

    lumina.reviews = reviews;
    lumina.faq = faq;
    lumina.description = description;
    lumina.longDescription = longDescription;
    lumina.youtubeReels = youtubeReels;

    await lumina.save();

    console.log('Successfully updated Lumina X1!');
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateLumina();
