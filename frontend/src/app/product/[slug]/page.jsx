import View from '../../../views/ProductDetails';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:6710';
  
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch product');
    const product = await res.json();
    
    // Strip HTML from description for excerpt
    const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';
    const cleanDesc = stripHtml(product.description);
    const description = cleanDesc.length > 200 ? cleanDesc.substring(0, 200) + '...' : cleanDesc;
    
    let image = product.image;
    if (product.images && product.images.length > 0) image = product.images[0];
    
    // Make image URL absolute if it is relative
    if (image && !image.startsWith('http')) {
      image = `${API_URL}${image.startsWith('/') ? '' : '/'}${image}`;
    }

    return {
      title: `${product.name} | kinaboo.com`,
      description: description,
      openGraph: {
        title: `${product.name} | kinaboo.com`,
        description: description,
        images: image ? [image] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | kinaboo.com`,
        description: description,
        images: image ? [image] : [],
      }
    };
  } catch (error) {
    return {
      title: 'Product | kinaboo.com',
    };
  }
}

export default function Page() {
  return <View />;
}
