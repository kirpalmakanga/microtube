module.exports = {
    entry: ['src/registerServiceWorker', 'src/index'],
    output: {
        html: {
            title: 'Microtube'
        }
    },
    devServer: {
        port: 8080
    },
    plugins: [
        {
            resolve: '@poi/plugin-pwa'
        },
        // {
        //     resolve: '@poi/plugin-typescript'
        // },
        {
            resolve: '@poi/bundle-report'
        }
    ]
};
