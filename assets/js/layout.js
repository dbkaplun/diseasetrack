(function (root) {
  require.config({
    paths: {
      jquery: 'https://code.jquery.com/jquery-1.11.1.min',
      bootstrap: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min',
      // 'socket.io': 'https://cdn.socket.io/socket.io-1.2.1',
      // 'sails.io': 'https://rawgit.com/balderdashy/sails.io.js/master/dist/sails.io',
      'sails.io': '/js/dependencies/sails.io',
      vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/0.11.4/vue.min',
      moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min',
      leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet',
      binarysearch: 'https://rawgit.com/mgechev/javascript-algorithms/master/src/searching/binarysearch',
      'twitter-text': 'https://rawgit.com/twitter/twitter-text/master/js/twitter-text',
    },
    shim: {
      bootstrap: {deps: ['jquery']},
      binarysearch: {exports: 'binarySearch'},
    }
  });

  root.document.dispatchEvent(new Event('diseasetrackReady'));

  require(['jquery', 'bootstrap'], function (jQuery) {
    jQuery(function ($) {
      var $body = $('body').removeClass('no-js').addClass('js');
    });
  });
}(this));
