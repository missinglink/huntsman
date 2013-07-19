
/** Crawl wikipedia and use jquery syntax to extract information from the page **/

var huntsman = require('huntsman');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'recurse' ), // load recurse extension & follow anchor links
  huntsman.extension( 'cheerio' ) // load cheerio extension
];

// follow pages which match this uri regex
spider.on( /http:\/\/en\.wikipedia\.org\/wiki\/\w+:\w+$/, function ( err, res ){

  // use jquery-style selectors & functions
  var $ = res.extension.cheerio;

  // extract information from page body
  var wikipedia = {
    uri: res.uri,
    heading: $('h1.firstHeading').text().trim(),
    body: $('div#mw-content-text p').text().trim()
  };

  console.log( wikipedia );

});

spider.queue.add( 'http://en.wikipedia.org/wiki/Huntsman_spider' );
spider.start();