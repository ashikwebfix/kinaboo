import "../index.css";
import "../App.css";
import ClientLayout from '../components/ClientLayout';

export async function generateMetadata() {
  let favicon = "/favicon.svg";
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/settings/general_settings`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.favicon) {
        favicon = data.favicon;
      }
    }
  } catch(e) {}

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kinaboo.com'),
    title: "Kinaboo",
    description: "Your trusted online shopping partner",
    icons: {
      icon: favicon,
      apple: favicon,
    },
    openGraph: {
      title: "Kinaboo",
      description: "Your trusted online shopping partner",
      url: "/",
      siteName: "Kinaboo",
      images: [
        {
          url: favicon,
          width: 800,
          height: 600,
        }
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Kinaboo",
      description: "Your trusted online shopping partner",
      images: [favicon],
    }
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
