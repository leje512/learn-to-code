module.exports = {
  semi: false,
  trailingComma: "es5",
  singleQuote: false,
  printWidth: 80,
  tabWidth: 2,
  bracketSpacing: true,
  endOfLine: "auto",
  overrides: [
    {
      files: ".js",
      options: {
        parser: "javascript",
      },
    },
    {
      files: ".ts",
      options: {
        parser: "typescript",
      },
    },
  ],
};
