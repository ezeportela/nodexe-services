const tokenCacheService = require('./tokenCacheService');
const _ = require('lodash');

const requestToken = async ({
  redisReadConnection,
  redisPrimaryConnection,
  key,
  service,
  extractToken,
  compensation,
  bodyProp = 'body',
}) => {
  const {getTokenFromCache, sendTokenToCache} = tokenCacheService(
    {
      redisReadConnection,
      redisPrimaryConnection,
      key,
    },
    compensation,
  );
  const token = await getTokenFromCache();

  if (_.isEmpty(token)) {
    const _res = await service();
    const _token = await sendTokenToCache(extractToken(_res[bodyProp]));
    Object.assign(token, _token);
  }

  return token;
};

module.exports = {requestToken};
