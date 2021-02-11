module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbNanme: 'jest',
    },
    binary: {
      version: '4.0.3',
      skipMD5: true,
    },
    autoStart: false,
  },
};
