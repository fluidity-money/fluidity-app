const webpack = require("webpack")

module.exports = function override(config, _env) {
    config.plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        })
    )
    config.ignoreWarnings = [/Failed to parse source map/]
    return config;
}
