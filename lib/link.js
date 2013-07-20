
var resolve = require( './resolve' );

var pattern = {
  search: /href\s?=\s?['"]([^"'#]+)/gi,
  refine: /['"]([^"'#]+)$/,
  filter: /^https?:\/\//
};

// resolve relative uris
module.exports.resolver = function( uri, baseUri ) {
  if( ( 'string' !== typeof uri ) || !uri.length ) throw new Error( 'invalid uri' );
  return baseUri ? resolve( baseUri, uri ) : uri;
};

// remove trailing slash
module.exports.normaliser = function( uri ) {
  if( ( 'string' !== typeof uri ) || !uri.length ) throw new Error( 'invalid uri' );
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
  if( !options.resolver ) options.resolver = module.exports.resolver;
  if( !options.normaliser ) options.normaliser = module.exports.normaliser;
  if( 'boolean' !== typeof options.unique ) options.unique = true;

  // match all patterns and extract links
  var matches = body.match( options.pattern.search );
  if( Array.isArray( matches ) ){
    links = links.concat( matches.filter( String ).map( function( link ){
      return link.match( options.pattern.refine )[1];
    }));
  }

  // resolve links
  if( options.resolver ){
    links = links.map( function( link ){
      return options.resolver( link, uri );
    });
  }

  // normalise links
  if( options.normaliser ){
    links = links.map( function( link ){
      return options.normaliser( link );
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