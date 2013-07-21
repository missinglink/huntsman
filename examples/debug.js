
/** Debug the results of the link extension before configuring recurse patterns **/

var huntsman = require('huntsman');
var spider = huntsman.spider();

spider.extensions = [
  huntsman.extension( 'links' ),
  huntsman.extension( 'recurse' ),
  huntsman.extension( 'stats' )
];

spider.on( 'error', console.log );

// emit on only the homepage
spider.on( /^http:\/\/www\.amazon\.co\.uk\/$/, function ( err, res ){

  if( !res.extension.links ) return; // content is not html

  var links = res.extension.links( {
    pattern: {
      search: /a([^>]+)href\s?=\s?['"]([^"'#\?]+)/gi, // ignore query section of uri
      filter: /\/gp\/product\/[A-Z0-9]+/ // match only product links
    }
  });

  console.log( links );

});

spider.queue.add( 'http://www.amazon.co.uk/' );
spider.start();