// Keeps every /admin page out of Google and other search engines.
export const metadata = {
  title: 'Admin | Learnuz',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminLayout({ children }) {
  return children;
}
