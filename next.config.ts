// next.config.js or next.config.ts
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  // 기타 설정들...
};

module.exports = withPWA(nextConfig);
