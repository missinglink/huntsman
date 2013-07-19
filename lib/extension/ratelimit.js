
/*
  rate limit extension designed to backoff according to the github api rate limiting headers
  http://developer.github.com/v3/#rate-limiting
*/

module.exports = function( options ){
  return function( huntsman, err, res, cb ){

    // detect when we get rate limited
    if( res && res.headers && 'x-ratelimit-remaining' in res.headers ){
      var restored = parseInt( res.headers[ 'x-ratelimit-reset' ], 10 ) * 1000;
      var ratelimit = {
        used: res.headers[ 'x-ratelimit-remaining' ] + ' / ' + res.headers[ 'x-ratelimit-limit' ],
        wait: Math.round( ( restored - new Date().getTime() ) / 1000 / 60 ) + ' mins'
      };
      console.error( '------- rate limit -------' );
      console.error( 'rate limit remaining: ', ratelimit.used );

      if( res.headers[ 'x-ratelimit-remaining' ] === '0' ){
        console.error( 'rate limit restored: ' + new Date( restored ) );
        console.error( 'rate limit wait: ' + ratelimit.wait );
        huntsman.queue.add( res.uri ); // retry uri

        // backoff until ratelimit is restored
        huntsman.wait( restored - new Date().getTime() );
      }
      console.error( '----------------------' );
    }

    return cb();
  };
};