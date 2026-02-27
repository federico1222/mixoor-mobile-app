const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  constants: path.resolve(__dirname, "shims/constants.js"),
  crypto: require.resolve("react-native-quick-crypto"),
  fs: path.resolve(__dirname, "shims/fs.js"),
  os: path.resolve(__dirname, "shims/os.js"),
  path: require.resolve("path-browserify"),
  readline: path.resolve(__dirname, "shims/readline.js"),
  url: require.resolve("url/"),
  "web-worker": path.resolve(__dirname, "shims/web-worker.js"),
  // Route snarkjs/ffjavascript through shims that patch globalThis.Blob before
  // loading the browser bundles (which have top-level Blob construction).
  // extraNodeModules is checked before exports-map resolution for bare names.
  snarkjs: path.resolve(__dirname, "shims/snarkjs.js"),
  ffjavascript: path.resolve(__dirname, "shims/ffjavascript.js"),
};

// Prioritise browser builds over Node builds
config.resolver.resolverMainFields = [
  "react-native",
  "browser",
  "main",
  "module",
];

// Keep package exports enabled (needed for subpath exports like @tamagui/sheet/controller).
// Use react-native + browser conditions so Tamagui and other packages resolve correctly.
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  "react-native",
  "require",
  "default",
];

// Block the Node.js entry of web-worker so our shim is used instead
config.resolver.blockList = /node_modules\/web-worker\/cjs\/node\.js$/;

// Intercept ALL ffjavascript and snarkjs imports (including nested node_modules)
// and redirect to our shims that patch globalThis.Blob before loading.
const defaultResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "ffjavascript") {
    return { filePath: path.resolve(__dirname, "shims/ffjavascript.js"), type: "sourceFile" };
  }
  if (moduleName === "snarkjs") {
    return { filePath: path.resolve(__dirname, "shims/snarkjs.js"), type: "sourceFile" };
  }
  if (defaultResolver) {
    return defaultResolver(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
