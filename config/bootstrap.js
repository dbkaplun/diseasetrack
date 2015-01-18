/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.GEOCODE_INTERVAL = 15 * 1000; // every 15 seconds

module.exports.bootstrap = function (done) {
  twitterService(sails.config.DEFAULT_TWITTER_QUERY);
  geocodeService(sails.config.GEOCODE_INTERVAL);
  done();
};
