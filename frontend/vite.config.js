import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      srcDir: "src",
      filename: "sw.js",
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "logo.png",
        "logo-512.png",
        "screenshots/desktop.png",
        "screenshots/mobile.png",
      ],
      manifest: false, // 👈 We’re using our own manifest.json in public/
      workbox: {
         globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json,webp}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-webfonts" },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "local-images",
              expiration: { maxEntries: 50 },
            },
          },
          // 🟢 General rule for ANY external image
          {
            urlPattern: /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp|ico)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "external-images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: { cacheName: "pages" },
          },
        ],
      },
    }),
  ],
});
