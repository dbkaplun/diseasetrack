#!/usr/bin/env node

var Twit = require('twit');
var T = new Twit(sails.config.twitter);

module.exports = function (q) {
  var stream = T.stream('statuses/filter', q);
  stream.on('tweet', module.exports.handleTweet);
  return stream;
};
module.exports.handleTweet = function (tweet) {
  // tweet = { created_at: 'Thu Jan 15 05:48:30 +0000 2015',
  //   id: 555602403362607100,
  //   id_str: '555602403362607104',
  //   text: 'I\'m not gonna rush this whole "growing up" thing \nI\'ll stay home w/ my parents\nI still have a baby tooth &amp; didn\'t get my license yet soooo',
  //   source: '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>',
  //   truncated: false,
  //   in_reply_to_status_id: null,
  //   in_reply_to_status_id_str: null,
  //   in_reply_to_user_id: null,
  //   in_reply_to_user_id_str: null,
  //   in_reply_to_screen_name: null,
  //   user: 
  //    { id: 1597343893,
  //      id_str: '1597343893',
  //      name: '☆Emma Wallis☆',
  //      screen_name: 'e_wall6484',
  //      location: '',
  //      url: null,
  //      description: 'stay weird ?¿',
  //      protected: false,
  //      verified: false,
  //      followers_count: 127,
  //      friends_count: 298,
  //      listed_count: 1,
  //      favourites_count: 1337,
  //      statuses_count: 3995,
  //      created_at: 'Tue Jul 16 02:32:01 +0000 2013',
  //      utc_offset: null,
  //      time_zone: null,
  //      geo_enabled: false,
  //      lang: 'en',
  //      contributors_enabled: false,
  //      is_translator: false,
  //      profile_background_color: '1A1B1F',
  //      profile_background_image_url: 'http://pbs.twimg.com/profile_background_images/463756126152978432/vSjxhfhn.png',
  //      profile_background_image_url_https: 'https://pbs.twimg.com/profile_background_images/463756126152978432/vSjxhfhn.png',
  //      profile_background_tile: true,
  //      profile_link_color: '2D0D85',
  //      profile_sidebar_border_color: '000000',
  //      profile_sidebar_fill_color: 'DDEEF6',
  //      profile_text_color: '333333',
  //      profile_use_background_image: true,
  //      profile_image_url: 'http://pbs.twimg.com/profile_images/555540963964518400/gs3kRR_M_normal.jpeg',
  //      profile_image_url_https: 'https://pbs.twimg.com/profile_images/555540963964518400/gs3kRR_M_normal.jpeg',
  //      profile_banner_url: 'https://pbs.twimg.com/profile_banners/1597343893/1420227557',
  //      default_profile: false,
  //      default_profile_image: false,
  //      following: null,
  //      follow_request_sent: null,
  //      notifications: null },
  //   geo: null,
  //   coordinates: null,
  //   place: null,
  //   contributors: null,
  //   retweet_count: 0,
  //   favorite_count: 0,
  //   entities: 
  //    { hashtags: [],
  //      trends: [],
  //      urls: [],
  //      user_mentions: [],
  //      symbols: [] },
  //   favorited: false,
  //   retweeted: false,
  //   possibly_sensitive: false,
  //   filter_level: 'low',
  //   lang: 'en',
  //   timestamp_ms: '1421300910212' }
  sails.log.verbose("received tweet", tweet);
  Tweet.findOrCreate({id_str: tweet.id_str}, {json: tweet})
    .then(Tweet.publishCreate)
    .catch(sails.log.error);
};
