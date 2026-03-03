import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import swc from 'vite-plugin-swc-transform'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'src/core/backend/main.ts',
        vite: {
          plugins: [
            swc({
              swcOptions: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    decorators: true,
                  },
                  transform: {
                    legacyDecorator: true,
                    decoratorMetadata: true,
                    useDefineForClassFields: false,
                  },
                  target: 'es2020',
                },
              },
            }),
          ],
          build: {
            rollupOptions: {
              external: ['better-sqlite3', 'typeorm', 'reflect-metadata', 'electron-updater'],
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'src/core/backend/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: process.env.NODE_ENV === 'test'
        // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
        ? undefined
        : {},
    }),
  ],
})
