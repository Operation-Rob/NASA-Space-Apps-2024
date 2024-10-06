/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.geojson$/,
      use: 'json-loader',
    });

    return config;
  },
};

export default nextConfig;
