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
        alias: {
          "@data": "./src/data",
          "@domain": "./src/domain",
          "@services": "./src/domain/services",
          "@utils": "./src/domain/utils",
          "@infra": "./src/infra",
          "@server": "./src/server",
        },
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
