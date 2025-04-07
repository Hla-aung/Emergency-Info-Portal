const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

const createNextIntlPlugin = require("next-intl/plugin");

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {};
  const withNextIntl = createNextIntlPlugin();
  if (phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import("@serwist/next")).default({
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
    });
    return withNextIntl(withSerwist(nextConfig));
  }

  return withNextIntl(nextConfig);
};
