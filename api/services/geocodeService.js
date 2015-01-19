#!/usr/bin/env node

var Promise = require('bluebird');
var geocoder = require('node-geocoder').getGeocoder('openstreetmap');

module.exports = function (interval) {
  setInterval(function () {
    module.exports.geocodeTweets()
      .catch(sails.log.error)
      .done()
  }, interval);
};
module.exports.geocodeTweets = function () {
  return Tweet.find({geo_status: 'pending'}).then(function (tweets) {
    sails.log.info("geocoding " + tweets.length + " tweets");
    var toGeocode = tweets.filter(function (tweet) {
      var json = tweet.json;
      var coordinates =
        (json.geo || json.coordinates || {}).coordinates ||
        ((((json.place || {}).bounding_box || {}).coordinates || [])[0] || [])[0];
      ['geo', 'coordinates', 'place'].some(function (path) {
        if (json[path]) { console.log(path, coordinates); return true; }
      });
      if (coordinates) {
        tweet.geo_status = 'resolved';
        tweet.geojson = {type: 'Point', coordinates: coordinates};
      } else {
        tweet.geo_req = [
          json.user.location,
          json.user.time_zone,
        ].filter(Boolean).join(' ');
        if (!tweet.geo_req) tweet.geo_status = 'rejected';
        return tweet.geo_req;
      }
    });

    return Promise.resolve(toGeocode.map(function (tweet) {
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
