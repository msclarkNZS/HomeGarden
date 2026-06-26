import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Relative base so the built site works whether it's served from the root of a
// domain or from a sub-folder (e.g. GitHub Pages project pages).
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        // Don't precache the live forecast/geocoding calls.
        navigateFallback: "index.html",
      },
      manifest: {
        name: "Lifestyle Block Manager",
        short_name: "Block",
        description: "Plan and track a lifestyle block — garden, orchard, livestock and more.",
        theme_color: "#26412F",
        background_color: "#E9E5D7",
        display: "standalone",
        orientation: "any",
        start_url: "./",
        scope: "./",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      }
    })
  ]
});
