
module.exports = function( options ){
  return function( huntsman, err, res, cb ){
    if( !err && 'string' === typeof( res.body ) ){
      if( res.body.match( /^\s*[{\]]/ ) ){
        if( !options ) options = {};
        try {
          return cb( null, { 'json' : JSON.parse( res.body, options ) } );
        }
        catch( e ){
          return cb();
        }
      }
    }
    return cb();
  };
};