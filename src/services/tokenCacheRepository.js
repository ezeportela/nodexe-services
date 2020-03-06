const tokenCacheService = require('./tokenCacheService');
const _ = require('lodash');

const getTokenCache = async ({
  redisReadConnection,
  redisPrimaryConnection,
  key,
  service,
  extractToken,
  compensation,
}) => {
  const {getTokenFromCache, sendTokenToCache} = tokenCacheService(
    {
      redisReadConnection,
      redisPrimaryConnection,
      key,
    },
    compensation,
  );
  const token = await getTokenFromCache(key);

  if (_.isEmpty(token)) {
    const _res = await service();
    const _token = await sendTokenToCache(key, extractToken(_res.body));
    Object.assign(token, _token);
  }

  return token;
};

module.exports = {getTokenCache};
