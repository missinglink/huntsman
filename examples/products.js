
/** Example of scraping products from the amazon website **/

var huntsman = require('huntsman');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'recurse' ), // load recurse extension & follow anchor links
  huntsman.extension( 'cheerio' ) // load cheerio extension
];

// target only product uris
spider.on( '/gp/product/', function ( err, res ){

  if( !res.extension.cheerio ) return; // content is not html
  var $ = res.extension.cheerio;

  // extract product information
  var product = {
    uri: res.uri,
    heading: $('h1.parseasinTitle').text().trim(),
    image: $('img#main-image').attr('src'),
    description: $('#productDescription').text().trim().substr( 0, 50 )
  };

  console.log( product );

});

spider.queue.add( 'http://www.amazon.co.uk/' );
spider.start();