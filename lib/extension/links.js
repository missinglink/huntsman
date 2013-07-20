
var link = require( '../link' );

module.exports = function(){
  return function( huntsman, err, res, cb ){
    if( !err && 'string' === typeof( res.body ) ){
      if( res.body.match( /^\s*</ ) ){
        return cb( null, {
          links: function( options ){
            return link.extractor.apply( null, [ res.uri, res.body, options ] );
          }
        });
      }
    }
    return cb();
  };
};