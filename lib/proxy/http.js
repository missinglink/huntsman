
var request = require( 'request' );

module.exports = function( options ){
  if( !options ) options = {};
  if( !options.store ) options.store = ( require( '../storage/null' ) )();
  return function( uri, cb ){
    var hit = options.store.get( uri );
    if( hit ) return cb.apply( null, hit );
    request( uri, options, function( err, res, body ) {
      if( err ) throw new Error( err );
      var result = [ err, {
        uri: uri,
        statusCode: res.statusCode,
        headers: res.headers
      }, body ];
      options.store.set( uri, result );
      return cb.apply( null, result );
    });
  };
};