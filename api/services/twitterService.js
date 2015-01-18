#!/usr/bin/env node

var Twit = require('twit');
var T = new Twit(sails.config.twitter);

module.exports = function (q) {
  var stream = T.stream('statuses/filter', q);
  stream.on('tweet', module.exports.handleTweet);
  return stream;
};
module.exports.handleTweet = function (tweet) {
// tweet = { created_at: 'Sat Jan 17 23:15:17 +0000 2015',
//   id: 556590612913610750,
//   id_str: '556590612913610752',
//   text: 'I think ima just stay home &amp; sleep. 😴',
//   source: '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
//   truncated: false,
//   in_reply_to_status_id: null,
//   in_reply_to_status_id_str: null,
//   in_reply_to_user_id: null,
//   in_reply_to_user_id_str: null,
//   in_reply_to_screen_name: null,
//   user:
//    { id: 546243800,
//      id_str: '546243800',
//      name: 'Ozy not Ozzy',
//      screen_name: 'OSIGOMAS',
//      location: 'I\'m only 13',
//      url: null,
//      description: 'You need a step dad? I might be ugly but i got money, holla at yo boy.',
//      protected: false,
//      verified: false,
//      followers_count: 500,
//      friends_count: 83,
//      listed_count: 0,
//      favourites_count: 6467,
//      statuses_count: 40224,
//      created_at: 'Thu Apr 05 20:00:13 +0000 2012',
//      utc_offset: -18000,
//      time_zone: 'Eastern Time (US & Canada)',
//      geo_enabled: true,
//      lang: 'en',
//      contributors_enabled: false,
//      is_translator: false,
//      profile_background_color: 'C0DEED',
//      profile_background_image_url: 'http://pbs.twimg.com/profile_background_images/535967961/577195_408640672479475_100000006381746_1570996_1691934206_n.jpg',
//      profile_background_image_url_https: 'https://pbs.twimg.com/profile_background_images/535967961/577195_408640672479475_100000006381746_1570996_1691934206_n.jpg',
//      profile_background_tile: true,
//      profile_link_color: '0084B4',
//      profile_sidebar_border_color: 'C0DEED',
//      profile_sidebar_fill_color: 'DDEEF6',
//      profile_text_color: '333333',
//      profile_use_background_image: true,
//      profile_image_url: 'http://pbs.twimg.com/profile_images/555162066018136065/al126p2o_normal.jpeg',
//      profile_image_url_https: 'https://pbs.twimg.com/profile_images/555162066018136065/al126p2o_normal.jpeg',
//      profile_banner_url: 'https://pbs.twimg.com/profile_banners/546243800/1419040612',
//      default_profile: false,
//      default_profile_image: false,
//      following: null,
//      follow_request_sent: null,
//      notifications: null },
//   geo: { type: 'Point', coordinates: [ 35.715129, -81.455361 ] },
//   coordinates: { type: 'Point', coordinates: [ -81.455361, 35.715129 ] },
//   place:
//    { id: 'bc0d17fa45770e13',
//      url: 'https://api.twitter.com/1.1/geo/id/bc0d17fa45770e13.json',
//      place_type: 'city',
//      name: 'Icard',
//      full_name: 'Icard, NC',
//      country_code: 'US',
//      country: 'United States',
//      bounding_box:
//       { type: 'Polygon',
//         coordinates:
//          [ [ [ -81.481976, 35.708935 ],
//              [ -81.481976, 35.750893 ],
//              [ -81.4282617, 35.750893 ],
//              [ -81.4282617, 35.708935 ] ] ] },
//      attributes: {} },
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
//   timestamp_ms: '1421536517729' }
  sails.log.verbose("received tweet", tweet);
  Tweet.findOrCreate({id_str: tweet.id_str}, {json: tweet})
    .then(Tweet.publishCreate)
    .catch(sails.log.error)
    .done();
};
