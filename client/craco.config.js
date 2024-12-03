const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Allow imports from outside src/
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => !plugin.constructor.name === 'ModuleScopePlugin'
      );

      // Add path aliases
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material'),
        '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material'),
        '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
      };

      // Add proper character encoding
      webpackConfig.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        ],
        exclude: /node_modules/
      });

      // Ignore source map warnings
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /Module Warning/
      ];

      return webpackConfig;
    },
  },
}; 