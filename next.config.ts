/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: false, // disables Turbopack
  images: {
    domains: ["picsum.photos"],
  },
};

module.exports = nextConfig;