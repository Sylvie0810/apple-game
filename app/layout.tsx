import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '사과게임',
  description: '사과를 합쳐서 10을 만드세요!',
  appleWebApp: { capable: true, title: '사과게임', statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#e4efdc',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div id="root-shell">{children}</div>
      </body>
    </html>
  );
}
