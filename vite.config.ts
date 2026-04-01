import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Security headers applied in dev server — mirrors vercel.json for production
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  // CSP: allow Firebase SDKs, Google sign-in popup, and self-hosted assets
  'Content-Security-Policy': [
    "default-src 'self'",
    // Firebase Auth & Firestore use WebSocket + HTTPS to googleapis
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com",
    // Scripts: self + inline + Firebase + blob (for workers)
    "script-src 'self' 'unsafe-inline' https://apis.google.com blob:",
    // Workers: self + blob
    "worker-src 'self' blob:",
    // Styles: self + inline + Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Images: self, data URIs, and any HTTPS (for avatar vatar URLs from Google)
    "img-src 'self' data: https:",
    // Fonts: self + Google Fonts
    "font-src 'self' https://fonts.gstatic.com",
    // Google sign-in popup
    "frame-src https://accounts.google.com https://springy-ec53c.firebaseapp.com",
    // No object/embed elements allowed
    "object-src 'none'",
    // Base URI locked to self
    "base-uri 'self'",
    // All form actions locked to self
    "form-action 'self'",
  ].join('; '),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Kron0',
        short_name: 'Kron0',
        description: 'Manage your weekly schedule and focus sessions',
        theme_color: '#0f0f0f',
        background_color: '#0f0f0f',
        display: 'standalone',
        icons: [
          {
            src: 'logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  server: {
    headers: securityHeaders,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // REMOVED react-vendor split to prevent instance duplication and 'null useState' errors in lazy chunks
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'date-fns']
        }
      }
    }
  }
})
