
var async = require('async');
var EventEmitter = require('regexemitter');

// # Alternatives
// # https://github.com/sylvinus/node-crawler/blob/master/lib/crawler.js
// # https://github.com/cgiffard/node-simplecrawler/blob/master/lib/crawler.js

// # TODO:
// tests for extensions
// TTL for storage
// Persistent queue examples

module.exports = function( options ){

  var huntsman = new EventEmitter();

  // Allow undefined callbacks
  // @todo add unit test for this
  huntsman.on = function( event, cb ){
    EventEmitter.prototype.on.call( this, event, cb || function(){} );
  }

  huntsman.options = options || {};
  huntsman.options.throttle = huntsman.options.throttle || 10;
  huntsman.options.timeout = huntsman.options.timeout || 5000;
  huntsman.proxy = huntsman.options.proxy || new (require('./proxy/http'))();
  huntsman.queue = huntsman.options.queue || new (require('./Queue'))();
  huntsman.extensions = [];
  huntsman.loop = function(){};
  huntsman.updated = new Date().getTime() + huntsman.options.timeout;

  // Extensions
  huntsman.on( 'HUNTSMAN_response', function( err, res ){
    if( err ) huntsman.emit( 'HUNTSMAN_error', 'response error' + err.toString('utf8') );
    huntsman.updated = new Date().getTime();
    async.parallel( huntsman.extensions.map( function( extension ){
      return async.apply( extension, huntsman, err, res );
    }), function( err, results ){
      if( err ) huntsman.emit( 'HUNTSMAN_error', 'extension error' + err.toString('utf8') );
      res.extension = {};
      if( Array.isArray( results ) ){
        results.forEach( function( result ){
          for( var key in result ){ res.extension[ key ] = result[ key ]; }
        });
      }
      huntsman.emit.call( huntsman, res.uri, err, res );
    });
  });

  huntsman.next = function( isSeed ){
    var uri = huntsman.queue.shift();
    if( 'string' === typeof( uri ) ){
      if( true === isSeed || huntsman.match( uri ) ){
        huntsman.proxy( uri, function( err, res ){
          huntsman.emit( 'HUNTSMAN_response', err, res );
        });
      }
      else console.log( '[skip] uri cannot be matched to callback', uri );
    } else if (( new Date().getTime() - huntsman.options.timeout ) > huntsman.updated ){
      huntsman.stop();
    }
  };

  huntsman.wait = function( waitms ){
    huntsman.stop();
    setTimeout( huntsman.start, waitms );
    console.error( 'waiting: ' + waitms + ' ms' );
  };

  huntsman.stop = function(){
    console.error( 'spider stop' );
    clearInterval( huntsman.loop );
    huntsman.emit( 'HUNTSMAN_exit' );
  };

  huntsman.start = function(){
    if( huntsman.queue.count() === 0 ) return console.error( 'no uri in queue' );
    huntsman.loop = setInterval( huntsman.next, 1000 / huntsman.options.throttle );
    huntsman.next( true );
  };

  return huntsman;
};
