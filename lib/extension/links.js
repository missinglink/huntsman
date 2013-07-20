
var link = require( '../link' );

module.exports = function(){
  return function( huntsman, err, res, cb ){
    return cb( null, {
      links: function( options ){
        return link.extractor.apply( null, [ res.uri, res.body, options ] );
      }
    });
  };
};