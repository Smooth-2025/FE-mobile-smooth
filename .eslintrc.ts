module.exports = {
  root: true,
  extends: [
    "@react-native",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["import"],
  settings: {
    "import/resolver": {
      "babel-module": {},
    },
  },
};
