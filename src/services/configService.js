const _ = require('lodash');

const ConfigService = (configDefer) => {
  const defer = configDefer.deferConfig;
  const getServiceConfig = (dependency, options) =>
    defer((config) =>
      _.defaultsDeep(options, config.dependencies[dependency], {
        dependency,
      }),
    );

  return {getServiceConfig};
};

module.exports = ConfigService;
