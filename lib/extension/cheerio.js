
var cheerio = require('cheerio');

module.exports = function( options ){
  return function( huntsman, err, res, cb ){
    if( !err && 'string' === typeof( res.body ) ){
      if( res.body.match( /^\s*</ ) ){
        if( !options ) options = { lowerCaseTags: true, lowerCaseAttributeNames: true };
        return cb( null, { 'cheerio' : cheerio.load( res.body, options ) } );
      }
    }
    return cb();
  };
};