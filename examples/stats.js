
/** Crawl wikipedia and log statistics **/

var huntsman = require('huntsman');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'recurse' ), // load recurse extension & follow anchor links
  huntsman.extension( 'stats' ) // load stats extension
];

// follow pages which match this uri regex
spider.on( /http:\/\/en\.wikipedia\.org\/wiki\/\w+:\w+$/, function ( err, res ){

  // just show stats

});

spider.queue.add( 'http://en.wikipedia.org/wiki/Huntsman_spider' );
spider.start();