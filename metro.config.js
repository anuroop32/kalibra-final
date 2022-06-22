//Export default configuration
const { getDefaultConfig } = require('expo/metro-config');
//module.exports = getDefaultConfig(__dirname);

//Key variables
const Fs = require('fs');
const BootstrapService = require('@ui-kitten/metro-config/services/bootstrap.service');
const ProjectService = require('@ui-kitten/metro-config/services/project.service');

// Eva Config design mapping
const evaConfig = {
  evaPackage: '@eva-design/eva',
  customMappingPath: './assets/themes/mapping.json',
  watch: process.env.UIKITTENFILEWATCHER === 'true' ? true : false || false
};
const customMappingExists = Fs.existsSync(evaConfig.customMappingPath);
const customMappingPathResolved = ProjectService.default.resolvePath(evaConfig.customMappingPath);

//Initialise on first load
BootstrapService.default.run(evaConfig);

//Add watcher to check for files changing
if (customMappingExists && (evaConfig.watch || evaConfig.watch === undefined)) {
  console.log('File Watcher for UIKitten Customisation Enabled');
  Fs.watchFile(customMappingPathResolved, () => {
    BootstrapService.default.run(evaConfig);
  });
}

//Enable SVG transformation
module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig(__dirname);
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
      resetCache: true
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg']
    }
  };
})();

// const MetroConfig = require('@ui-kitten/metro-config');
// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// const evaConfig = {
//   evaPackage: '@eva-design/eva',
//   customMappingPath: './assets/themes/mapping.json',
//   watch: false /* need to pull this from .env */
// };

// module.exports = MetroConfig.create(evaConfig, {
//   transformer: {
//     babelTransformerPath: require.resolve('react-native-svg-transformer')
//   },
//   resolver: {
//     assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
//     sourceExts: [...config.resolver.sourceExts, 'svg']
//   }
// });
