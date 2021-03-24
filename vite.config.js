import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
    server: { port: 8080 },
    esbuild: {
        jsxInject: `import React from 'react'`
    },
    plugins: [
        reactRefresh(),
        VitePWA({
            manifest: {
                name: 'MicroTube',
                short_name: 'MicroTube',
                theme_color: '#191919',
                background_color: '#191919',
                display: 'standalone',
                Scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: '/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ],
                splash_pages: null
            }
        })
    ]
});
