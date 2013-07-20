
/** Example of scraping information about pets for sale on cragslist in london **/

var huntsman = require('huntsman');
var spider = huntsman.spider({
  throttle: 2
});

spider.extensions = [
  huntsman.extension( 'recurse' ), // load recurse extension & follow anchor links
  huntsman.extension( 'cheerio' ), // load cheerio extension
  huntsman.extension( 'stats' ) // load stats extension
];

// target only pet uris
spider.on( /\/pet\/(\w+)\.html$/, function ( err, res ){

  if( !res.extension.cheerio ) return; // content is not html
  var $ = res.extension.cheerio;

  // extract listing information
  var listing = {
    heading: $('h2.postingtitle').text().trim(),
    uri: res.uri,
    image: $('img#iwi').attr('src'),
    description: $('#postingbody').text().trim().substr( 0, 50 )
  };

  console.log( listing );

});

// hub pages
spider.on( /http:\/\/london\.craigslist\.co\.uk$/ );
spider.on( /\/pet$/ );

spider.queue.add( 'http://www.craigslist.org/about/sites' );
spider.start();