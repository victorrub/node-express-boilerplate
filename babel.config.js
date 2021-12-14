module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
    "minify",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {},
      },
    ],
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
  ],
  ignore: ["**/*.test.ts", "**/*.spec.ts"],
};
