
// This example is not quite finished yet.

var path = require('path');
var huntsman = require('../index');
var filename = path.resolve( './cache.json' );

huntsman.storage( 'filesystem', filename, { writeInterval: 1000 } );

var spider = huntsman.spider(  );

spider.extensions = [
  huntsman.extension( 'stats' ),
  huntsman.extension( 'recurse' ),
  huntsman.extension( 'cheerio' )
];

spider.on( /http:\/\/en\.wikipedia\.org\/wiki\/\w+:\w+$/, function ( err, res, body, $ ){
  console.log({
    uri: res.uri,
    heading: $('h1.firstHeading').text().trim(),
    body: $('div#mw-content-text p').text().trim()
  });
});

spider.queue.add( 'http://en.wikipedia.org/wiki/Main_Page' );
spider.start();