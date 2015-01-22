/**
* Tweet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    json: {type: 'json', required: true},
    id_str: {type: 'string', required: true, unique: true},
    timestamp: {type: 'datetime', required: true, index: true},
    retweeted: {type: 'boolean', required: true, index: true},

    geo_status: {type: 'string', required: true, defaultsTo: 'pending', enum: ['pending', 'resolved', 'rejected'], index: true},
    geo_res: 'json',
    geojson: 'json',
  },
  beforeValidate: function (values, done) {
    var json = values.json;

    values.id_str = json.id_str;
    values.timestamp = new Date(Number(json.timestamp_ms));
    values.retweeted = json.retweeted;

    var coordinates =
      (json.geo || json.coordinates || {}).coordinates ||
      ((((json.place || {}).bounding_box || {}).coordinates || [])[0] || [])[0];
    ['geo', 'coordinates', 'place'].some(function (path) {
      if (json[path]) { sails.log.debug("twitter sent " + path + ": " + coordinates); return true; }
    });
    if (coordinates) {
      values.geo_status = 'resolved';
      values.geojson = {type: 'Point', coordinates: coordinates};
    } else {
      values.geo_req = [
        json.user.location,
        json.user.time_zone,
      ].filter(Boolean).join(' ');
      if (!values.geo_req) values.geo_status = 'rejected';
    }

    done();
  }
};
