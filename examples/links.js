
/** Crawl wikipedia and extract script tags from the response body **/

var huntsman = require('huntsman');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'recurse' ), // load recurse extension & follow anchor links
  huntsman.extension( 'links' ) // load links extension
];

// follow pages which match this uri regex
spider.on( /http:\/\/en\.wikipedia\.org\/wiki\/\w+:\w+$/, function ( err, res ){

  // extract all script tags from body
  var scripts = res.extension.links({
    pattern: {
      search: /script([^>]+)src\s*=\s*['"]([^"']+)/gi, // extract script tags and allow fragment hash
      refine: /['"]([^"']+)$/ // allow fragment hash
    }
  });

  console.log( scripts );

});

spider.queue.add( 'http://en.wikipedia.org/wiki/Huntsman_spider' );
spider.start();