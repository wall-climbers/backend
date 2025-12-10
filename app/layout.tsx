import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Posts API',
  description: 'Backend API for Posts, Comments, and Likes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

