
var request = require( 'superagent' );

module.exports = function( options ){
  if( !options ) options = {};
  if( !options.store ) options.store = ( require( '../storage/null' ) )();
  return function( uri, cb ){
    var hit = options.store.get( uri );
    if( hit ) return cb.apply( null, hit );
    request.get( uri ).end( function( err, res ) {
      if( err ) return cb( err, { uri: uri } );
      var result = [ err, {
        uri: uri,
        statusCode: res.status,
        headers: res.header,
        body: res.text || ''
      } ];
      options.store.set( uri, result );
      return cb.apply( null, result );
    });
  };
};