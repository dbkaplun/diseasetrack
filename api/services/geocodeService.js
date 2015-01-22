#!/usr/bin/env node

var Promise = require('bluebird');
var geocoder = require('node-geocoder').getGeocoder('openstreetmap');

module.exports = function () {
  setInterval(function () {
    module.exports.geocodeTweets()
      .then(function (tweets) {
        sails.log.info("geocoding complete: " + JSON.stringify(tweets.reduce(function (totals, tweet) {
          totals[tweet.geo_status] = (totals[tweet.geo_status] || 0) + 1;
          return totals;
        }, {})));
      })
      .catch(sails.log.error)
      .done()
  }, sails.config.GEOCODE_INTERVAL);
};
module.exports.geocodeTweets = function () {
  return Tweet.find({
    where: {geo_status: 'pending'},
    limit: sails.config.GEOCODE_BATCH_SIZE,
    sort: 'timestamp DESC'
  }).then(function (tweets) {
    sails.log.info("geocoding " + tweets.length + " tweets");
    return Promise.resolve(tweets.map(function (tweet) {
      return module.exports.geocode(tweet.geo_req)
        .tap(function (res, i) {
          tweet.geo_status = res.length ? 'resolved' : 'rejected';
          tweet.geo_res = res;
          if (res.length) {
            var first = res[0];
            tweet.geojson = {type: 'Point', coordinates: [first.latitude, first.longitude]};
          }
        })
        .catch(function (err) {
          tweet.geo_status = 'rejected';
          tweet.geo_res = err;
          throw err;
        });
    }))
      .finally(function () {
        Promise.map(tweets, function (tweet) {
          Tweet.publishUpdate(tweet.id, tweet);
          return tweet.save();
        });
      })
      .return(tweets);
  });
};

module.exports.geocode = function () {
  return Promise
    .resolve(geocoder.geocode.apply(geocoder, arguments))
    .then(module.exports._handleGeocodeError)
};
module.exports.batchGeocode = function () {
  return Promise
    .resolve(geocoder.batchGeocode.apply(geocoder, arguments))
    .then(module.exports._handleGeocodeError)
};
module.exports._handleGeocodeError = Promise.method(function (data) {
  if (data instanceof Error) {
    console.log('err', Object.keys(data));
    throw data;
  }
  return data;
});
