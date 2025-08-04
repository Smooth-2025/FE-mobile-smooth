module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@": "./src",
          "@styles": "./src/styles",
          "@components": "./src/components",
          "@hooks": "./src/hooks",
          "@screens": "./src/screens",
          "@utils": "./src/utils",
          "@navigation": "./src/navigation",
          "@store": "./src/store",
          "@constants": "./src/constants",
          "@types": "./src/types",
          "@services": "./src/services",
          "@assets": "./src/assets",
        },
      },
    ],
  ],
};
