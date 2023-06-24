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
    NEXT_PUBLIC_APP_ID: "app_staging_c404bb426fd69bf4081ccd50441dcad8",
    NEXT_PUBLIC_CONTRACT_ADDR: "0x719683F13Eeea7D84fCBa5d7d17Bf82e03E3d260",
  },
};

module.exports = nextConfig;
