import View from '../../../views/BlogView';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:6710';
  
  try {
    const res = await fetch(`${API_URL}/api/blogs/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch blog');
    const blog = await res.json();
    
    // Strip HTML from content for excerpt
    const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, '') : '';
    const cleanDesc = stripHtml(blog.content);
    const description = cleanDesc.length > 200 ? cleanDesc.substring(0, 200) + '...' : cleanDesc;
    
    let image = blog.image;
    
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
          height: 1200,
          alt: blog.title,
        }
      ];
    }

    return {
      title: `${blog.title} | kinaboo.com`,
      description: description,
      openGraph: {
        title: `${blog.title} | kinaboo.com`,
        description: description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kinaboo.com'}/blog/${slug}`,
        images: ogImages,
        type: 'article',
      },
      twitter: {
        card: "summary_large_image",
        title: `${blog.title} | kinaboo.com`,
        description: description,
        images: ogImages.map(img => img.url),
      }
    };
  } catch (error) {
    return {
      title: 'Blog | kinaboo.com',
    };
  }
}

export default function Page() {
  return <View />;
}
