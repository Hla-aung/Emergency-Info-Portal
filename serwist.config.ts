import { injectManifest } from "@serwist/build";
import type { SerwistGlobalConfig } from "serwist";

const config = {
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  globDirectory: ".",
  globPatterns: [
    "**/*.{js,css,html,png,svg,jpg,jpeg,gif,ico,json,woff,woff2,ttf,eot}",
  ],
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
  modifyURLPrefix: {
    "": "/",
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/earthquake\.usgs\.gov\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "earthquake-api",
        networkTimeoutSeconds: 60,
        matchOptions: {
          ignoreSearch: true,
        },
      },
    },
  ],
};

export default config;
