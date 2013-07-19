
/** Crawl wikipedia and list all pages which match the specified uri **/

var huntsman = require('huntsman');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'recurse' ) // load recurse extension & follow anchor links
];

// follow pages which match this uri string
spider.on( 'http://en.wikipedia.org/wiki/', function ( err, res ){

  // print http response
  console.log( res.statusCode, res.uri );
  console.log( res.headers );
  console.log( res.body.substr( 0, 150 ) + '..' );

});

spider.queue.add( 'http://en.wikipedia.org/wiki/Huntsman_spider' );
spider.start();