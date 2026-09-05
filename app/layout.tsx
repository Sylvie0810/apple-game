import type { Metadata, Viewport } from 'next';
import './globals.css';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
// 카카오톡·아이메시지 같은 링크 미리보기는 절대 URL 만 읽는다.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://super-lebkuchen-795f0a.netlify.app';

const title = '사과게임';
const description = '사과를 합쳐서 10을 만드세요!';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  appleWebApp: { capable: true, title, statusBarStyle: 'default' },
  manifest: `${base}/manifest.webmanifest`,
  icons: {
    icon: [
      { url: `${base}/icon-32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${base}/icon.svg`, type: 'image/svg+xml' },
    ],
    apple: [{ url: `${base}/icon-180.png`, sizes: '180x180', type: 'image/png' }],
    shortcut: [{ url: `${base}/icon-32.png` }],
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: `${siteUrl}${base}/`,
    siteName: title,
    title,
    description,
    images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: '사과게임' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${base}/og-image.png`],
  },
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
