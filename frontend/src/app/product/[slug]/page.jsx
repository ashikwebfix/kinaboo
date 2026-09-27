import View from '../../../views/ProductDetails';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:6710';
  
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error('generateMetadata fetch failed with status:', res.status, res.statusText);
      throw new Error('Failed to fetch product');
    }
    const product = await res.json();
    console.log('generateMetadata fetched product:', product.name);
    
    // Strip HTML from description for excerpt
    const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';
    const cleanDesc = stripHtml(product.description);
    const description = cleanDesc.length > 200 ? cleanDesc.substring(0, 200) + '...' : cleanDesc;
    
    let image = product.image;
    if (product.images && product.images.length > 0) image = product.images[0];
    
    // Extract the local path for the image (e.g. /uploads/...)
    let imagePath = image;
    if (imagePath && imagePath.startsWith('http')) {
      try {
        imagePath = new URL(imagePath).pathname;
      } catch(e) {}
    }
    if (imagePath && !imagePath.startsWith('/')) {
      imagePath = '/' + imagePath;
    }
    
    let ogImages = [];
    if (imagePath) {
      // Use Next.js image optimizer to ensure Facebook can read avif/webp as standard formats,
      // and provide explicitly set dimensions for first-time scrapes.
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinaboo.com';
      const optimizedImageUrl = `${siteUrl}/_next/image?url=${encodeURIComponent(imagePath)}&w=1200&q=75`;
      ogImages = [
        {
          url: optimizedImageUrl,
          width: 1200,
          height: 1200, // Or 630 depending on aspect ratio, but Facebook handles square/rectangle well if dimensions are provided.
          alt: product.name,
        }
      ];
    }

    return {
      title: `${product.name} | kinaboo.com`,
      description: description,
      openGraph: {
        title: `${product.name} | kinaboo.com`,
        description: description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kinaboo.com'}/product/${slug}`,
        images: ogImages,
        type: 'website',
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | kinaboo.com`,
        description: description,
        images: ogImages.map(img => img.url),
      }
    };
  } catch (error) {
    console.error('generateMetadata error:', error);
    return {
      title: 'Product | kinaboo.com',
    };
  }
}

export default function Page() {
  return <View />;
}
