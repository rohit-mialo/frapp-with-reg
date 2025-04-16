const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  resolver: {
    assetExts: [...getDefaultConfig(__dirname).resolver.assetExts, 'tflite'], // Add 'tflite' to asset extensions
    extraNodeModules: {
      // Ensures the @tensorflow/tfjs-react-native package is resolved correctly
      '@tensorflow/tfjs-react-native': path.resolve(__dirname, 'node_modules/@tensorflow/tfjs-react-native'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);