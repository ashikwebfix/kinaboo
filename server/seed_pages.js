const { sequelize } = require('./config/db');
const Page = require('./models/Page');

const seedPages = async () => {
  try {
    await sequelize.sync();
    
    const aboutPage = await Page.findOne({ where: { slug: 'about-us' } });
    if (!aboutPage) {
      await Page.create({
        slug: 'about-us',
        title: 'আমাদের সম্পর্কে',
        sections: [
          {
            type: 'about_hero',
            data: {
              headline: 'আমাদের গল্প',
              subheadline: 'আমাদের লক্ষ্য হলো বাংলাদেশের প্রতিটি ঘরে সেরা মানের ও ট্রেন্ডিং সব পণ্য পৌঁছে দেওয়া। আমরা নিশ্চিত করি সেরা মান, সাশ্রয়ী মূল্য এবং চমৎকার কাস্টমার সার্ভিস।',
              heroImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000',
              storyText: 'kinaboo.com প্রতিষ্ঠিত হয়েছে একটি স্পষ্ট লক্ষ্য নিয়ে: বাংলাদেশের সবচেয়ে বিশ্বস্ত এবং ক্রেতাবান্ধব ই-কমার্স প্ল্যাটফর্ম হওয়া, যেখানে পাওয়া যাবে ট্রেন্ডিং সব প্রোডাক্ট সবচেয়ে সাশ্রয়ী মূল্যে。<br/><br/>আমরা ক্রেতাদের চাহিদা খুব ভালোভাবে বুঝি। তাই সেরা প্রস্তুতকারকদের থেকে সরাসরি সংগ্রহ করে আমরা মানসম্মত প্রোডাক্ট পৌঁছে দিচ্ছি সারা দেশে।',
              stat1Value: '10k+',
              stat1Label: 'সন্তুষ্ট গ্রাহক',
              stat2Value: '5+',
              stat2Label: 'বছরের অভিজ্ঞতা',
              stat3Value: '100%',
              stat3Label: 'গ্রাহক সন্তুষ্টি',
              stat4Value: '24/7',
              stat4Label: 'সাপোর্ট সুবিধা'
            }
          }
        ]
      });
      console.log('Seeded about-us');
    }

    const contactPage = await Page.findOne({ where: { slug: 'contact-us' } });
    if (!contactPage) {
      // Also check 'contact' just in case
      const c2 = await Page.findOne({ where: { slug: 'contact' } });
      if (!c2) {
        await Page.create({
          slug: 'contact',
          title: 'যোগাযোগ',
          sections: [
            {
              type: 'contact_form',
              data: {
                title: 'যোগাযোগ করুন',
                subtitle: 'যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন। আমাদের সাপোর্ট টিম সবসময় প্রস্তুত আপনাকে সাহায্য করতে।',
                address: 'বাড়ী নং ১২, রোড নং ৫, ধানমন্ডি, ঢাকা-১২০৯',
                phone: '+880 1712 345 678',
                phone2: '+880 1912 345 678',
                email: 'support@kinaboo.com'
              }
            }
          ]
        });
        console.log('Seeded contact');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding pages:', error);
    process.exit(1);
  }
};

seedPages();
