import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '사과게임',
    short_name: '사과게임',
    description: '사과를 합쳐서 10을 만드세요!',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#e4efdc',
    theme_color: '#e4efdc',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
