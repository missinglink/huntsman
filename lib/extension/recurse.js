
var link = require( '../link' );

module.exports = function( options ){
  return function( huntsman, err, res, cb ){
    if( !err && 'string' === typeof( res.body ) ){
      var links = link.extractor( res.uri, res.body, options );
      if( Array.isArray( links ) ){
        links.forEach( function( link ){
          if( huntsman.match( link ) ){
            huntsman.queue.add( link );
          }
        });
      }
    }
    return cb();
  };
};