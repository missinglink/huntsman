
/** Crawl the github api **/

var huntsman = require('huntsman');
var spider = huntsman.spider({
  throttle: ( 1 / 60 ) // unauthenticated clients can only make up to 60 requests per hour
});

spider.extensions = [
  huntsman.extension( 'recurse', {  // load recurse extension & follow 'followers' links
    pattern: {
      search: /"followers_url"\s?:\s?"([^"]+)/gi, // extract 'followers' links
      refine: /"followers_url"\s?:\s?"([^"#]+)/
    }
  })
];

// detect when we get rate limited
spider.on( 'response', function( err, res ){
  if( res && res.headers && res.headers[ 'x-ratelimit-remaining' ] == '0' ){
    console.log( 'rate limited', res.headers[ 'x-ratelimit-remaining' ] + '/' + res.headers[ 'x-ratelimit-limit' ] );
    console.log( 'rate limit retored at ' + new Date( parseInt( res.headers[ 'x-ratelimit-reset' ], 10 ) * 1000 ) );
  }
});

// find followers pages
spider.on( /followers$/, function ( err, res ){

  var json = JSON.parse( res.body );

  // print http response
  console.log( res.uri );
  json.forEach( function( user ){
    console.log( user.id, user.login );
  });

});

spider.queue.add( 'https://api.github.com/users/missinglink' );
spider.start();