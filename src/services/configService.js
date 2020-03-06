const _ = require('lodash');

const configService = (configDefer) => {
  const defer = configDefer.deferConfig;
  return (dependency, options) =>
    defer((config) =>
      _.defaultsDeep(options, config.dependencies[dependency], {
        dependency,
      }),
    );
};

module.exports = configService;
