module.exports = {
  presets: ['babel-preset-granite'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@shared': './shared',
          '@widgets': './widgets',
          '@pages': './pages',
        },
      },
    ],
  ],
};
