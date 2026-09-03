import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const seoPlugin = () => {
  return {
    name: 'seo-plugin',
    async transformIndexHtml(html, ctx) {
      const currentPath = ctx.originalUrl || ctx.path;
      let title = "Home | kinaboo.com";
      let description = "পছন্দের পণ্য বেছে নিন, হাতে পেয়ে টাকা দিন।";
      let image = "http://localhost:6711/favicon.svg";

      try {
        if (currentPath.startsWith('/product/')) {
          const slug = currentPath.split('/')[2];
          const res = await fetch(`http://127.0.0.1:6710/api/products/${slug}`);
          if (res.ok) {
            const product = await res.json();
            title = `${product.name} | kinaboo.com`;
            const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';
            const cleanDesc = stripHtml(product.description);
            description = cleanDesc.length > 200 ? cleanDesc.substring(0, 200) + '...' : cleanDesc;
            
            let pImage = product.image;
            if (product.images && product.images.length > 0) pImage = product.images[0];
            if (pImage) image = pImage.startsWith('http') ? pImage : `http://127.0.0.1:6710${pImage.startsWith('/') ? '' : '/'}${pImage}`;
          }
        } else if (currentPath === '/categories') {
          title = "Categories | kinaboo.com";
          description = "Explore our wide range of product categories.";
        }
      } catch (e) {
        // Ignore fetch errors during dev
      }

      const ogTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />`;

      return html.replace('<title>পছন্দের পণ্য বেছে নিন | kinaboo.com</title>', '').replace('<!-- SEO_TAGS -->', ogTags);
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPlugin()],
  ssr: {
    noExternal: ['jodit-react', 'jodit', 'leaflet', 'react-leaflet', 'react-quill-new']
  },
  server: {
    port: 6711,
    strictPort: true,
    allowedHosts: [
      '65b6-2406-2d40-2c3f-3308-6d4e-a2a-cf8a-10cd.ngrok-free.app',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:6710',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://127.0.0.1:6710',
        changeOrigin: true
      }
    }
  },
  preview: {
    allowedHosts: true
  }
})
