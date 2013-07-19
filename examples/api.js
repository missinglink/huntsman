
/** Crawl the github api **/

var huntsman = require('huntsman');
var spider = huntsman.spider({
  throttle: ( 6 / 60 ) // max 6 request per min (unauthenticated clients can only make up to 60 requests per hour)
});

spider.extensions = [
  huntsman.extension( 'recurse', {  // load recurse extension & follow 'followers' links
    pattern: {
      search: /"followers_url"\s?:\s?"([^"]+)/gi, // extract 'followers' links
      refine: /"followers_url"\s?:\s?"([^"#]+)/i
    }
  }),
  huntsman.extension( 'ratelimit' ), // handle github api rate limiting
  huntsman.extension( 'json' ), // parse json
  huntsman.extension( 'stats' ) // load stats extension
];

// find all followers recursively
spider.on( /followers$/, function ( err, res ){

  console.log( res.uri );

  // print response
  var json = res.extension.json;
  if( json ) console.log( json );

});

spider.queue.add( 'https://api.github.com/users/missinglink/followers' );
spider.start();
console.log( 'DEMO: refreshing ' + ( spider.options.throttle * 60 ) + ' times per minute' );