
/** Most basic example, process queue in order & do not recurse **/

var huntsman = require('../index');
var spider = huntsman.spider();

// follow pages which match this uri string
spider.on( 'http://en.wikipedia.org/wiki/', function ( err, res ){

  // print http response
  console.log( res.statusCode, res.uri );
  console.log( res.headers );
  console.log( res.body.substr( 0, 150 ) + '..' );

});

spider.queue.add( 'http://en.wikipedia.org/wiki/Huntsman_spider' );
spider.queue.add( 'http://en.wikipedia.org/wiki/Main_Page' );
spider.start();