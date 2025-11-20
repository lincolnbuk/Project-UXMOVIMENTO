const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// Construção do resolver com patterns robustos
// Usar padrões simples com barra para evitar criação de character classes problemáticas
const cxxIgnorePatterns = exclusionList([
  /\/\.cxx\//,
  /node_modules\/react-native-screens\/android\/\.cxx\//,
]);

// Mescla a configuração padrão com nossas regras.
const baseConfig = getDefaultConfig(__dirname);
module.exports = mergeConfig(baseConfig, {
  resolver: {
    // Compatibilidade: define ambas as chaves
    blacklistRE: cxxIgnorePatterns,
    blockList: cxxIgnorePatterns,
  },
});
