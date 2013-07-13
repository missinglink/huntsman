
var proxy = require('./lib/proxy/http')();
var Queue = require('./lib/Queue');
var EventEmitter = require('./lib/RegexEventEmitter');

// # Alternatives
// # https://github.com/sylvinus/node-crawler/blob/master/lib/crawler.js
// # https://github.com/cgiffard/node-simplecrawler/blob/master/lib/crawler.js

// # TODO:
// # test for regexemitter.match
// # [done] Regex to match single quoted href tags, maybe use cheerio?
// # [done] clean up callbacks, use a cleaner eventemitter model, remove @observers, use regex EventEmitter
// # remove class struture, change to js function
// # [done,needs test] allow null callbacks for on (or another method name)
// # [done] die when finished (probably need to record which requests are completed vs queued )
// # [done] add tests
// # [done] strip trailing / and #hash section from url (to avoid duplicate pages)
// # [done] Custom link normaliser
// # [done] custom link extractor
// # [done] disable duplicate url check in add() (for performance on large indexes)
// # and/or ability to inject 'queued' index
// # possibly custom index add() function
// # pluggable request/response cache with TTL ( handy for unit testing ), store datestamps for TTL
// # switch to substacks http.request library
// # able to process a single page at a time (for testing, web frontend gui)
// # abstract queue itself to a storage adapter so it may be frozen and resumed
// # check for html content before running cheerio ( response.body.match(/^\s*</); )

module.exports = function( options, queue ){

  var huntsman = new EventEmitter();
  huntsman.options = options || {};
  huntsman.options.interval = huntsman.options.interval || 50;
  huntsman.options.timeout = huntsman.options.timeout || 5000;
  huntsman.queue = queue || new Queue();
  huntsman.extensions = [];
  huntsman.updated = new Date().getTime() + huntsman.options.timeout;

  huntsman.on( 'response', function( err, res, body ){
    huntsman.updated = new Date().getTime();
    var args = Array.prototype.slice.call( arguments );
    huntsman.extensions.forEach( function( mw ){
      var extension = mw.apply( huntsman, args );
      if( extension ) args.push( extension );
    });
    huntsman.emit.apply( huntsman, [ res.uri ].concat( args ) );
  });

  huntsman.start = function(){
    var mainloop = setInterval( function(){
      var uri = huntsman.queue.shift();
      if( 'string' === typeof( uri ) ){
        proxy( uri, function( err, res, body ){
          huntsman.emit( 'response', err, res, body );
        });
      } else if ( new Date().getTime()-huntsman.options.timeout > huntsman.updated ){
        clearInterval( mainloop );
      }
    }, huntsman.options.interval );
  };

  return huntsman;
};