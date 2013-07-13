
var link = require( '../link' );

module.exports = function( options ){
  return function( err, res, body ){
    _self = this;
    if( !err && 'string' === typeof( body ) ){
      res.links = link.extractor( res.uri, body, options );
      if( Array.isArray( res.links ) ){
        res.links.forEach( function( link ){
          if( _self.match( link ) ){
            _self.queue.add( link );
          }
        });
      }
    }
  };
};