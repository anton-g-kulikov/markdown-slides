/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Added for static export
  reactStrictMode: true,
  typescript: {
    // Fail the build if there are type errors
    ignoreBuildErrors: false,
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      "YOUR_PROJECT_ID.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      "YOUR_PROJECT_ID.appspot.com",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
    NEXT_PUBLIC_FIREBASE_APP_ID:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
  },

  // Custom domain configuration
  assetPrefix: "",

  webpack: (config, { isServer }) => {
    // Handle ESM packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      };
    }

    return config;
  },
  // Add support for ESM modules
  experimental: {
    // esmExternals: "loose", // Removed based on warning
  },
  // output: "export", // Removed to enable dynamic features and API routes
  // distDir: "out", // Removed as it's related to output: "export"
  // swcMinify: true, // Removed due to "Unrecognized key" error
  images: {
    unoptimized: true, // Added for static export
  },
  // rewrites: () => Promise.resolve([]), // Removed to allow default behavior
};

module.exports = nextConfig;
