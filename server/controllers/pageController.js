const Page = require('../models/Page');

// @desc    Get all pages
// @route   GET /api/pages
// @access  Public
const getPages = async (req, res) => {
  try {
    const pages = await Page.findAll({ order: [['createdAt', 'DESC']] });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages' });
  }
};

// @desc    Get page by slug
// @route   GET /api/pages/:slug
// @access  Public
const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ where: { slug: req.params.slug, isActive: true } });
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching page' });
  }
};

// @desc    Create a page
// @route   POST /api/pages
// @access  Private/Admin
const createPage = async (req, res) => {
  const { title, slug, sections, isActive } = req.body;

  try {
    const pageExists = await Page.findOne({ where: { slug } });

    if (pageExists) {
      return res.status(400).json({ message: 'Page with this slug already exists' });
    }

    const page = await Page.create({
      title,
      slug,
      sections: sections || [],
      isActive,
    });

    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error creating page' });
  }
};

// @desc    Update a page
// @route   PUT /api/pages/:id
// @access  Private/Admin
const updatePage = async (req, res) => {
  const { title, slug, sections, isActive } = req.body;

  try {
    const page = await Page.findByPk(req.params.id);

    if (page) {
      page.title = title || page.title;
      page.slug = slug || page.slug;
      page.sections = sections !== undefined ? sections : page.sections;
      page.isActive = isActive !== undefined ? isActive : page.isActive;

      await page.save();
      res.json(page);
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating page' });
  }
};

// @desc    Delete a page
// @route   DELETE /api/pages/:id
// @access  Private/Admin
const deletePage = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);

    if (page) {
      await page.destroy();
      res.json({ message: 'Page removed' });
    } else {
      res.status(404).json({ message: 'Page not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page' });
  }
};

// Initialize default pages if empty
const seedDefaultPages = async () => {
  try {
    // Drop table to re-run seed because schema changed. In production we would migrate, but here we can force it since they were just dummy data
    await Page.sync();
    
    const count = await Page.count();
    if (count === 0) {
      const defaultPages = [
        { 
          title: 'অর্ডার ট্র্যাকিং', 
          slug: 'order-tracking', 
          sections: [{ id: '1', type: 'richtext', data: { html: '<h2>অর্ডার ট্র্যাকিং</h2><p>আপনার অর্ডার ট্র্যাক করতে এখানে বিস্তারিত লিখুন।</p>' } }] 
        },
        { 
          title: 'রিটার্ন ও এক্সচেঞ্জ', 
          slug: 'return-exchange', 
          sections: [{ id: '1', type: 'richtext', data: { html: '<h2>রিটার্ন ও এক্সচেঞ্জ পলিসি</h2><p>আমাদের রিটার্ন এবং এক্সচেঞ্জ নীতি এখানে বর্ণনা করুন।</p>' } }] 
        },
        { 
          title: 'শিপিং ইনফো', 
          slug: 'shipping-info', 
          sections: [{ id: '1', type: 'richtext', data: { html: '<h2>শিপিং ইনফরমেশন</h2><p>শিপিং পদ্ধতি এবং সময় সম্পর্কে বিস্তারিত লিখুন।</p>' } }] 
        },
        { 
          title: 'সাধারণ প্রশ্ন (FAQ)', 
          slug: 'faq', 
          sections: [
            { id: '1', type: 'richtext', data: { html: '<h2>সাধারণ প্রশ্ন (FAQ)</h2><p>সচরাচর জিজ্ঞাসিত প্রশ্ন এবং উত্তর নিচে দেওয়া হলো।</p>' } },
            { id: '2', type: 'faq', data: { questions: [{ q: 'কিভাবে অর্ডার করবো?', a: 'ওয়েবসাইট থেকে সরাসরি প্রোডাক্ট সিলেক্ট করে অর্ডার করতে পারবেন।' }] } }
          ] 
        },
        { 
          title: 'প্রাইভেসি পলিসি', 
          slug: 'privacy-policy', 
          sections: [{ id: '1', type: 'richtext', data: { html: '<h2>প্রাইভেসি পলিসি</h2><p>আপনার প্রাইভেসি পলিসি এখানে লিখুন।</p>' } }] 
        },
        {
          title: 'আমাদের সম্পর্কে',
          slug: 'about-us',
          sections: [
            { id: '1', type: 'about_hero', data: { headline: 'কিনাবুর সম্পর্কে জানুন', subheadline: 'আমরা মানসম্মত পণ্য সরবরাহে প্রতিশ্রুতিবদ্ধ', imageUrl: '' } },
            { id: '2', type: 'richtext', data: { html: '<p>আমাদের গল্প এখানে লিখুন...</p>' } }
          ]
        },
        {
          title: 'যোগাযোগ করুন',
          slug: 'contact',
          sections: [
            { id: '1', type: 'contact_form', data: { email: 'support@kinaboo.com', phone: '01354-557477', address: 'Rd 53, Gulshan 2, Dhaka' } }
          ]
        }
      ];
      await Page.bulkCreate(defaultPages);
      console.log('Default dynamic pages seeded.');
    }
  } catch (error) {
    console.error('Error seeding pages:', error);
  }
};

// Call seeder
seedDefaultPages();

module.exports = {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
};
