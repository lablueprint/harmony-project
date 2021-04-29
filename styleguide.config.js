module.exports = {
    title: "LA Blueprint - Harmony Project",
    components: './src/**/**/[A-Z]*.js', 
    webpackConfig: {
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader','css-loader'],
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
                    type: 'asset',
                },
    
                // Add your rules for custom modules here
                // Learn more about loaders from https://webpack.js.org/loaders/
            ],
        },
    }
  }