
/** This example is not quite finished yet. **/

// var path = require('path');
// var huntsman = require('huntsman');
// var filename = path.resolve('./cache.json');

// var spider = huntsman.spider({
//   storage: huntsman.storage( 'filesystem', filename, { writeInterval: 1000 } )
// });

// spider.extensions = [
//   huntsman.extension( 'recurse' ) // load recurse extension & follow anchor links
// ];

// // follow pages which match this uri string
// spider.on( 'http://en.wikipedia.org/wiki/', function ( err, res ){

//   // print http response
//   console.log( res.statusCode, res.uri );
//   console.log( res.headers );
//   console.log( res.body.substr( 0, 150 ) + '..' );

// });

// spider.queue.add( 'http://en.wikipedia.org/wiki/Main_Page' );
// spider.start();