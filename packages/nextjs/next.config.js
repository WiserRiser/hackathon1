// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  env: {
    NEXT_PUBLIC_WLD_APP_ID: "app_staging_80708403a9320affd6a0da7efef222c3",
    NEXT_PUBLIC_WLD_ACTION_NAME: "verify_mod",
    REACT_APP_VERIFICATION_SERVER_LOCAL_HOST_URL: "http://localhost:8080",
    REACT_APP_VERIFICATION_SERVER_PUBLIC_URL: "http://localhost:8080",
  },
};

module.exports = nextConfig;
