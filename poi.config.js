const { IgnorePlugin } = require('webpack');
const OfflinePlugin = require('offline-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        html: {
            title: 'Microtube'
        }
    },
    devServer: { port: 8080 },
    chainWebpack(config) {
        config
            .plugin('ignore-moment-locales')
            .use(IgnorePlugin, [/^\.\/locale$/, /moment$/]);

        if (process.env.NODE_ENV === 'production') {
            config.plugin('offline').use(OfflinePlugin, [
                {
                    excludes: ['**/*.map', './_redirects'],
                    updateStrategy: 'changed',
                    autoUpdate: 1000 * 60 * 2,
                    ServiceWorker: {
                        events: true,
                        navigateFallbackURL: '/'
                    },
                    cacheMaps: [
                        {
                            match: /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/,
                            to: '/',
                            requestTypes: ['navigate', 'same-origin']
                        }
                    ]
                }
            ]);
        }
    }
};
