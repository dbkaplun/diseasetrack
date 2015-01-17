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
  console.log('geocode');
  return Promise.resolve(Tweet.find({geo_status: 'pending'}))
    .map(function (tweet) {
      var json = tweet.json;
      var geo = json.geo || json.coordinates;
      if (geo) {
        tweet.geo_status = 'resolved';
        tweet.geojson = {type: 'Point', coordinates: geo.coordinates};
        return tweet;
      }
      if (json.place) console.log('place', json.place);
      tweet.geo_req = [
        json.user.location,
        json.user.time_zone,
      ].filter(Boolean).join(' ');
      return Promise.resolve(geocoder.geocode(tweet.geo_req))
        .then(function (res) {
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
          sails.log.error("geocode error", err);
        })
        .return(tweet);
    })
    .each(function (tweet) {
      tweet.save();
      Tweet.publishUpdate(tweet.id, tweet);
    });
};
