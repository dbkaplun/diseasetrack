#!/usr/bin/env node

var Promise = require('bluebird');
var geocoder = require('node-geocoder').getGeocoder('openstreetmap');

module.exports = function (period) {
  setInterval(function () {
    module.exports.geocode()
      .catch(sails.log.error)
      .done()
  }, period);
};
module.exports.geocode = function () {
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
        return true;
      }
    });
    return Promise.resolve(geocoder.batchGeocode(_.pluck(toGeocode, 'geo_req')))
      .each(function (res, i) {
        var tweet = toGeocode[i];
        tweet.geo_status = res.length ? 'resolved' : 'rejected';
        tweet.geo_res = res;
        if (res.length) {
          var first = res[0];
          tweet.geojson = {type: 'Point', coordinates: [first.latitude, first.longitude]};
        }
      })
      .catch(function (err) {
        toGeocode.forEach(function (tweet) {
          tweet.geo_status = 'rejected';
          tweet.geo_res = err;
        });
        throw err;
      })
      .finally(function () {
        return Promise.map(tweets, function (tweet) {
          Tweet.publishUpdate(tweet.id, tweet);
          return tweet.save();
        });
      })
      .return(tweets);
  });
};
