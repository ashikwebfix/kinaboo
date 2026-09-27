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
    
    // Make image URL absolute if it is relative
    if (image && !image.startsWith('http')) {
      const publicBaseUrl = process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith('http') 
        ? process.env.NEXT_PUBLIC_API_URL 
        : 'https://api.kinaboo.com';
      image = `${publicBaseUrl}${image.startsWith('/') ? '' : '/'}${image}`;
    }

    return {
      title: `${blog.title} | kinaboo.com`,
      description: description,
      openGraph: {
        title: `${blog.title} | kinaboo.com`,
        description: description,
        images: image ? [image] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${blog.title} | kinaboo.com`,
        description: description,
        images: image ? [image] : [],
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
