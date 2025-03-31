// next.config.js
const { parsed: localEnv } = require("dotenv").config();
const webpack = require("webpack");

const nextConfig = {
  webpack: (config) => {
    if (localEnv) {
      config.plugins.push(new webpack.DefinePlugin(localEnv));
    }
    return config;
  },
};

module.exports = nextConfig;
