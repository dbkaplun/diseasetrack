(function (root) {
  var gaName = 'ga';
  require.config({
    paths: {
      jquery: 'https://code.jquery.com/jquery-1.11.1.min',
      'jquery.throttle-debounce': 'https://cdnjs.cloudflare.com/ajax/libs/jquery-throttle-debounce/1.1/jquery.ba-throttle-debounce.min',
      bootstrap: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min',
      vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/0.11.4/vue.min',
      'nprogress': 'https://rawgit.com/rstacruz/nprogress/master/nprogress',
      d3: 'http://d3js.org/d3.v3.min',
      c3: 'https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.8/c3',
      leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet',
      'leaflet.markercluster': 'https://rawgit.com/Leaflet/Leaflet.markercluster/master/dist/leaflet.markercluster',
      'leaflet.heat': 'http://leaflet.github.io/Leaflet.heat/dist/leaflet-heat',
      'leaflet.geosearch': 'https://rawgit.com/smeijer/L.GeoSearch/master/src/js/l.control.geosearch',
      'leaflet.geosearch.provider.openstreetmap': 'https://rawgit.com/smeijer/L.GeoSearch/master/src/js/l.geosearch.provider.openstreetmap',

      // 'socket.io': 'https://cdn.socket.io/socket.io-1.2.1',
      // 'sails.io': 'https://rawgit.com/balderdashy/sails.io.js/master/dist/sails.io',
      'sails.io': '/js/dependencies/sails.io',
      moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min',
      'twitter-text': 'https://rawgit.com/twitter/twitter-text/master/js/twitter-text',
      'binarysearch': 'https://rawgit.com/mgechev/javascript-algorithms/master/src/searching/binarysearch',
      'mergesort': 'https://rawgit.com/dbkaplun/javascript-algorithms/779c7ec1525e750e50883bd3e1253df983067b20/src/sorting/mergesort',

      'google-analytics': 'http://www.google-analytics.com/analytics',
    },
    shim: {
      'jquery.throttle-debounce': {deps: ['jquery']},
      bootstrap: {deps: ['jquery']},
      'leaflet.markercluster': {deps: ['leaflet']},
      'leaflet.heat': {deps: ['leaflet']},
      'leaflet.geosearch': {deps: ['leaflet']},
      'leaflet.geosearch.provider.openstreetmap': {deps: ['leaflet.geosearch']},
      'binarysearch': {exports: 'binarySearch'},
      'mergesort': {exports: 'mergeSort'},
      'google-analytics': {exports: gaName, init: function () {
        var name = this.GoogleAnalyticsObject = gaName;
        var ga = this[name] || function () {
          (ga.q = ga.q || []).push(arguments);
        };
        ga.l = 1 * new Date();
        return ga;
      }},
    }
  });

  root.document.dispatchEvent(new Event('diseasetrackReady'));

  require(['jquery', 'bootstrap'], function (jQuery) {
    jQuery(function ($) {
      var $body = $('body').removeClass('no-js').addClass('js');
    });
  });

  require(['google-analytics'], function (ga) {
    ga('create', 'UA-58867706-2', 'auto');
    ga('send', 'pageview');
  });
}(this));
