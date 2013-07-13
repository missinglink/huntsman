
var cheerio = require('cheerio');

module.exports = function(){
  return function( err, res, body ){
    if( !err && 'string' === typeof( body ) ){
      return body.match( /^\s*</ ) ? cheerio.load( body, { lowerCaseTags: true } ) : null;
    }
  };
};