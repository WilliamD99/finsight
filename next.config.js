const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  swSrc: "public/service-worker.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plaid-merchant-logos.plaid.com",
        port: "",
        search: "",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
