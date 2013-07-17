
var EventEmitter = require('./RegexEventEmitter');

// # Alternatives
// # https://github.com/sylvinus/node-crawler/blob/master/lib/crawler.js
// # https://github.com/cgiffard/node-simplecrawler/blob/master/lib/crawler.js

// # TODO:
// better docs on extensions
// extensions could be a queue?

module.exports = function( proxy, queue, options ){

  var huntsman = new EventEmitter();
  huntsman.options = options || {};
  huntsman.options.interval = huntsman.options.interval || 50;
  huntsman.options.timeout = huntsman.options.timeout || 5000;
  huntsman.proxy = proxy || new (require('./proxy/http'))();
  huntsman.queue = queue || new (require('./Queue'))();
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
        huntsman.proxy( uri, function( err, res, body ){
          huntsman.emit( 'response', err, res, body );
        });
      } else if ( new Date().getTime()-huntsman.options.timeout > huntsman.updated ){
        clearInterval( mainloop );
      }
    }, huntsman.options.interval );
  };

  return huntsman;
};