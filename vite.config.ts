// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    plugins: [
      {
        name: 'mock-server',
        enforce: 'pre',
        resolveId(source, importer, options) {
          if (!options?.ssr && (source === 'better-sqlite3' || source === 'drizzle-orm/better-sqlite3')) {
            return { id: '\0mock-server', moduleSideEffects: false };
          }
        },
        load(id) {
          if (id === '\0mock-server') {
            return `
              export default function Database() { throw new Error("Client DB"); };
              export const drizzle = () => ({});
            `;
          }
        }
      }
    ],
    optimizeDeps: {
      exclude: ['better-sqlite3', 'firebase-admin', 'drizzle-orm/better-sqlite3']
    }
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: 'cloudflare-pages'
  },
});
