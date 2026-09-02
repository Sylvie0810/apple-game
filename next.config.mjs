/**
 * GitHub Pages 는 정적 파일만 서빙한다 → output: 'export'.
 * 저장소 이름이 붙은 하위 경로(https://<user>.github.io/<repo>/)로 열리므로
 * basePath 를 환경변수로 받는다. 로컬 개발에서는 비워둔다.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
