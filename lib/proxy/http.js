
var request = require( 'request' );

module.exports = function( options ){
  if( !options ) options = {};
  return function( uri, cb ){
    request( uri, options, function( err, res, body ) {
      return cb( err, {
        uri: uri,
        statusCode: res.statusCode,
        headers: res.headers
      }, body );
    });
  };
};