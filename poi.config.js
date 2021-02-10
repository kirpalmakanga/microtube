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
    configureWebpack: {
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        }
    },
    plugins: [
        {
            resolve: '@poi/plugin-pwa'
        },
        {
            resolve: '@poi/bundle-report'
        }
    ]
};
