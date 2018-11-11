const { IgnorePlugin, HotModuleReplacementPlugin } = require('webpack');

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

        // config.plugin('hot').use(HotModuleReplacementPlugin);
    }
};
