import "../index.css";
import "../App.css";
import ClientLayout from '../components/ClientLayout';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kinaboo.com'),
  title: "Kinaboo",
  description: "Your trusted online shopping partner",
  openGraph: {
    title: "Kinaboo",
    description: "Your trusted online shopping partner",
    url: "/",
    siteName: "Kinaboo",
    images: [
      {
        url: "/favicon.svg",
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
    images: ["/favicon.svg"],
  }
};

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
