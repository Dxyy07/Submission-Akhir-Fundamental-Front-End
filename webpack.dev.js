const {
    merge
} = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        watchFiles: ['index.html', 'src/**/*'],
        open : true,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
    },
});