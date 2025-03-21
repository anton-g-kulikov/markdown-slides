module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
  ],
  // Don't include additional plugins that might conflict
  env: {
    test: {
      // Special configuration for test environment
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        ["@babel/preset-react", { runtime: "automatic" }],
        ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
      ],
    },
  },
};
