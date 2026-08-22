const { connectDB } = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');

const fixHttpUrls = async () => {
  await connectDB();
  console.log('Fixing HTTP URLs to HTTPS...');

  try {
    const products = await Product.findAll();
    for (const product of products) {
      let changed = false;

      // Fix main image
      if (product.image && product.image.includes('http://api.kinaboo.com')) {
        product.image = product.image.replace('http://', 'https://');
        changed = true;
      }

      // Fix images array
      if (product.images && product.images.length > 0) {
        const newImages = product.images.map(img => {
          if (img.includes('http://api.kinaboo.com')) {
            changed = true;
            return img.replace('http://', 'https://');
          }
          return img;
        });
        if (changed) {
          product.images = newImages;
        }
      }

      // Fix description
      if (product.description && product.description.includes('http://api.kinaboo.com')) {
        product.description = product.description.replace(/http:\/\/api\.kinaboo\.com/g, 'https://api.kinaboo.com');
        changed = true;
      }
      
      // Fix longDescription
      if (product.longDescription && product.longDescription.includes('http://api.kinaboo.com')) {
        product.longDescription = product.longDescription.replace(/http:\/\/api\.kinaboo\.com/g, 'https://api.kinaboo.com');
        changed = true;
      }

      if (changed) {
        await product.save();
        console.log(`Updated Product: ${product.name}`);
      }
    }

    const categories = await Category.findAll();
    for (const category of categories) {
      if (category.image && category.image.includes('http://api.kinaboo.com')) {
        category.image = category.image.replace('http://', 'https://');
        await category.save();
        console.log(`Updated Category: ${category.name}`);
      }
    }

    console.log('Fix complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing URLs:', error);
    process.exit(1);
  }
};

fixHttpUrls();
