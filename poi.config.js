module.exports = {
    entry: './src/index.js',
    output: {
        html: {
            title: 'Microtube'
        }
    },
    devServer: { port: 8080 },
    plugins: [
        {
            resolve: '@poi/plugin-pwa',
            options: {}
        },
        {
            resolve: '@poi/plugin-typescript',
            options: {}
        }
    ]
};
