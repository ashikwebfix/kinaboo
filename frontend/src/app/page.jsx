import View from '../views/Home';

export const metadata = {
  title: "Home | kinaboo.com",
  description: "পছন্দের পণ্য বেছে নিন, হাতে পেয়ে টাকা দিন।",
  openGraph: {
    title: "Home | kinaboo.com",
    description: "পছন্দের পণ্য বেছে নিন, হাতে পেয়ে টাকা দিন।",
    url: "/",
    siteName: "kinaboo.com",
    images: [
      {
        url: "/favicon.svg",
        width: 800,
        height: 600,
      }
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | kinaboo.com",
    description: "পছন্দের পণ্য বেছে নিন, হাতে পেয়ে টাকা দিন।",
    images: ["/favicon.svg"],
  }
};

export default function Page() {
  return <View />;
}
