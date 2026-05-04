/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Ensure trailing slashes are handled consistently for static exports
  trailingSlash: true,
};

export default nextConfig;
