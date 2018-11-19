const { IgnorePlugin } = require('webpack');
const OfflinePlugin = require('offline-plugin');

module.exports = {
    entry: './src/index.js',
    port: 8080,
    html: {
        title: 'Microtube'
    },
    transformModules: ['rss-parser'],
    chainWebpack(config) {
        config.resolve.extensions.add('.tsx');

        config
            .plugin('ignore-moment-locales')
            .use(IgnorePlugin, [/^\.\/locale$/, /moment$/]);

        if (process.env.NODE_ENV === 'production') {
            config.plugin('offline').use(OfflinePlugin, [
                {
                    autoUpdate: true,
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
