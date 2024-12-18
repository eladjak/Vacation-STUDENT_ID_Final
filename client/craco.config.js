/**
 * CRACO (Create React App Configuration Override) Configuration
 * 
 * Extends Create React App's webpack configuration without ejecting
 * Features:
 * - Custom webpack configuration
 * - Path aliases
 * - Babel configuration
 * - Character encoding
 * - Warning suppression
 * - Module resolution
 */

const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Allow imports from outside src directory
      // Removes ModuleScopePlugin restriction
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => !plugin.constructor.name === 'ModuleScopePlugin'
      );

      // Configure path aliases for better module resolution
      // Ensures consistent package versions and prevents duplicate installations
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material'),
        '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material'),
        '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
      };

      // Add Babel loader configuration for proper character encoding
      // and modern JavaScript features support
      webpackConfig.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',      // Modern JavaScript features
                '@babel/preset-react',     // React JSX support
                '@babel/preset-typescript' // TypeScript support
              ],
              plugins: [
                '@babel/plugin-transform-runtime',                  // Async/await support
                '@babel/plugin-transform-private-property-in-object' // Private fields
              ]
            }
          }
        ],
        exclude: /node_modules/
      });

      // Suppress common development warnings
      // that don't affect the build quality
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /Module Warning/
      ];

      return webpackConfig;
    },
  },
}; 