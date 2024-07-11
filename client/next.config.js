module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300; // or whatever your poll interval is

    return config;
  },
};
