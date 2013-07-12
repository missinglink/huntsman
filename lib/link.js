
var url = require( 'url' );

var pattern = {
  search: /a\shref\s?=\s?['"]([^"'#]+)/gi,
  refine: /['"]([^"'#]+)/,
  filter: /.*/
};

module.exports.normaliser = function( uri, baseUri ) {

  // resolve relative uris
  if( baseUri ) uri = url.resolve( baseUri, uri );

  // remove trailing slash
  return uri.replace( '/?', '?' )
            .replace( '/#', '#' )
            .replace( /\/$/, '' );
};

module.exports.extractor = function( uri, body, options ) {

  var links = [];

  // accept a list of regex patterns to match & allow custom link normaliser
  if( !options ) options = {};
  if( !options.pattern ) options.pattern = {};
  if( !options.pattern.search ) options.pattern.search = pattern.search;
  if( !options.pattern.refine ) options.pattern.refine = pattern.refine;
  if( !options.pattern.filter ) options.pattern.filter = pattern.filter;
  if( !options.normaliser ) options.normaliser = module.exports.normaliser;
  if( 'boolean' !== typeof options.unique ) options.unique = true;

  // match all patterns and extract links
  var matches = body.match( options.pattern.search );
  if( Array.isArray( matches ) ){
    links = links.concat( matches.filter( String ).map( function( link ){
      return link.match( options.pattern.refine )[1];
    }));
  }

  // normalise links
  if( options.normaliser ){
    links = links.map( function( link ){
      return options.normaliser( link, uri );
    });
  }

  // filter domains
  if( options.pattern.filter ){
    links = links.filter( function( link ){
      return link.match( options.pattern.filter );
    });
  }

  // remove duplicates
  if( options.unique ){
    links = links.filter( function( value, index ) {
      return links.indexOf( value ) === index;
    });
  }

  return links;
};