
var async = require('async');
var EventEmitter = require('./RegexEventEmitter');

// # Alternatives
// # https://github.com/sylvinus/node-crawler/blob/master/lib/crawler.js
// # https://github.com/cgiffard/node-simplecrawler/blob/master/lib/crawler.js

// # TODO:
// tests for extensions
// better docs on extensions
// expose functionality of link/resolve libraries for extracting images etc.
// extract regex emitter to it's own repo
// TTL for storage
// Persistent queue examples
// Cleaner readme

module.exports = function( options ){

  var huntsman = new EventEmitter();
  huntsman.options = options || {};
  huntsman.options.throttle = huntsman.options.throttle || 10;
  huntsman.options.timeout = huntsman.options.timeout || 5000;
  huntsman.proxy = huntsman.options.proxy || new (require('./proxy/http'))();
  huntsman.queue = huntsman.options.queue || new (require('./Queue'))();
  huntsman.extensions = [];
  huntsman.updated = new Date().getTime() + huntsman.options.timeout;

  // Extensions
  huntsman.on( 'response', function( err, res ){
    if( err ) huntsman.emit( 'error', 'response error' + err.toString('utf8') );
    huntsman.updated = new Date().getTime();
    async.parallel( huntsman.extensions.map( function( extension ){
      return async.apply( extension, huntsman, err, res );
    }), function( err, results ){
      if( err ) huntsman.emit( 'error', 'extension error' + err.toString('utf8') );
      res.extension = {};
      if( Array.isArray( results ) ){
        results.forEach( function( result ){
          for( var key in result ){ res.extension[ key ] = result[ key ]; }
        });
      }
      huntsman.emit.call( huntsman, res.uri, err, res );
    });
  });

  huntsman.start = function(){
    var mainloop = setInterval( function(){
      var uri = huntsman.queue.shift();
      if( 'string' === typeof( uri ) ){
        huntsman.proxy( uri, function( err, res ){
          huntsman.emit( 'response', err, res );
        });
      } else if (( new Date().getTime() - huntsman.options.timeout ) > huntsman.updated ){
        clearInterval( mainloop );
      }
    }, 1000 / huntsman.options.throttle );
  };

  return huntsman;
};