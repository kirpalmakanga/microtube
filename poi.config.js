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
    constants: {
        $RefreshReg$: () => {},
        $RefreshSig$: () => () => {}
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
