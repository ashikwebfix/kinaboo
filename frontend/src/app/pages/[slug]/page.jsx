import View from '../../../views/DynamicPage';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:6710';
  
  try {
    const res = await fetch(`${API_URL}/api/pages/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch page');
    const pageData = await res.json();

    return {
      title: `${pageData.title} | kinaboo.com`,
      openGraph: {
        title: `${pageData.title} | kinaboo.com`,
      },
      twitter: {
        title: `${pageData.title} | kinaboo.com`,
      }
    };
  } catch (error) {
    return {
      title: 'Kinaboo',
    };
  }
}

export default function Page() {
  return <View />;
}
