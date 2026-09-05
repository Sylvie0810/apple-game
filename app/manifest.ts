import type { MetadataRoute } from 'next';

// 정적 내보내기(output: 'export')에서는 이 선언이 있어야 파일로 떨어진다.
export const dynamic = 'force-static';

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '사과게임',
    short_name: '사과게임',
    description: '사과를 합쳐서 10을 만드세요!',
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#e4efdc',
    theme_color: '#e4efdc',
    icons: [
      { src: `${base}/icon-192.png`, sizes: '192x192', type: 'image/png' },
      { src: `${base}/icon-512.png`, sizes: '512x512', type: 'image/png' },
      { src: `${base}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: `${base}/icon.svg`, sizes: 'any', type: 'image/svg+xml' },
    ],
  };
}
