import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import solidPlugin from 'vite-plugin-solid';

// @ts-ignore
import { version } from './package.json';

export default defineConfig({
    server: { port: 8080 },
    plugins: [
        solidPlugin(),
        VitePWA({
            workbox: {
                sourcemap: true
            },
            includeAssets: ['fonts/*'],
            manifest: {
                // @ts-ignore
                version,
                manifest_version: 2,
                name: 'MicroTube',
                short_name: 'MicroTube',
                theme_color: '#191919',
                background_color: '#191919',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                icons: [
                    {
                        src: '/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ]
});
