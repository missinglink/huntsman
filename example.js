
var huntsman = require('./index');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'stats' ),
  huntsman.extension( 'recurse' ),
  huntsman.extension( 'cheerio' )
];

spider.on( /http:\/\/en\.wikipedia\.org\/wiki\/\w+:\w+$/, function ( err, res, body, $ ){

  // console.log( ' -> ' + res.uri );
  // console.log( $('h1.firstHeading').text().trim() );
  // console.log( $('div#mw-content-text p').first().text().trim() );
  // console.log();

});

spider.queue.add( 'http://en.wikipedia.org/wiki/Main_Page' );
spider.start();