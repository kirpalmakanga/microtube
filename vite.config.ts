import { defineConfig } from 'vite';
import { VitePWA as pwaPlugin } from 'vite-plugin-pwa';
import solidPlugin from 'vite-plugin-solid';
import windiPlugin from 'vite-plugin-windicss';
// import devTools from 'solid-devtools/vite';

// @ts-ignore
import { version } from './package.json';

export default defineConfig({
    server: {
        port: 8080
    },
    plugins: [
        // devTools(),
        solidPlugin(),
        windiPlugin(),
        pwaPlugin({
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
                theme_color: '#21222c',
                background_color: '#21222c',
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
