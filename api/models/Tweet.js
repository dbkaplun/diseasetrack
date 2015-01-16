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
    timestamp: {type: 'datetime', required: true},
    retweeted: {type: 'boolean', required: true},
  },
  beforeValidate: function (values, done) {
    values.id_str = values.json.id_str;
    values.timestamp = new Date(Number(values.json.timestamp_ms));
    values.retweeted = values.json.retweeted;
    done();
  }
};
